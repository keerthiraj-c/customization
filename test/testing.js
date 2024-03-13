const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CombinedToken", function () {
  let CombinedToken;
  let combinedToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const totalTaxPercent = 7;
  const burnTaxPercent = 2;
  const walletTaxPercent = 1;

  beforeEach(async function () {
    CombinedToken = await ethers.getContractFactory("CombinedToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    combinedToken = await CombinedToken.deploy(
      totalTaxPercent,
      burnTaxPercent,
      walletTaxPercent,
      [addrs[0].address, addrs[1].address, addrs[2].address, addrs[3].address, addrs[4].address]
    );

    //await combinedToken.deployed();
  });

  it("Should return the correct name and symbol", async function () {
    expect(await combinedToken.name()).to.equal("Combined Token");
    expect(await combinedToken.symbol()).to.equal("COMB");
  });

  it("Should add and remove from whitelist", async function () {
    await combinedToken.addToWhitelist(addr1.address, 1000);
    expect(await combinedToken.isWhitelisted(addr1.address)).to.equal(true);

    await combinedToken.removeFromWhitelist(addr1.address);
    expect(await combinedToken.isWhitelisted(addr1.address)).to.equal(false);
  });

  it("Should add and remove from blacklist", async function () {
    await combinedToken.addToBlacklist(addr1.address);
    expect(await combinedToken.isBlacklisted(addr1.address)).to.equal(true);

    await combinedToken.removeFromBlacklist(addr1.address);
    expect(await combinedToken.isBlacklisted(addr1.address)).to.equal(false);
  });

  it("Should set tax percentages", async function () {
    await combinedToken.setTotalTaxPercent(7);
    expect(await combinedToken.totalTaxPercent()).to.equal(7);

    await combinedToken.setBurnTaxPercent(2);
    expect(await combinedToken.burnTaxPercent()).to.equal(2);

    await combinedToken.setWalletTaxPercent(1);
    expect(await combinedToken.walletTaxPercent()).to.equal(1);
  });

  it("Should transfer tokens with taxes", async function () {
    await combinedToken.addToWhitelist(addr1.address, 100);
    await combinedToken.transfer(addr1.address, 100);

    const addr1Balance = await combinedToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(93);

    // Transfer tokens from addr1 to addr2
    await combinedToken.connect(addr1).transfer(addr2.address, 100);

    const addr1NewBalance = await combinedToken.balanceOf(addr1.address);
    const addr2Balance = await combinedToken.balanceOf(addr2.address);
    expect(addr1NewBalance).to.equal(0);
    expect(addr2Balance).to.equal(93);

    // Ensure burn and wallet taxes are applied correctly
   
    const expectedBurnAmount = BigInt(Math.floor((totalTaxPercent * burnTaxPercent) / 100));
    const expectedWalletTaxAmount = BigInt(Math.floor((totalTaxPercent * walletTaxPercent) / 100));

   const burnAddressBalance = await combinedToken.balanceOf("0x000000000000000000000000000000000000dEaD");
    expect(burnAddressBalance).to.equal(expectedBurnAmount);

    const wallet1Balance = await combinedToken.balanceOf(addrs[0].address);
    const wallet2Balance = await combinedToken.balanceOf(addrs[1].address);
    const wallet3Balance = await combinedToken.balanceOf(addrs[2].address);
    const wallet4Balance = await combinedToken.balanceOf(addrs[3].address);
    const wallet5Balance = await combinedToken.balanceOf(addrs[4].address);

   const totalWalletTax = wallet1Balance + wallet2Balance + wallet3Balance + wallet4Balance + wallet5Balance;
   expect(totalWalletTax).to.equal(expectedWalletTaxAmount);
  });
});
