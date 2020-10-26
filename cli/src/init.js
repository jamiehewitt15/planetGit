const shell = require('shelljs');
const ipfsClient = require('ipfs-http-client');
const { globSource } = ipfsClient;
const { CID } = require('ipfs-http-client');
let ipfs;
let repoHash = '';
const pwdHome = shell.pwd().stdout;

const pushRepo = async() => {
  shell.exec(`git clone --bare ${pwdHome} ../tempPlanetGit`, {async:true, silent: true});
  try {
      await sleep(8000); // wait for IPFS Daemon to start
      shell.cd('../tempPlanetGit');
      shell.exec(`git update-server-info`);
      repoHash = shell.exec(`ipfs add -r -Q .`).stdout;
      console.log("repoHash", repoHash);
  } catch (error) {
      await sleep(4000); // wait for IPFS Daemon to start
      console.log("Waiting for IPFS to start")
      let file = await ipfs.add(globSource('./', { recursive: true, hidden: true }));
      repoHash = shell.exec(`ipfs files stat --hash `).stdout;
      console.log("repoHash", repoHash);
  }
  shell.cd('../');
  shell.pwd();
  shell.rm('-rf', './tempPlanetGit');
  console.log("Finished")
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
const provider = 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3js.providers.WebsocketProvider(provider);
const web3 = new Web3js(web3Provider);

const { abi, networks } = require('../abis/Repository.json');

let accountAddress = '';
let privateKey = '';
let repoName = '';
let repoSlug = '';

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
    let uniqueSlug;
    repoName = readlineSync.question('\n\nPlease enter a name for your repo:\n\n');
    do {
        repoSlug = readlineSync.question('\n\nPlease enter a unique slug for your repo:\nYour repo will be available at planetgit.com/repos/[slug]\n\n');
        uniqueSlug = await contract.methods.uniqueRepoSlug(repoSlug).call();
        console.log("uniqueSlug", uniqueSlug);
        if (uniqueSlug === false) {
            console.log("Sorry, that slug is already taken. Please choose another one.")
        }
    } while (uniqueSlug !== true);
    shell.cd(pwdHome);
    shell.ShellString(repoSlug).to('repoSlug.txt')
    accountAddress = readlineSync.question('\n\nPlease enter you public address:\n\n');
    shell.ShellString(accountAddress).to('accountAddress.txt')
    privateKey = readlineSync.question('\n\nPlease enter you private key:\n\n');
}

async function createRepo(){
    console.log("createRepo")
    const contractAddress = await loadContractAddress();
    const contract = await loadContract(contractAddress);
    console.log("accountAddress", accountAddress);
    let privateKeyBuffer;
    try {
        privateKeyBuffer = await Buffer.from(privateKey, 'hex');
        console.log("privateKeyBuffer", privateKeyBuffer)
    } catch (error) {
        console.log(">>> error 1", error)
    }
    // get transaction count, later will used as nonce
    console.log("getTransactionCount")
    const count = await web3.eth.getTransactionCount(accountAddress);
    console.log("getTransactionCount", count)
    //creating raw tranaction
    const rawTransaction = await {
        "from":accountAddress, 
        "gasLimit":web3.utils.toHex(2100000),
        "to":contractAddress,"value":"0x0",
        "data":contract.methods.createRepo(repoSlug, repoName, repoHash).encodeABI(), 
        "nonce":web3.utils.toHex(count)
        }
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
    const getAllRepos = await contract.methods.getAllRepos().call();
    console.log("getAllRepos", getAllRepos);
}

async function run(){
    await startPush();
    console.log("startPush finished");
    console.log("Repo Hash:", repoHash);
    await setup();
    await createRepo();
    console.log("createRepo finished");
    shell.exit(0);
}


run();
