const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const RentalAgreement = await hre.ethers.getContractFactory("RentalAgreement");
  const contract = await RentalAgreement.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("RentalAgreement deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
