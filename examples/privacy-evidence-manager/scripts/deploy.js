const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║   Privacy Evidence Manager - Deployment Script                ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝\n");

  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;

  console.log("📋 Deployment Information:");
  console.log("─────────────────────────────────────────────────────────────────");
  console.log(`Network:          ${network}`);
  console.log(`Chain ID:         ${chainId}`);
  console.log(`Deployer:         ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:          ${hre.ethers.formatEther(balance)} ETH`);
  console.log("─────────────────────────────────────────────────────────────────\n");

  // Deploy PrivacyEvidenceManager
  console.log("🚀 Deploying PrivacyEvidenceManager contract...\n");

  const PrivacyEvidenceManager = await hre.ethers.getContractFactory("PrivacyEvidenceManager");
  const evidenceManager = await PrivacyEvidenceManager.deploy();

  await evidenceManager.waitForDeployment();
  const contractAddress = await evidenceManager.getAddress();

  console.log("✅ Deployment Successful!\n");
  console.log("📝 Contract Details:");
  console.log("─────────────────────────────────────────────────────────────────");
  console.log(`Contract Name:    PrivacyEvidenceManager`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Network:          ${network} (Chain ID: ${chainId})`);
  console.log(`Deployment Tx:    ${evidenceManager.deploymentTransaction().hash}`);
  console.log("─────────────────────────────────────────────────────────────────\n");

  // Get Etherscan link
  const etherscanBaseUrl = getEtherscanUrl(network);
  if (etherscanBaseUrl) {
    console.log("🔗 Block Explorer Links:");
    console.log("─────────────────────────────────────────────────────────────────");
    console.log(`Contract: ${etherscanBaseUrl}/address/${contractAddress}`);
    console.log(`Deployment Tx: ${etherscanBaseUrl}/tx/${evidenceManager.deploymentTransaction().hash}`);
    console.log("─────────────────────────────────────────────────────────────────\n");
  }

  // Save deployment info
  const deploymentInfo = {
    network: network,
    chainId: chainId.toString(),
    contractName: "PrivacyEvidenceManager",
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTx: evidenceManager.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    blockNumber: evidenceManager.deploymentTransaction().blockNumber,
    etherscanUrl: etherscanBaseUrl ? `${etherscanBaseUrl}/address/${contractAddress}` : "",
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network}_deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment information saved to:");
  console.log(`   ${deploymentFile}\n`);

  // Wait for block confirmations before verification
  if (network !== "hardhat" && network !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await evidenceManager.deploymentTransaction().wait(5);
    console.log("✅ Block confirmations received\n");

    console.log("📝 To verify the contract, run:");
    console.log(`   npx hardhat run scripts/verify.js --network ${network}\n`);
  }

  console.log("🎉 Deployment Complete!\n");

  return {
    contractAddress,
    deploymentInfo,
  };
}

function getEtherscanUrl(network) {
  const urls = {
    mainnet: "https://etherscan.io",
    sepolia: "https://sepolia.etherscan.io",
    goerli: "https://goerli.etherscan.io",
    polygon: "https://polygonscan.com",
    mumbai: "https://mumbai.polygonscan.com",
    bsc: "https://bscscan.com",
    bscTestnet: "https://testnet.bscscan.com",
  };
  return urls[network] || "";
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Failed:");
    console.error(error);
    process.exit(1);
  });
