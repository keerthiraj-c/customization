const { expect } = require("chai");
const { ethers } = require("hardhat");




describe("CombinedToken", function () {
  let CombinedToken;
  let combinedToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  

  beforeEach(async function () {
    CombinedToken = await ethers.getContractFactory("CombinedToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    combinedToken = await CombinedToken.deploy(
      7, // totalTaxPercent
      2, // burnTaxPercent
      1, // walletTaxPercent
      [addr1.address, addr2.address, addrs[0].address, addrs[1].address, addrs[2].address] // walletAddresses
    );
    
  });

  it("Should return the correct name and symbol", async function () {
    expect(await combinedToken.name()).to.equal("Combined Token");
    expect(await combinedToken.symbol()).to.equal("COMB");
  });

  it("Should add an address to the whitelist", async function () {
    await combinedToken.addToWhitelist(addr1.address, 100);
    const isWhitelisted = await combinedToken.isWhitelisted(addr1.address);
    expect(isWhitelisted).to.be.true;
    const maxTransactionAmount = await combinedToken.getMaxTransactionAmount(addr1.address);
    expect(maxTransactionAmount).to.equal(100);
  });

  it("Should remove an address from the whitelist", async function () {
    await combinedToken.addToWhitelist(addr1.address, 100);
    await combinedToken.removeFromWhitelist(addr1.address);
    const isWhitelisted = await combinedToken.isWhitelisted(addr1.address);
    expect(isWhitelisted).to.be.false;
  });

  it("Should add an address to the blacklist", async function () {
    await combinedToken.addToBlacklist(addr1.address);
    const isBlacklisted = await combinedToken.isBlacklisted(addr1.address);
    expect(isBlacklisted).to.be.true;
  });

  it("Should remove an address from the blacklist", async function () {
    await combinedToken.addToBlacklist(addr1.address);
    await combinedToken.removeFromBlacklist(addr1.address);
    const isBlacklisted = await combinedToken.isBlacklisted(addr1.address);
    expect(isBlacklisted).to.be.false;
  });

  it("Should set total tax percentage", async function () {
    await combinedToken.setTotalTaxPercent(7);
    expect(await combinedToken.totalTaxPercent()).to.equal(7);
  });

  it("Should set burn tax percentage", async function () {
    await combinedToken.setBurnTaxPercent(2);
    expect(await combinedToken.burnTaxPercent()).to.equal(2);
  });

  it("Should set wallet tax percentage", async function () {
    await combinedToken.setWalletTaxPercent(1);
    expect(await combinedToken.walletTaxPercent()).to.equal(1);
  });

  it("Should transfer tokens with tax", async function () {
    await combinedToken.transfer(addr1.address, 100);
    const addr1Balance = await combinedToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(93);
  });

  it("Should revert when setting invalid total tax percentage", async function () {
    await expect(combinedToken.setTotalTaxPercent(101)).to.be.revertedWith("Invalid tax percentage");
  });

  it("Should revert when setting invalid burn tax percentage", async function () {
    await expect(combinedToken.setBurnTaxPercent(101)).to.be.revertedWith("Invalid tax percentage");
  });

  it("Should revert when setting invalid wallet tax percentage", async function () {
    await expect(combinedToken.setWalletTaxPercent(101)).to.be.revertedWith("Invalid tax percentage");
  });

  it("Should revert when setting invalid number of wallet addresses", async function () {
    await expect(
      CombinedToken.deploy(
        7, // totalTaxPercent
        2, // burnTaxPercent
        1, // walletTaxPercent
        [addr1.address, addr2.address, addrs[0].address, addrs[1].address] // walletAddresses
      )
    ).to.be.revertedWith("Invalid number of wallet addresses");
  });

  it("should transfer tokens with taxes applied from allowance", async function () {
    await combinedToken.approve(addr1.address, 100);
    await combinedToken.connect(addr1).transferFrom(owner.address, addr2.address, 100);
    expect(await combinedToken.balanceOf(addr2.address)).to.equal(93);
  });





  it("Should revert when setting invalid total tax percentage", async function () {
    await expect(combinedToken.setTotalTaxPercent(101)).to.be.revertedWith("Invalid tax percentage");
  });

  it("Should revert when setting invalid burn tax percentage", async function () {
    await expect(combinedToken.setBurnTaxPercent(101)).to.be.revertedWith("Invalid tax percentage");
  });

  it("Should revert when setting invalid wallet tax percentage", async function () {
    await expect(combinedToken.setWalletTaxPercent(101)).to.be.revertedWith("Invalid tax percentage");
  });

  it("Should revert when setting invalid number of wallet addresses", async function () {
    await expect(
      CombinedToken.deploy(
        7, // totalTaxPercent
        2, // burnTaxPercent
        1, // walletTaxPercent
        [addr1.address, addr2.address, addrs[0].address, addrs[1].address] // walletAddresses
      )
    ).to.be.revertedWith("Invalid number of wallet addresses");
  });

  it("should emit TransferWithTax event on transfer", async function () {
    const amount = ethers.parseEther("100");
    await combinedToken.addToWhitelist(owner.address, ethers.parseEther("100")); 
    await expect(combinedToken.transfer(addr1.address, amount))
      .to.emit(combinedToken, "TransferWithTax")
     
  });
});
  



  


