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
  console.log("Finished")
  shell.exit(0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startPull = async(repoHash) => {
  if (!shell.which('git')) { // check if user has git installed
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  } else{
    if (shell.which('ipfs')) { // check if user has IPFS installed
      shell.exec(`ipfs daemon`, {async:true, silent:true});
      await sleep(2000); // wait for IPFS Daemon to start
      await pullRepo(repoHash);
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
  let privateKeyBuffer;
  const privateKey = readlineSync.question('\n\nPlease enter you private key:\n\n');
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
    "gasLimit":web3.utils.toHex(2100000),
    "to":contractAddress,"value":"0x0",
    "data":contract.methods.mintReward(projectSlug, nonce).encodeABI(), 
    "nonce":web3.utils.toHex(count)
    }
    //creating tranaction via ethereumjs-tx
    const transaction = await new EthereumTx(rawTransaction);
    //signing transaction with private key
    transaction.sign(privateKeyBuffer);
    //sending transacton via web3 module
    web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
}


const getHash = async () => {
  // const repositoryAddress = await loadContractAddress(repositoryNetworks);
  // const repositoryContract = await loadContract(repositoryAbi, repositoryAddress);
  const mintAddress = await loadContractAddress(mintNetworks);
  const mintContract = await loadContract(mintAbi, mintAddress);
  const nonce = web3.utils.randomHex(4);
  await mintReward(mintAddress, mintContract, repoSlug, nonce); // await mintContract.methods.mintReward(projectSlug, nonce);
  await mintContract.events.Hash({
    filter: {_from: accountAddress, nonce: nonce}, 
    fromBlock: 0
    })
    .on("connected", function(subscriptionId){
        console.log(">>> subscriptionId: ", subscriptionId);
    })
    .on('data', async function(event){
        const returnHash = await event.returnValues._value;
        console.log("returnHash", returnHash);
        await startPull(returnHash);
        // return returnHash;
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(">>> Error: ", error);
    });
}


async function run(){
  await getHash();
}

run();


  


