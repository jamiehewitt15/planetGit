const { assert } = require('chai');
const Web3 = require('web3');

const contractImport = require('../src/abis/MintReward.json');
const MintReward = artifacts.require("MintReward");
const RepoContract = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");


const provider = 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3.providers.WebsocketProvider(provider);
const web3 = new Web3(web3Provider);
// const eventProvider = new Web3.providers.WebsocketProvider('ws://localhost:7545');
// web3.setProvider(eventProvider);

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('MintReward', (accounts)=>{
    // Testing the Data smart contract
    let mintReward;
    let repo;
    let token;

    before(async () => {
        // Fetch the smart contract before running tests
        mintReward = await MintReward.deployed();
        repo = await RepoContract.deployed();
        token = await GLDToken.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = mintReward.address;
            console.log(address);
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('storage', async () => {
        
        // Test createRepo and getRepoHash functions
        it('Creates Repo and gets RepoHash', async () => {
            const abi = contractImport.abi;
            const address = mintReward.address;
            const rewardContract = web3.eth.Contract(abi, address); 

            const repoName = 'TomTest00000000';
            const repoHash = '21X243OJNOI12092189443RNJK24R9';
            const repoSlug = 'projectname3';
            await repo.createRepo(repoSlug, repoName, repoHash);
            // Get Repo Hash
            await mintReward.mintReward(repoSlug);
           
            let returnHash;
            await rewardContract.events.Hash({
                filter: {_from: '0x2fEa99173ED4db605bdD9E29Fa22d8ECaAE11bbd'}, 
                fromBlock: 0
            })
            .on("connected", function(subscriptionId){
                console.log(">>> subscriptionId: ", subscriptionId);
            })
            .on('data', async function(event){
                console.log(">>> Return Value: ", event.returnValues._value);
                returnHash = await event.returnValues._value
                returnHash.should.equal(repoHash);
            })
            .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                console.log(">>> Error: ", error);
            });
        })
        
        it('Repo has the correct owner', async () => {
            const mintRewardAddress = await mintReward.address;
            const repoOwner = await repo.owner();
            console.log("owner is:", repoOwner)
            repoOwner.should.equal(mintRewardAddress);
        })

        it('Token has the correct owner', async () => {
            const mintRewardAddress = await mintReward.address;
            const tokenOwner = await token.owner();
            console.log("owner is:", tokenOwner)
            tokenOwner.should.equal(mintRewardAddress);
        })
    })
})