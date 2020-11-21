#!/usr/bin/env node
const chalk = require('chalk');
const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
// Assign arguments
let newFolder;
let projectSlug;
shell.ShellString(projectSlug).to('repoSlug.txt')
// Ask for user input if arguments are missing
if (!argv._[0]){
  newFolder = readlineSync.question(chalk.yellow('\n\nPlease enter the new folder name: \n\n'));
} else{
  newFolder = argv._[0].toString();
}
if (!argv._[1]){
  projectSlug = readlineSync.question(chalk.yellow('\n\nPlease enter the Slug of the repository you would like to clone: \n\n')).toString();
} else{
  projectSlug = argv._[1]
}

const cloneRepo = async(repoHash) => {
  const folder = newFolder.replace(/(\r\n|\n|\r)/gm, "");
  repoHash = repoHash.replace(/(\r\n|\n|\r)/gm, "");
  console.log(chalk.yellow('Cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash, folder));
  let clonecommand = `git clone http://127.0.0.1:8080/ipfs/${repoHash} ${folder}`;
  
  if (shell.exec(clonecommand).code !== 0) {
    console.log(chalk.yellow("Waiting for IPFS daemon to start..."))
    await sleep(4000);
    shell.echo('Trying again...');
    shell.exec(`git clone http://127.0.0.1:8080/ipfs/${repoHash} ${folder}`)
  }
  console.log("Finished");
  shell.exit(0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startClone = async(repoHash) => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo(chalk.yellow('Sorry, this script requires git'));
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      await sleep(2000); // wait for IPFS Daemon to start
      await cloneRepo(repoHash);
      }
      else{ // Use public IPFS node
      console.log(chalk.yellow("We recomend installing IPFS"))
      console.log(chalk.yellow("Attempting: requesting repo through INFURA public node"))
      shell.exec(`git clone https://${repoHash}.ipfs.infura-ipfs.io/ ${newFolder}`);
    }
  }
}



// QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// GET LATEST FROM HASH FROM ETHEREUM //////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const Web3js = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction

require('dotenv').config()
const IFURA_API_KEY_KOVAN = process.env.IFURA_API_KEY_KOVAN;
const provider = `wss://kovan.infura.io/ws/v3/d436dc4ffe4a45ba96a30c9b1c6b63ac` // Local: 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
// console.log("provider", provider)

const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

// const { abi: repositoryAbi , networks: repositoryNetworks  } = require('../abis/Repository.json');
const { abi: mintAbi , networks: mintNetworks  } = require('../abis/MintReward.json');

let accountAddress = '';
try{
  accountAddress = shell.cat("accountAddress.txt").stdout;
} catch(error){

}
if(accountAddress === ''){
  accountAddress = readlineSync.question(chalk.yellow('\n\nPlease enter you public address:\n\n'));
}

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

const getHash = async () => {
              // const repositoryAddress = await loadContractAddress(repositoryNetworks);
              // const repositoryContract = await loadContract(repositoryAbi, repositoryAddress);
              const mintAddress = await loadContractAddress(mintNetworks);
              const mintContract = await loadContract(mintAbi, mintAddress);
              const nonce = web3.utils.randomHex(4);
              await mintReward(mintAddress, mintContract, projectSlug, nonce); // await mintContract.methods.mintReward(projectSlug, nonce);
              console.log(chalk.yellow("\n\nMint Reward Transaction Sent"))
              console.log(chalk.yellow("Awaiting mining..."))
              await mintContract.events.Hash({
                filter: {_from: accountAddress, nonce: nonce}, 
                fromBlock: 0
                })
                .on("connected", function(subscriptionId){
                    console.log(">>> subscriptionId: ", subscriptionId);
                })
                .on('data', async function(event){
                    const returnHash = await event.returnValues._value;
                    console.log(chalk.cyan("Transaction Hash 2:", returnHash));
                    await startClone(returnHash);
                    return returnHash;
                })
                .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    console.log(">>> Error: ", error);
                });
}

async function mintReward(contractAddress, contract, projectSlug, nonce){
  let privateKeyBuffer;
  const privateKey = readlineSync.question(chalk.yellow('\n\nPlease enter you private key:\n\n'));
  try {
      privateKeyBuffer = await Buffer.from(privateKey, 'hex');
      console.log("privateKeyBuffer", privateKeyBuffer)
  } catch (error) {
      console.log(">>> error 1", error)
  }
  const count = await web3.eth.getTransactionCount(accountAddress);
  //creating raw tranaction
  const rawTransaction = await {
    "from":accountAddress, 
    "gasPrice": web3.utils.toHex(1000000000),
    "gasLimit":web3.utils.toHex(12499988),
    "to":contractAddress,
    "value":"0x0",
    "data":contract.methods.mintReward(projectSlug, nonce).encodeABI(), 
    "nonce":web3.utils.toHex(count)
    }
    //creating tranaction via ethereumjs-tx
    const transaction = await new EthereumTx(rawTransaction, { chain: 'kovan' });
    //signing transaction with private key
    transaction.sign(privateKeyBuffer);
    //sending transacton via web3 module
    web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
    .on('transactionHash', (hash) => {
        console.log(chalk.cyan("\n\nTransaction Hash 1:", hash));
        return hash
        // getAll();
    })
    .on('error', (error) => {
        console.log(chalk.red("Error: ", error))
        return error
    })
}

async function run(){
    await getHash();
}

run();
