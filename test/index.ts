import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';
import { ethers, network} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {CRIkhlas721} from '../typechain'

async function getCurrentTime(){
    return (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
  }

async function evm_increaseTime(seconds : number){
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
  }

describe("Testing the ERC721 Contract", () =>{
    let nFT : CRIkhlas721;

    let clean : any;
    let owner : SignerWithAddress, signertwo : SignerWithAddress, signerthree: SignerWithAddress;
    
    before(async () => {

        [owner, signertwo, signerthree] = await ethers.getSigners();

        const NFT = await ethers.getContractFactory("CRIkhlas721");
        nFT = <CRIkhlas721>(await NFT.deploy());
        await nFT.deployed();
        
    });

    describe("Checking constructor is run correctly", () => {
        it("Checks the BaseURI is correct or not in constructor", async () => {
            expect(await nFT.baseURI()).to.be.equal("ipfs://QmT2WTwxp4mqpyRg9T5KnTN8W6a4VChGyhgV9cJCYjWf3c/");
        })
    })

    describe("Checking the mint function is working as desired", () => {
      it("Checks if mintAmount greater than limit is rejected or not", async () => {
        await expect(nFT.connect(owner).mint(owner.address, 100)).to.be.revertedWith("");
      })

      it("Checks if supply is 0 initially", async () => {
        expect(await nFT.connect(owner).totalSupply()).to.be.equal(0);
      })

      it("Checks if minting increases the totalSupply", async () => {
        await nFT.connect(owner).mint(owner.address, 2);
        expect(await nFT.connect(owner).totalSupply()).to.be.equal(2);
      })

      it("Checks if minting increases the WalletofOwner count", async () => {
        let stringConv = await (await nFT.connect(owner).walletOfOwner(owner.address)).toString();
        await expect(stringConv).to.be.equal("1,2");
      })

      // it("Checks if minting increases the WalletofOwner count", async () => {
      //   await expect(await nFT.connect(owner).walletOfOwner(owner.address)).eq(ethers.utils.parseUnits("1", 0));
      // })
    })

    describe("Checking the tokenURI function is working as desired", () => {
      it("Checks if input tokenId exists or not", async () => {
        await expect(nFT.connect(owner).tokenURI(3)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
      })

      it("Returns the correct tokenURI", async () => {
        await expect(await nFT.connect(owner).tokenURI(1)).to.be.equal("ipfs://QmT2WTwxp4mqpyRg9T5KnTN8W6a4VChGyhgV9cJCYjWf3c/1.json");
      })
    })


    describe("Checking the setMaxMintAmount function is working as desired", () => {
      it("Checks if maxmintamount has been updated", async () => {
        await nFT.connect(owner).setmaxMintAmount(7);
        await expect(7).to.equal(await nFT.maxMintAmount());
      })
    })


    describe("Checking the setBaseExtension function is working as desired", () => {
      it("Checks if setBaseExtension has been updated", async () => {
        await nFT.connect(owner).setBaseExtension(".test");
        await expect(".test").to.equal(await nFT.baseExtension());
      })
    })

})
