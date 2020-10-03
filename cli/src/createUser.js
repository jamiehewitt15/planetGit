const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction

const provider = 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);
const { abi, networks } = require('../abis/UserContract.json');

let accountAddress = '';
let privateKey = '';
let userName;
let imageHash = 'QmdVHVAvpHb5JRk5VHuwe4hucjnM7NBZoWAZhVkLgAXnnR'; // default User Image

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
    console.log("contractAddress", contractAddress);
    const contract = await loadContract(contractAddress);
    console.log("contract", contract);
    do {
        userName = readlineSync.question('\n\nPlease enter a username:\n\n');
        console.log("userName", userName);
        let uniqueName = await contract.methods.uniqueUsername(userName).call();
        console.log("uniqueName", uniqueName);
        if (uniqueName === false) {
            console.log("Sorry, that username is already taken. Please choose another one.")
        }
    } while (uniqueName === false);
    newUser = readlineSync.question('Do you already have an ethereum account?\nEnter y or n\n\n');
    if(newUser = 'n'){
    const account = await web3.eth.accounts.create();
    accountAddress = account.address;
    privateKey = account.privateKey;
    console.log("Your new Ethereum account address:", accountAddress);
    console.log("Your new Ethereum account Private Key:", privateKey);
    newUser = readlineSync.question('Please note these down somewhere secure\n\nYou will need to add Eth to you account before you can continue\n\n');
    } else{
        accountAddress = readlineSync.question('\n\nPlease enter you public key:\n\n');
        accountAddress = readlineSync.question('\n\nPlease enter you private key:\n\n');
    }
}

async function createUser(){
        const myAddress = accountAddress;
        const privateKeyBuffer = Buffer.from(privateKey, 'hex');
        const contractAddress = await loadContractAddress();
        // creating contract object
        const contract = new web3.eth.Contract(abi, contractAddress);
        let count;
        // get transaction count, later will used as nonce
        web3.eth.getTransactionCount(myAddress).then(function(v){
            console.log("Count: "+v);
            count = v;
            //creating raw tranaction
            const rawTransaction = {"from":myAddress, "gasLimit":web3.utils.toHex(2100000),"to":contractAddress,"value":"0x0","data":contract.methods.createUser(userName, imageHash).encodeABI(),"nonce":web3.utils.toHex(count)}
            console.log(rawTransaction);
            //creating tranaction via ethereumjs-tx
            const transaction = new EthereumTx(rawTransaction);
            //signing transaction with private key
            transaction.sign(privateKeyBuffer);
            //sending transacton via web3 module
            web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
            .on('transactionHash', console.log);
        })
};
setup();
createUser();
getAll();

async function getAll(){
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    const getAllUsers = await contract.methods.getAllUsers().call();
    console.log("getAllUsers", getAllUsers);
}