require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// require("hardhat-explorer");

module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Default Hardhat Node
      chainId: 31337
    }
  }
};


