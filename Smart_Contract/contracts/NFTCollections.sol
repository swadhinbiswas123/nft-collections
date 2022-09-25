// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollections is ERC721A, Ownable {
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxSupply;
    bool public isMintingEnabled;
    mapping(address => bool) public whiteList;
    bool isPublicEnabled;
    uint256 private publicMintPrice;
    string internal baseTokenUri;
    address payable public depositWallet;

    constructor(
    string memory _name,
    string memory _symbol,
    address payable _depositWallet, 
    string memory _tokenBaseUri, 
    uint256 _maxSupply
    ) ERC721A(_name, _symbol){
        maxSupply = _maxSupply;
        depositWallet = _depositWallet;
        baseTokenUri = _tokenBaseUri;
        isMintingEnabled = false;
    }

    modifier isWhiteListed(){
        require(whiteList[msg.sender] == true);
        _;
    }

    function setIsMintingEnabled() external onlyOwner{
        isMintingEnabled = true;
    }

    function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner{
        baseTokenUri = _baseTokenUri;
    }
    function setPublicMintingPrice(uint256 _publicMintPrice) public onlyOwner{
        publicMintPrice = _publicMintPrice;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return bytes(baseTokenUri).length != 0 ? string(abi.encodePacked(baseTokenUri, _toString(tokenId),".json")) : "";
    }

    function withdraw() external onlyOwner{
        (bool success,) = depositWallet.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function setMintPrice(uint256 _price ) public onlyOwner{
        mintPrice = _price;
    }

    function setPublicSale()public onlyOwner{
        isMintingEnabled = false;
        isPublicEnabled = true;
    }

    function changeDepositWallet(address payable _newWithdrawalWallet)public onlyOwner{
        depositWallet = _newWithdrawalWallet;
    }
    
    function setWhiteList(address [] calldata _addresses) public {
        for(uint256 i =0 ; i<_addresses.length; i++){
            whiteList[_addresses[i]] = true;
        }
        
    }

    function mint(uint256 _quantity) external payable isWhiteListed{
        if(isPublicEnabled == true){
            whiteList[msg.sender] = false;
            mintPrice = publicMintPrice;
        }

        require(_quantity > 0, "You need to mint at least 1 NFT");
        require(isMintingEnabled, "Minting is not started yet");
        require(msg.value == _quantity * mintPrice, "Insufficient Balance");
        require(totalSupply() + _quantity <= maxSupply, "Sold Out");

            _safeMint(msg.sender, _quantity);
        }
    }
