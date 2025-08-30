const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; 
  const contractABI = require("../artifacts/contracts/ReliefFund.sol/ReliefFund.json").abi;

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Hardhat/Localhost
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  console.log("Listening for contract events...");

  // Example: DonationReceived event
  contract.on("DonationReceived", (donor, amount, event) => {
    console.log(`💰 Donation from ${donor} of amount: ${ethers.formatEther(amount)} ETH`);
    // TODO: Save this to DB / Firebase
  });

  // Example: ClaimSubmitted event
  contract.on("ClaimSubmitted", (claimId, victim, docsCID, event) => {
    console.log(`📄 Claim #${claimId} submitted by ${victim}, docs: ${docsCID}`);
    // TODO: Save this to DB / Firebase
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
