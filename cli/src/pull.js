const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
let repoHash = '';
// Assign arguments
let repoSlug = shell.cat("reposlug.txt").stdout;
// Ask for user input

const pullRepo = async() => {
  console.log('Pulling from: ', 'http://127.0.0.1:8080/ipfs/' + repoHash);
  if (shell.exec(`git pull http://127.0.0.1:8080/ipfs/${repoHash}`).code !== 0) {
    console.log("Waiting for IPFS daemon to start...")
    await sleep(4000);
    shell.echo('Trying again...');
    shell.exec(`git pull http://127.0.0.1:8080/ipfs/${repoHash}`)
  }
  console.log("Finished")
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startPull = async() => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      await sleep(2000); // wait for IPFS Daemon to start
      await pullRepo();
      }
      else{ // Use public IPFS node
      console.log("We recomend installing IPFS")
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
const provider = 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

const { abi, networks } = require('../abis/RepoContract.json');

let accountAddress = shell.cat("accountAddress.txt").stdout;
let privateKey = '';

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
    repoHash = await contract.methods.getRepoHash(repoSlug).call();
}

async function run(){
    await setup();
    await startPull();
    shell.exit(0);
}

run();


  


