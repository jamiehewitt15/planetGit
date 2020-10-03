const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
const Web3 = require('web3');
const provider = 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);
const { abi, networks } = require('../abis/UserContract.json');

const myAddress = 'ADDRESS_THAT_SENDS_TRANSACTION';
const privateKey = Buffer.from('YOUR_PRIVATE_KEY', 'hex')

async function loadContract(){
    // Get smart contract network
    const networkId = await web3.eth.net.getId();
    // Get netwrok address
    const networkAddress = networks[networkId].address;
    const contract = web3.eth.Contract(abi, networkAddress);
    return contract;
}

async function createUser(){
    const contract = await loadContract();
    await contract.methods.createUser("Jamie2", "JKIKNBJSANKI9480432908432").call();
    uniqueUsername = await contract.methods.uniqueUsername("Jamie2").call();
    console.log("uniqueUsername", uniqueUsername);
    getAllUsers = await contract.methods.getAllUsers().call();
    console.log("getAllUsers", getAllUsers);
}

createUser();