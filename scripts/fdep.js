const { ethers } = require("hardhat");

async function main() {
    const CombinedToken = await ethers.getContractFactory("CombinedToken");
    
    const combinedToken = await CombinedToken.deploy(
      7, // totalTaxPercent
      2,  // burnTaxPercent
      1,  // walletTaxPercent
      [ // walletAddresses
      "0x99c50a67C6B59d6b89a2FE8fd1cd43Cb604883b8",
      "0x9B7A0bD3d17D75287423ddC14a1fA5A47B8eEA2c",
      "0x177aE3E7534F05608F1921eC9EfD1f022E2773D5",
      "0x677C93dDDe4fb76375aB91a84Cad3b914C423ac8",
      "0x077459a20210855048FcFB68361a0A35838E30a8"
  ], // walletAddresses
  {gasLimit: 1500000}
    );
    
    console.log("CombinedToken deployed to:", combinedToken.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  
  