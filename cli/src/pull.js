#!/usr/bin/env node
const chalk = require('chalk');
const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
// Assign arguments
let repoSlug = shell.cat("reposlug.txt").stdout;
// Ask for user input

const pullRepo = async(repoHash) => {
  console.log('Pulling from: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
  if (shell.exec(`git pull http://127.0.0.1:8080/ipfs/${repoHash}`).code !== 0) {
    console.log("Waiting for IPFS daemon to start...")
    await sleep(4000);
    shell.echo('Trying again...');
    shell.exec(`git pull http://127.0.0.1:8080/ipfs/${repoHash}`)
  }
  console.log(chalk.cyan("Finished"))
  shell.exit(0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startPull = async(repoHash) => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo(chalk.red('Sorry, this script requires git'));
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      await sleep(2000); // wait for IPFS Daemon to start
      try{
        await pullRepo(repoHash);
      } catch(error){
        console.log("Error 4: ", error)
      }
      }
      else{ // Use public IPFS node
      console.log(chalk.yellow("We recomend installing IPFS"))
      console.log("Attempting: requesting repo through INFURA public node")
      shell.exec(`git pull https://${repoHash}.ipfs.infura-ipfs.io/`);
    }
  }
}



/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// GET LATEST FROM HASH ETHEREUM ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const Web3js = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction

require('dotenv').config()
const IFURA_API_KEY_KOVAN = process.env.IFURA_API_KEY_KOVAN;
const provider = `wss://kovan.infura.io/ws/v3/${IFURA_API_KEY_KOVAN}` // Local: 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';


const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

const { abi: mintAbi , networks: mintNetworks  } = require('../abis/MintReward.json');

let accountAddress = shell.cat("accountAddress.txt").stdout;
let privateKey = '';


const loadContractAddress = async (networks) => {
  // Get smart contract network
  const networkId = await web3.eth.net.getId();
  // Get contract address
  return networks[networkId].address;
}

const loadContract = async (abi, contractAddress) => {
  const contract = web3.eth.Contract(abi, contractAddress);
  return contract;
}

async function mintReward(contractAddress, contract, projectSlug, nonce){
  console.log("Minting token reward")
  let privateKeyBuffer;
  const privateKey = readlineSync.question(chalk.yellow('\n\nPlease enter you private key:\n\n'));
  try {
      privateKeyBuffer = await Buffer.from(privateKey, 'hex');
      console.log("privateKeyBuffer", privateKeyBuffer)
  } catch (error) {
      console.log(">>> error 1", error)
  }
  const count = await web3.eth.getTransactionCount(accountAddress);
  console.log("Transaction Count:", count)
  //creating raw tranaction
  const rawTransaction = await {
    "from":accountAddress, 
    "gasLimit":web3.utils.toHex(2100000),
    "to":contractAddress,
    "value":"0x0",
    "data":contract.methods.mintReward(projectSlug, nonce).encodeABI(), 
    "nonce":web3.utils.toHex(count)
    }
    console.log("rawTransaction", rawTransaction)
    try{
      //creating tranaction via ethereumjs-tx
      const transaction = await new EthereumTx(rawTransaction);
      //signing transaction with private key
      transaction.sign(privateKeyBuffer);
      //sending transacton via web3 module
      web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
    } catch(error){
      console.log("Error 5: ", error)
    }
}


const getHash = async () => {
  // const repositoryAddress = await loadContractAddress(repositoryNetworks);
  // const repositoryContract = await loadContract(repositoryAbi, repositoryAddress);
  const mintAddress = await loadContractAddress(mintNetworks);
  const mintContract = await loadContract(mintAbi, mintAddress);
  const eventID = web3.utils.randomHex(4);
  try{
    await mintReward(mintAddress, mintContract, repoSlug, eventID); // await mintContract.methods.mintReward(projectSlug, nonce);
  } catch(error){
    console.log("Error 2: ", error)
  }
  await mintContract.events.Hash({
    filter: {_from: accountAddress, nonce: eventID}, 
    fromBlock: 0
    })
    .on("connected", function(subscriptionId){
        console.log(">>> subscriptionId: ", subscriptionId);
    })
    .on('data', async function(event){
        const returnHash = await event.returnValues._value;
        console.log("returnHash", returnHash);
        try{
          await startPull(returnHash);
        } catch (error){
          console.log("error 3: ", error)
        }
        
        // return returnHash;
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(">>> Error: ", error);
    });
}


async function run(){
  try{
    await getHash();
    console.log(chalk.cyan("Pull Finished"))
  } catch(error){
    console.log("error 1: ", error)
  }
 
  
}

run();


  


