#!/usr/bin/env node
const chalk = require('chalk');
const shell = require('shelljs');
const ipfsClient = require('ipfs-http-client');
const { globSource } = ipfsClient;
const { CID } = require('ipfs-http-client');
let ipfs;
let repoHash = '';

const pushRepo = async() => {
  let pwd = shell.pwd().stdout;
  //console.log("pwd: ", pwd)
  shell.exec(`cd ../..`);
  pwd = shell.pwd().stdout;
  shell.exec(`git clone --bare ${pwd} ../tempPlanetGit`);
  shell.cd('../tempPlanetGit');
  pwd = shell.pwd().stdout;
  //console.log("pwd: ", pwd)
  shell.exec(`git update-server-info`);
  repoHash = shell.exec(`ipfs add -r -Q .`).stdout;
  console.log(chalk.yellow("repoHash", repoHash));
  shell.cd('../');
  shell.pwd();
  shell.rm('-rf', './tempPlanetGit');
  console.log(chalk.cyan("\n\nRepository uploaded to IPFS\n\n"))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startPush = async() => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })
      await sleep(2000); // wait for IPFS Daemon to start
      await pushRepo();
      }
      else{ // Use public IPFS node
      console.warn("We recomend installing IPFS");
      console.warn("Attempting to access IPFS through INFURA public node");
      ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
      await pushRepo();
    }
  }
}
// QmTYXb9WEVU57MzLeWbNtfjDuHGCbs1UP765VbEaEw5GGN



/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// UPLOAD HASH ETHEREUM/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const readlineSync = require('readline-sync');
const Web3js = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction

require('dotenv').config()
const IFURA_API_KEY_KOVAN = process.env.IFURA_API_KEY_KOVAN;
const provider = `wss://kovan.infura.io/ws/v3/d436dc4ffe4a45ba96a30c9b1c6b63ac` // Local: 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';

const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

const { abi, networks } = require('../abis/Repository.json');

let accountAddress = shell.cat("accountAddress.txt").stdout;
let privateKey = '';
let repoSlug = shell.cat("reposlug.txt").stdout;
console.log("repoSlug", repoSlug);

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
    privateKey = readlineSync.question(chalk.yellow('\n\nPlease enter you private key:\n\n'));
}

async function updateRepo(){
    console.log(chalk.yellow("\n\nUpdate Repo"))
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    console.log(chalk.yellow("accountAddress", accountAddress));
    let privateKeyBuffer;
    try {
        privateKeyBuffer = await Buffer.from(privateKey, 'hex');
    } catch (error) {
        console.log(">>> error 1", error)
    }
    // get transaction count to used as nonce
    
    const count = await web3.eth.getTransactionCount(accountAddress);
    // creating raw tranaction
    const rawTransaction = await {
        "from":accountAddress, 
        "gasPrice": web3.utils.toHex(200000),
        "gasLimit":web3.utils.toHex(2000000),
        "to":contractAddress,
        "value":"0x0",
        "data":contract.methods.updateRepo(repoSlug, repoHash).encodeABI(), 
        "nonce":web3.utils.toHex(count)
        }
    // creating tranaction via ethereumjs-tx
    const transaction = await new EthereumTx(rawTransaction, { chain: 'kovan' });
    //signing transaction with private key
    transaction.sign(privateKeyBuffer);
    //sending transacton to ethereum via web3 module
    web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
    .on('transactionHash', (hash) => {
      console.log(chalk.cyan("\n\nRepo hash uploaded to ethereum."));
      console.log(chalk.cyan("Transaction hash:", hash));
      console.log(chalk.cyan("Finished\n\n"));
      shell.exit(0);
    })
    .on('error', (error) => {
        console.log("Error: ", error)
    })
};

async function getAll(){
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    const getAllRepos = await contract.methods.getAllRepos().call();
    console.log("getAllRepos", getAllRepos);
}

async function run(){
  console.log(chalk.yellow("\n\nPush started\n\n"));
    await startPush();
    console.log(chalk.cyan("Repo Hash:", repoHash));
    await setup();
    await updateRepo();
}

run();
