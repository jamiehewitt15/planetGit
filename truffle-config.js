require('dotenv').config()
require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("truffle-hdwallet-provider");

const MNEMONIC = process.env.MNEMONIC;
const IFURA_API_KEY_ROPSTEN = process.env.IFURA_API_KEY_ROPSTEN;
const IFURA_API_KEY_KOVAN = process.env.IFURA_API_KEY_KOVAN;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${IFURA_API_KEY_ROPSTEN}`)
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, `https://kovan.infura.io/v3/${IFURA_API_KEY_KOVAN}`)
      },
      network_id: 42,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.7.1",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
