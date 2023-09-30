const { resolve } = require("path");
const { config } = require("dotenv");
config({ path: resolve(__dirname, "./.env") });

const parseEth = (eth) => ethers.utils.parseEther(String(eth));

async function main() {
  const Fundraiser = await deployContract("Fundraiser", []);
  // await Fundraiser.deployTransaction.wait(5);
  // await verify(Fundraiser.address, []);
}

const deployContract = async (name, args) => {
  const contractFactory = await ethers.getContractFactory(name);
  const contract = await contractFactory.deploy(...args);

  console.info(`Deploying ${name} : ${contract.target}`);

  return contract;
};

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });