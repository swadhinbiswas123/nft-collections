// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const deposit_Add = process.env.REACT_APP_DEPOSIT_ADD;
  const base_Uri = process.env.REACT_APP_BASEURI;

  const NFTCollections = await hre.ethers.getContractFactory("NFTCollections");
  const nFTCollections = await NFTCollections.deploy("NFT Collections", "NCN", deposit_Add, base_Uri,50);

  await nFTCollections.deployed();

  console.log(
    `Contract deployed to ${nFTCollections.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
