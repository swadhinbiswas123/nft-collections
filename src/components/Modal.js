import React from 'react'
import "./Modal.css"
function Modal({errorMsg,setIsModalOpen, mintingEnabled}) {
  let newErrmsg;
  if(errorMsg === -32000){
    newErrmsg = "Insufficient Balance, please check your balance"
  }else if(errorMsg === -32603){
    newErrmsg = "You have to mint at least 1 NFT"
  }else if(mintingEnabled === false){
    newErrmsg = "Minting has not started yet"
  }else{
    newErrmsg = "There is some issue with your minting, check the quantity or wallet balance or you denied the transaction"
  }
  return (
    <div id="myModal" className="modal">
    <div className="modal-content">
    <span className="close" onClick={()=>setIsModalOpen(false)}>&times;</span>
    <h4>{newErrmsg}</h4>
  </div>

</div>
  )
}

export default Modal