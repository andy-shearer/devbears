const { ethers } = require("hardhat");

async function main() {
  const bearsContract = await ethers.getContractFactory("Bears");
  const deployedContract = await bearsContract.deploy("https://devbears.vercel.app/api/");

  await deployedContract.deployed();

  console.log("Contract deployed to:", deployedContract.address);

  let tx = await deployedContract.mint(
    "123",
    {
      value: ethers.utils.parseEther("0.05"),
    }
  );

  tx = await deployedContract.tokenURI(1);
  console.log("Newly minted token URI", tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
