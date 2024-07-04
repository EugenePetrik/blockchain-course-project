async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const Lottery = await hre.ethers.getContractFactory('Lottery');
  const lottery = await Lottery.deploy();

  console.log('Lottery contract deployed to address:', lottery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
