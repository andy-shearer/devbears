const { ethers } = require("hardhat");

async function main() {
  const bearsContract = await ethers.getContractFactory("Bears");
  const deployedContract = await bearsContract.deploy("https://devbears.vercel.app/api/");

  await deployedContract.deployed();

  console.log("Contract deployed to:", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
