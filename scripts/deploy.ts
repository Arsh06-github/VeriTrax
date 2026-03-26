import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Veritrax Charity Platform contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CharityPlatform
  console.log("\n1. Deploying CharityPlatform...");
  const CharityPlatform = await ethers.getContractFactory("CharityPlatform");
  const charityPlatform = await CharityPlatform.deploy();
  await charityPlatform.waitForDeployment();
  const charityPlatformAddress = await charityPlatform.getAddress();
  console.log("CharityPlatform deployed to:", charityPlatformAddress);

  // Deploy DonationEscrow
  console.log("\n2. Deploying DonationEscrow...");
  const DonationEscrow = await ethers.getContractFactory("DonationEscrow");
  const donationEscrow = await DonationEscrow.deploy();
  await donationEscrow.waitForDeployment();
  const donationEscrowAddress = await donationEscrow.getAddress();
  console.log("DonationEscrow deployed to:", donationEscrowAddress);

  // Deploy MerkleVerifier
  console.log("\n3. Deploying MerkleVerifier...");
  const MerkleVerifier = await ethers.getContractFactory("MerkleVerifier");
  const merkleVerifier = await MerkleVerifier.deploy();
  await merkleVerifier.waitForDeployment();
  const merkleVerifierAddress = await merkleVerifier.getAddress();
  console.log("MerkleVerifier deployed to:", merkleVerifierAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("CharityPlatform:", charityPlatformAddress);
  console.log("DonationEscrow:", donationEscrowAddress);
  console.log("MerkleVerifier:", merkleVerifierAddress);
  console.log("\nDeployment completed successfully!");

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      CharityPlatform: charityPlatformAddress,
      DonationEscrow: donationEscrowAddress,
      MerkleVerifier: merkleVerifierAddress,
    },
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
