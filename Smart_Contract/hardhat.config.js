require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

const { REACT_APP_MNEMONIC, REACT_APP_INFURA_ID, REACT_APP_ESCAPIKEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    // mainnet: {
    //   url:`https://mainnet.infura.io/v3/${REACT_APP_INFURA_ID}`,
    //   accounts:[REACT_APP_MNEMONIC]
    // },
    goerli: {
      url:`https://goerli.infura.io/v3/${REACT_APP_INFURA_ID}`,
      accounts:[REACT_APP_MNEMONIC]
    }
  },
  etherscan:{
    apiKey: REACT_APP_ESCAPIKEY
  }
};
