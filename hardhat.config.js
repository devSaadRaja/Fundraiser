require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-etherscan");

const { resolve } = require("path");
const { config } = require("dotenv");

config({ path: resolve(__dirname, "./.env") });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          metadata: { bytecodeHash: "none" },
          optimizer: { enabled: true, runs: 10 },
        },
      },
    ],
  },
  mocha: {
    timeout: 200000,
  },
  networks: {
    localhost: {
      timeout: 120000,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
};