import { task } from "hardhat/config";
// import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
import "@nomiclabs/hardhat-web3";


task("mint", "Mint NFTs on Iwaves")
.addParam("address", "Address to mint the NFT to")
.addParam("amount", "Number of NFTs to be minted")
.setAction(async (taskArgs,hre) => {
  const [sender, secondaccount, thirdaccount, fourthaccount] = await hre.ethers.getSigners();
  const CRIkhlas721 = await hre.ethers.getContractFactory("CRIkhlas721");
  const cRIkhlas721 = await CRIkhlas721.deploy();
  await cRIkhlas721.deployed();

  let output = await cRIkhlas721.connect(sender).mint(taskArgs.address, taskArgs.amount);

console.log(await output);
});