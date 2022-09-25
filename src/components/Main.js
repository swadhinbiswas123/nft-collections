import {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import '../App.css';
import "../responsive.css";
import logo from "../images/logo.png";
import {ethers} from "ethers";
import contract_abi from "./contract_abi/contract_abi.json";
import Thanks from "./Thanks";
import Modal from "./Modal";

 
const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // always save this key as a constant and then use it.
      },
    }
}

function Main() {
    const [isWhiteListed, setIsWhiteListed] = useState(false);
    const [contract, setContract] = useState({});
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [showPrice, setShowPrice] = useState(0);
    const [loading, setloading] = useState(false);
    const [txhash, setTxhash] = useState("");
    const [istran, setIsTran] = useState(false);
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
    const [isModalOpen, setIsModalOpen]= useState(false);
    const [errorMsg, setErrorMsg] = useState(0)
    const [mintingEnabled, seMintingEnabled] = useState(null);
    const [addr, setAddr] = useState("")
    const contract_Add = process.env.REACT_APP_CONTRACT_ADD

    const increment = ()=>{
        if(isWalletConnected === true){
            if(isWhiteListed === true){
                let newCount = quantity + 1;
                setQuantity(newCount);
            }else{
                alert("Sorry! You are not whitelisted")
            }
        }else{
            alert("Please connect your wallet");
        }
    }

    const decrement = ()=>{
        if(isWalletConnected === true){
        let newCount = quantity - 1;
        if(newCount <= 0){
            setQuantity(0);
        }else{
            setQuantity(newCount);
        }
        }else{
            alert("Please connect your wallet"); 
        }
    }

    const walletConnect = async()=>{
        try{
            let web3Modal = new Web3Modal({
                network:"goerli", //important 
                cacheProvider:true,
                providerOptions
            });

            let instance = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(instance);
                await provider.send("eth_requestAccounts", []);
                const { chainId } = await provider.getNetwork()
                if(chainId === 5){
                    const signer = await provider.getSigner();
                    const signerAddress = await signer.getAddress();
                    const nftCollections = new ethers.Contract(contract_Add, contract_abi, signer);
                    let maxSupply = await nftCollections.maxSupply();
                    if(nftCollections){
                        setContract(nftCollections);
                        setAddr(signerAddress);
                        setIsWalletConnected(true);
                        setloading(true);
                    }
                    let newAdd = signerAddress.toString();
                    let whitelisted = await nftCollections.whiteList(newAdd);
                    let mintingStatus = await nftCollections.isMintingEnabled();
                    seMintingEnabled(mintingStatus);
                    if(whitelisted === true){
                        setIsWhiteListed(true);
                        setloading(false);
                    }else{
                        setIsWhiteListed(false);
                    }
                } else{
                    alert("Please Select Goerli Network");
                }

        }catch(error){
            console.error(error);
        }

    }

    const mint = async()=>{
        let mintPrice;
        let tx;
        try{
            if(isWhiteListed){
                mintPrice = ethers.utils.parseEther("0.01");
                let value = (quantity * mintPrice).toString();
              tx = await contract.mint(quantity, {value:value});
              if(tx){
                let newTx = tx.hash;
                setTxhash(newTx);
                setIsTran(true);
               }
            }
            else{
                alert("Sorry! You are not whitelisted");
            }
            let supply = await contract.totalSupply();
            setTokenTotalSupply(supply);
        }catch(err){
            setIsModalOpen(true);
            setErrorMsg(err.error.code);
        }

    }

    const whiteListing = async ()=>{
        let tx = await contract.setWhiteList([addr]);
        let rs = await tx.wait();
        if(rs){
            window.location.reload(false);
        }
    }

    useEffect(()=>{
    if(isWhiteListed){
        let price = (quantity * .01).toFixed(2);
        setShowPrice(price);
    }
    }, [quantity, isWhiteListed])



    return (
        <>
        {isModalOpen ? <Modal errorMsg={errorMsg} setIsModalOpen={setIsModalOpen}  mintingEnabled={mintingEnabled}/>: ""}
        <header>
        <nav>
            <div className="logo-section"><a href="/"><img src={logo} alt="NFT Collections" /></a></div>
            <div className="card-section" onClick={walletConnect}>
                <h3>{isWalletConnected ? "Wallet Connected 👍" : "Connect Wallet"}</h3>
            </div>
        </nav>
    </header>
    <section>
        <div className="hero-section">
            <div className="hero-text-ariya">
                <p>This NFT Collection is deployed on <strong style={{color:"green"}}>goerli</strong> test netork and uploaded the NFT collections on opensea testnet. If you want to check all the functionality please switch to <strong style={{color:"green"}}>goerli</strong> testnet. You can also check all the functionality in the smart contract. Only whitelisted members can mint nft</p>
                <a href="https://testnets.opensea.io/collection/nft-collection-9dysxnfzdv" target="_blank"><div className="hero-btn">
                    <h3>Check NFT Collections</h3>
                </div></a>
            </div>
            {istran ? <Thanks txhash={txhash} /> :
            <div className="product-ariya">
                <h3>THE NFT COLLECTIONS</h3>
                <div className="product-prising-section">
                    <h4>Price <span>0.01 ETH</span></h4>
                </div>
                <h3>Put the number of NFTs</h3>
                <div className="price-quentity">
                    <h5>Quantity</h5>
                    <h5>Total Price</h5>
                </div> 
                {tokenTotalSupply !== 50 ?
                <div className="product-cal">
                    <button className="low-btn" onClick={decrement}>-</button>
                    <h5 className="pro-output">{quantity}</h5>
                    <button className="high-btn" onClick={increment}>+</button>
                    <h5 className="pro-price"><span>{showPrice} ETH</span></h5>
                </div> :<h4 style={{color:"red"}}>Sold Out</h4>}
                { isWalletConnected ?
                <div className="buynow-section">
                    <button className="buynow-btn" type="submit" onClick={mint}>
                    <h3>Mint Now</h3>
                    </button>
                </div>
                :<h3>Connect your wallet first</h3>
                }
                { isWalletConnected ?
                <div className="buynow-section">
                    <button className="buynow-btn" type="submit" onClick={whiteListing}>
                    <h3>{isWhiteListed ? "Whitelisted✌️✌️" : "👉Whitelist Me!"}</h3>
                    </button>
                </div>
                :""
                }
            </div>}
        </div> 

    </section>
        </>
    );
}

export default Main