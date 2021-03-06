#!/usr/bin/env node
const chalk = require('chalk');
const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
const Web3js = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction

require('dotenv').config()
const IFURA_API_KEY_KOVAN = process.env.IFURA_API_KEY_KOVAN;
const provider = `wss://kovan.infura.io/ws/v3/d436dc4ffe4a45ba96a30c9b1c6b63ac` // Local: 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
console.log("provider", provider)

const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

const { abi, networks } = require('../abis/Users.json');

let accountAddress = '';
let privateKey = '';
let userName;
let imageHash = 'QmdVHVAvpHb5JRk5VHuwe4hucjnM7NBZoWAZhVkLgAXnnR'; // default User Image //

const loadContractAddress = async () => {
    // Get smart contract network
    const networkId = await web3.eth.net.getId();
    // Get contract address
    return networks[networkId].address;
}
const loadContract = async (contractAddress) => {
    const contract = web3.eth.Contract(abi, contractAddress);
    return contract;
}

async function setup(){
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    let uniqueName;
    do {
        userName = readlineSync.question(
            chalk.yellow(
                '\n\nPlease enter a username:\n\n'
              ));
        console.log("userName", userName);
        uniqueName = await contract.methods.uniqueUsername(userName).call();
        
        if (uniqueName === false) {
            console.log(
                chalk.yellow(
                    "Sorry, that username is already taken. Please choose another one."
                  ))
        }
    } while (uniqueName !== true);
    let newUser = readlineSync.question(
        chalk.yellow(
            '\n\nDo you already have an ethereum account?\nEnter y or n\n\n'
          )
        );
    if(newUser === 'n'){
    const account = await web3.eth.accounts.create();
    accountAddress = account.address.toString();
    privateKey = account.privateKey.toString();
    console.log(chalk.cyan("Your new Ethereum account address:", accountAddress));
    console.log(chalk.cyan("Your new Ethereum account Private Key:", privateKey));
    newUser = readlineSync.question('\n\nPlease note these down somewhere secure\n\nYou will need to add Eth to you account before you can continue\n\n');
    shell.exit(0);
    } else{
        accountAddress = readlineSync.question(chalk.yellow('\n\nPlease enter you public address:\n\n'));
        privateKey = readlineSync.question(chalk.yellow('\n\nPlease enter you private key:\n\n'));
    }
}

async function createUser(){
    console.log("Creating User...")
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    console.log("accountAddress", accountAddress);
    // const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    let privateKeyBuffer;
    try {
        // console.log("privateKey", privateKey)
        privateKeyBuffer = await Buffer.from(privateKey, 'hex');
        // console.log("privateKeyBuffer", privateKeyBuffer)
    } catch (error) {
        console.log(">>> error 1", error)
    }
    // get transaction count, later will used as nonce
    // console.log("getTransactionCount")
    const count = await web3.eth.getTransactionCount(accountAddress);
    // console.log("getTransactionCount", count)

    //creating raw tranaction
    const rawTransaction = await {
        "from":accountAddress, 
        "gasPrice": web3.utils.toHex(200000),
        "gasLimit":web3.utils.toHex(12487794),
        "to":contractAddress,"value":"0x0",
        "data":contract.methods.createUser(userName, imageHash).encodeABI(),
        "nonce":web3.utils.toHex(count)
        }
    // console.log("rawTransaction", rawTransaction);
    //creating tranaction via ethereumjs-tx
    const transaction = await new EthereumTx(rawTransaction, { chain: 'kovan' });
    //signing transaction with private key
    transaction.sign(privateKeyBuffer);
    //sending transacton via web3 module
    web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
    .on('transactionHash', (hash) => {
        console.log(chalk.cyan("\n\nCreate User finished:", userName));
        console.log(chalk.cyan("\nTransaction Hash:", hash));
        shell.exit(0);
        // getAll();
    })
    .on('error', (error) => {
        console.log("Error: ", error)
    })
};

async function getAll(){
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    const getAllUsers = await contract.methods.getAllUsers().call();
    console.log("getAllUsers", getAllUsers);
}

async function run(){
    console.log("Starting Create User");
    try{
        await setup();
        console.log("Setup finished");
    } catch(error){
        console.log("Error during setup:", error)
    }
    try{
        await createUser();
        console.log(
            chalk.cyan(
                "createUser finished:", userName
              ));
    } catch(error){
        console.log("Error while creating user:", error)
    }
    
}


run();


