async function main() {
  console.log("🚀 Deploying ReliefFund contract...");

  const ReliefFund = await ethers.getContractFactory("EfficientDisasterRelief");
  const reliefFund = await ReliefFund.deploy();

  await reliefFund.waitForDeployment(); // ✅ Correct method for ethers v6

  console.log(`✅ EfficientDisasterRelief deployed successfully at: ${await EfficientDisasterRelief.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
