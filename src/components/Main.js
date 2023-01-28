import {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import '../App.css';
import "../responsive.css";
import logo from "../images/logo.png";
import {ethers} from "ethers";
import contract_abi_one from "./contract_abi/contract_abi.json";
import contract_abi_two from "./contract_abi/contract_abi.json";
import Thanks from "./Thanks";
import { toast } from 'react-toastify';

const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
}
 
const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // always save this key as a constant and then use it.
      },
    }
}

function Main() {
    const [contract, setContract] = useState({});
    const [keysContract, setKeysContract] = useState({});
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [wisdomQuantity, setWisdomQuantity] = useState(0);
    const [keysQuantity, setKeysQuantity] = useState(0);
    const [showPrice, setShowPrice] = useState(0);
    const [keysShowPrice, setKeysShowPrice] = useState(0);
    const [loading, setloading] = useState(false);
    const [txhash, setTxhash] = useState("");
    const [istran, setIsTran] = useState(false);
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
    const [tokenMaxSupply, setTokenMaxSupply] = useState(0);
    const [errorMsg, setErrorMsg] = useState(0)
    const [mintingEnabled, seMintingEnabled] = useState(null);
    const contract_Add_One = "0x2Ec2AcA2e9662f3EB66ABB7cd5c22cE0Ca8c0df9"
    const contract_Add_Two = "0x2Ec2AcA2e9662f3EB66ABB7cd5c22cE0Ca8c0df9"

    const increment = (quantity, setQuantity)=>{
        if(isWalletConnected === true){
            let newCount = quantity + 1;
            setQuantity(newCount);
        }else{
            toast.error("Please connect your wallet", options);
        }
    }

    const decrement = (quantity, setQuantity)=>{
        if(isWalletConnected === true){
        let newCount = quantity - 1;
        if(newCount <= 0){
            setQuantity(0);
        }else{
            setQuantity(newCount);
        }
        }else{
            toast.error("Please connect your wallet", options); 
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
            if (chainId === 5) {
                    console.log(contract_Add_One);
                    const signer = await provider.getSigner();
                    const signerAddress = await signer.getAddress();
                    const nftCollections = new ethers.Contract(contract_Add_One, contract_abi_one, signer);
                    const keysCollections = new ethers.Contract(contract_Add_Two, contract_abi_two, signer);
                    // let maxSupply = (await nftCollections.maxSupply()).toString();
                    // let totalSupply = (await nftCollections.totalSupply()).toString();
                    if(nftCollections && keysCollections){
                        setContract(nftCollections);
                        setKeysContract(keysCollections);
                        setIsWalletConnected(true);
                        // setTokenTotalSupply(totalSupply);
                        // setTokenMaxSupply(maxSupply);
                        setloading(true);
                    }
                    let mintingStatus = await nftCollections.isMintingEnabled();
                    seMintingEnabled(mintingStatus);
                } else {
                    toast.error("Please Select Goerli Network", options);
                }

        }catch(error){
            console.error(error);
        }

    }

    const error = () => {
        if (errorMsg === -32000) {
          toast.error("Insufficient Balance, please check your balance", options);
        } else if (errorMsg === -32603) {
          toast.error("You have to mint at least 1 NFT", options);
        } else if (mintingEnabled === false) {
          toast.error("Minting has not started yet", options);
        } else {
          toast.error("Check the quantity or wallet balance or you denied the transaction", options);
        }
      }

    const mint = async()=>{
        let mintPrice;
        let tx;
        try {
            if (wisdomQuantity > 0) {
                mintPrice = ethers.utils.parseEther("0.01");
                let value = (wisdomQuantity * mintPrice).toString();
                tx = await contract.mint(wisdomQuantity, {value:value});
                if(tx){
                    let newTx = tx.hash;
                    setTxhash(newTx);
                    setIsTran(true);
                }
            } else {
                toast.error("You have to mint at least 1 NFT", options);
            }
        }catch(err){
            setErrorMsg(err.error.code);
            error();
        }

    }

    const mintKeys = async()=>{
        let mintPrice;
        let tx;
        try {
            if (keysQuantity > 0) {
                mintPrice = ethers.utils.parseEther("0.5");
                let value = (keysQuantity * mintPrice).toString();
                tx = await contract.mint(keysQuantity, {value:value});
                if(tx){
                    let newTx = tx.hash;
                    setTxhash(newTx);
                    setIsTran(true);
                }
            } else {
                toast.error("You have to mint at least 1 NFT", options);
            }
        }catch(err){
            setErrorMsg(err.error.code);
            error();
        }

    }

    useEffect(()=>{
    if(isWalletConnected){
        let price = (wisdomQuantity * .01).toFixed(2);
        setShowPrice(price);
    }
    }, [wisdomQuantity])

    useEffect(()=>{
        if(isWalletConnected){
            let price = (keysQuantity * .5).toFixed(2);
            setKeysShowPrice(price);
        }
        }, [keysQuantity])


    return (
        <>
        <header>
        <nav>
            <div className="logo-section"><a href="/"><img className="logo" src={logo} alt="NFT Collections" /></a></div>
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
                <h3>Wisdom Keys</h3>
                <div className="product-prising-section">
                    <h4>Price <span>0.05 ETH</span></h4>
                </div>
                <h3>Put the number of NFTs</h3>
                <div className="price-quentity">
                    <h5>Quantity</h5>
                    <h5>Total Price</h5>
                </div> 
                <div className="product-cal">
                    <button className="low-btn" onClick={()=>decrement(wisdomQuantity, setWisdomQuantity)}>-</button>
                    <h5 className="pro-output">{wisdomQuantity}</h5>
                    <button className="high-btn" onClick={()=>increment(wisdomQuantity, setWisdomQuantity)}>+</button>
                    <h5 className="pro-price"><span>{showPrice} ETH</span></h5>
                </div> 
                { isWalletConnected ?
                <div className="buynow-section">
                    <button className="buynow-btn" type="submit" onClick={mint}>
                    <h3>Mint Now</h3>
                    </button>
                </div>
                :<h3>Connect your wallet first</h3>
                }
            </div>}
        </div>
        <div className="secondCollection">
            <p> <span className="span">Mint Keys to the Castle NFTs</span></p>
            {istran ? <Thanks txhash={txhash} /> :
            <div className="keys-product-ariya">
                <h3>Keys to the Castle</h3>
                <div className="product-prising-section">
                    <h4>Price <span>0.5 ETH</span></h4>
                </div>
                <h3>Put the number of NFTs</h3>
                <div className="price-quentity">
                    <h5>Quantity</h5>
                    <h5>Total Price</h5>
                </div> 
                <div className="product-cal">
                    <button className="low-btn" onClick={()=>decrement(keysQuantity, setKeysQuantity)}>-</button>
                    <h5 className="pro-output">{keysQuantity}</h5>
                    <button className="high-btn" onClick={()=>increment(keysQuantity, setKeysQuantity)}>+</button>
                    <h5 className="pro-price"><span>{keysShowPrice} ETH</span></h5>
                </div> 
                { isWalletConnected ?
                <div className="buynow-section">
                    <button className="buynow-btn" type="submit" onClick={mintKeys}>
                    <h3>Mint Now</h3>
                    </button>
                </div>
                :<h3>Connect your wallet first</h3>
                }
            </div>}        
        </div>
    </section>
        </>
    );
}

export default Main