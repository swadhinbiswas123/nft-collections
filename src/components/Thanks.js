import React from 'react';
import '../App.css';

function Thanks({txhash}) {
  let link = `https://goerli.etherscan.io/tx/${txhash}`;
  return(
    
    <div className='thanks-div'>
        <h4>Congrats!!</h4>
        <h4>Thanks for minting with us</h4>
        <p>Check your transaction link:</p>
        <a href={link} target="_blank" ><button className="thanksbtn">View Transaction</button></a>
    </div>

  )
}

export default Thanks