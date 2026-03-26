const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy CharityPlatform
  console.log("\nDeploying CharityPlatform...");
  const CharityPlatform = await hre.ethers.getContractFactory("CharityPlatform");
  const charityPlatform = await CharityPlatform.deploy();
  await charityPlatform.deployed();
  console.log("CharityPlatform deployed to:", charityPlatform.address);

  // Deploy EscrowManager
  console.log("\nDeploying EscrowManager...");
  const EscrowManager = await hre.ethers.getContractFactory("EscrowManager");
  const escrowManager = await EscrowManager.deploy();
  await escrowManager.deployed();
  console.log("EscrowManager deployed to:", escrowManager.address);

  // Deploy ProofVerification
  console.log("\nDeploying ProofVerification...");
  const ProofVerification = await hre.ethers.getContractFactory("ProofVerification");
  const proofVerification = await ProofVerification.deploy();
  await proofVerification.deployed();
  console.log("ProofVerification deployed to:", proofVerification.address);

  // Deploy TokenRewards
  console.log("\nDeploying TokenRewards...");
  const TokenRewards = await hre.ethers.getContractFactory("TokenRewards");
  const tokenRewards = await TokenRewards.deploy();
  await tokenRewards.deployed();
  console.log("TokenRewards deployed to:", tokenRewards.address);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      CharityPlatform: charityPlatform.address,
      EscrowManager: escrowManager.address,
      ProofVerification: proofVerification.address,
      TokenRewards: tokenRewards.address,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on Etherscan (if not on localhost/hardhat)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await charityPlatform.deployTransaction.wait(6);
    
    console.log("\nVerifying contracts on Etherscan...");
    
    try {
      await hre.run("verify:verify", {
        address: charityPlatform.address,
        constructorArguments: [],
      });
      console.log("CharityPlatform verified");
    } catch (error) {
      console.log("CharityPlatform verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: escrowManager.address,
        constructorArguments: [],
      });
      console.log("EscrowManager verified");
    } catch (error) {
      console.log("EscrowManager verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: proofVerification.address,
        constructorArguments: [],
      });
      console.log("ProofVerification verified");
    } catch (error) {
      console.log("ProofVerification verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: tokenRewards.address,
        constructorArguments: [],
      });
      console.log("TokenRewards verified");
    } catch (error) {
      console.log("TokenRewards verification failed:", error.message);
    }
  }

  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
