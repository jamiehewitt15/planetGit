const shell = require('shelljs');
const readlineSync = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
let repoHash = '';
// Assign arguments
let newFolder;
let projectSlug;
shell.ShellString(projectSlug).to('repoSlug.txt')
// Ask for user input
if (!argv._[0]){
  newFolder = readlineSync.question('Please enter the new folder name: ');
} else{
  newFolder = argv._[0].toString();
}
if (!argv._[1]){
  projectSlug = readlineSync.question('Please enter the Slug of the repository you would like to clone: ').toString();
} else{
  projectSlug = argv._[1]
}

const cloneRepo = async() => {
  const folder = newFolder.replace(/(\r\n|\n|\r)/gm, "");
  repoHash = repoHash.replace(/(\r\n|\n|\r)/gm, "");
  console.log('Cloning into: ', 'http://127.0.0.1:8080/ipfs/' + repoHash, folder);
  let clonecommand = `git clone http://127.0.0.1:8080/ipfs/${repoHash} ${folder}`;
  console.log("clonecommand", clonecommand)
  if (shell.exec(clonecommand).code !== 0) {
    console.log("Waiting for IPFS daemon to start...")
    await sleep(4000);
    shell.echo('Trying again...');
    shell.exec(`git clone http://127.0.0.1:8080/ipfs/${repoHash} ${folder}`)
  }
  console.log("Finished");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startClone = async() => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      await sleep(2000); // wait for IPFS Daemon to start
      await cloneRepo();
      }
      else{ // Use public IPFS node
      console.log("We recomend installing IPFS")
      console.log("Attempting: requesting repo through INFURA public node")
      shell.exec(`git clone https://${repoHash}.ipfs.infura-ipfs.io/ ${newFolder}`);
    }
  }
}



// QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq

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
    repoHash = await contract.methods.getRepoHash(projectSlug).call();
}

async function run(){
    await setup();
    await startClone();
    shell.exit(0);
}

run();
