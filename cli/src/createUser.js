const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
const Web3js = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction
const provider = 'HTTP://0.0.0.0:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

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
    const contract = await loadContract(contractAddress);
    let uniqueName;
    do {
        userName = readlineSync.question('\n\nPlease enter a username:\n\n');
        console.log("userName", userName);
        uniqueName = await contract.methods.uniqueUsername(userName).call();
        console.log("uniqueName", uniqueName);
        if (uniqueName === false) {
            console.log("Sorry, that username is already taken. Please choose another one.")
        }
    } while (uniqueName !== true);
    newUser = readlineSync.question('Do you already have an ethereum account?\nEnter y or n\n\n');
    if(newUser === 'n'){
    const account = await web3.eth.accounts.create();
    accountAddress = account.address;
    privateKey = account.privateKey;
    console.log("Your new Ethereum account address:", accountAddress);
    console.log("Your new Ethereum account Private Key:", privateKey);
    newUser = readlineSync.question('\n\nPlease note these down somewhere secure\n\nYou will need to add Eth to you account before you can continue\n\n');
    } else{
        accountAddress = readlineSync.question('\n\nPlease enter you public key:\n\n');
        privateKey = readlineSync.question('\n\nPlease enter you private key:\n\n');
    }
}

async function createUser(){
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    accountAddress = "0x928bF318165410da9615db0801aB9344078a92Ae"
    // const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    let privateKeyBuffer;
    try {
        privateKeyBuffer = await Buffer.from("0873271dc5fe82c6b86c62e59151ddd898d5a01abe02d588c4b94010fd4741cb", 'hex');
        console.log("privateKeyBuffer", privateKeyBuffer)
    } catch (error) {
        console.log(">>> error 1", error)
    }
    // get transaction count, later will used as nonce
    console.log("getTransactionCount")
    const count = await web3.eth.getTransactionCount(accountAddress);
    console.log("getTransactionCount", count)
    //creating raw tranaction
    const rawTransaction = await {"from":accountAddress, "gasLimit":web3.utils.toHex(2100000),"to":contractAddress,"value":"0x0","data":contract.methods.createUser(userName, imageHash).encodeABI(),"nonce":web3.utils.toHex(count)}
    console.log("rawTransaction", rawTransaction);
    //creating tranaction via ethereumjs-tx
    const transaction = await new EthereumTx(rawTransaction);
    //signing transaction with private key
    transaction.sign(privateKeyBuffer);
    //sending transacton via web3 module
    web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
    .on('transactionHash', () => {
        getAll();
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

// async function run(){
//     await;
//     console.log("Setup finished");
    
    
    
//     console.log("createUser finished")
    
// }
console.log("web3.currentProvider.constructor.name", web3.currentProvider.constructor.name)

console.log("web3.transactionPollingTimeout", web3.transactionPollingTimeout)
if (web3.currentProvider.constructor.name == "HttpProvider"){
    // web3.currentProvider.connection.close();
    console.log("web3.currentProvider.constructor.name", web3.currentProvider.constructor.name)
} 
setup()
// run();
createUser();

