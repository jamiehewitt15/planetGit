const { assert } = require('chai');
const Web3 = require('web3');

const contractImport = require('../src/abis/MintReward.json');
const MintReward = artifacts.require("MintReward");
const Repository = artifacts.require("Repository");
const GLDToken = artifacts.require("GLDToken");


const provider = 'HTTP://127.0.0.1:7545' // Main-net: 'https://mainnet.infura.io/v3/68e8a21ed26448299c8e325638bd9085';
const web3Provider = new Web3.providers.WebsocketProvider(provider);
const web3 = new Web3(web3Provider);
const BigNumber = web3.BigNumber;


require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should()

contract('MintReward', (accounts)=>{
    // Testing the Data smart contract
    const walletAddress = accounts[0];
    let mintReward;
    let repo;
    let token;
    let abi;
    let address;
    let rewardContract; 
    let repoName;
    let repoHash;
    let repoSlug;
    

    before(async () => {
        // Fetch the smart contract before running tests
        mintReward = await MintReward.deployed();
        repo = await Repository.deployed();
        token = await GLDToken.deployed();
        abi = contractImport.abi;
        address = mintReward.address;
        rewardContract = web3.eth.Contract(abi, address); 
        
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = mintReward.address;
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('Functions', async () => {

        it('Repo has the correct owner', async () => {
            const mintRewardAddress = await mintReward.address;
            const repoOwner = await repo.owner();
            repoOwner.should.equal(mintRewardAddress);
        })

        it('Token has the correct owner', async () => {
            const mintRewardAddress = await mintReward.address;
            const tokenOwner = await token.owner();
            tokenOwner.should.equal(mintRewardAddress);
        });

        // Test createRepo and getRepoHash functions
        it('Creates Repo and gets RepoHash', async () => {
            repoName = 'TomTest00000000';
            repoHash = '21X243OJNOI12092189443RNJK24R0';
            repoSlug = 'projectname1';
            await repo.createRepo(repoSlug, repoName, repoHash);
            
            const nonce = web3.utils.randomHex(4); 
            
            console.log("*nonce1", nonce);
            // Get Repo Hash
            await mintReward.mintReward(repoSlug, nonce);
           
            await rewardContract.events.Hash({
                filter: {_from: walletAddress, nonce: nonce}, 
                fromBlock: 0
            })
            .on("connected", function(subscriptionId){
                console.log(">>> subscriptionId: ", subscriptionId);
            })
            .on('data', async function(event){
                const returnHash = await event.returnValues._value;
                const nonce = await event.returnValues.nonce;
                const returnSlug = await event.returnValues._slug;
                returnHash.should.equal(repoHash);
            })
            .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                console.log(">>> Error: ", error);
            });
        });

        // Test second createRepo and getRepoHash functions
        it('Creates Second Repo and gets second RepoHash', async () => {
            // Create Second Repo Hash
            const repoName2 = 'JaneTest00000000';
            const repoHash2 = '123243OJNOI12321189443RNJK24R2';
            const repoSlug2 = 'projectname2';
            await repo.createRepo(repoSlug2, repoName2, repoHash2);
            // create nonce
            
            const nonce2 = web3.utils.randomHex(4); 
            console.log("* nonce2", nonce2);
            // Mint Reward
            await mintReward.mintReward(repoSlug2, nonce2);
            // Get Repo Hash
            await rewardContract.events.Hash({
                filter: {_from: walletAddress, nonce: nonce2}, 
                fromBlock: 0
            })
            .on("connected", function(subscriptionId){
                console.log(">>> subscriptionId: ", subscriptionId);
            })
            .on('data', async function(event){
                const returnHash = await event.returnValues._value;
                const nonce = await event.returnValues.nonce;
                const returnSlug = await event.returnValues._slug;
                returnHash.should.equal(repoHash2);
            })
            .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                console.log(">>> Error: ", error);
            });
        });

        it('Tokens are sent to the correct repo owner', async () => {
            // Call balanceOf function
            const initialBalance = (await token.balanceOf(walletAddress)).toString();
            const currentReward = await token.getReward();
            // create nonce
            const nonce3 = web3.utils.randomHex(4); 
            // Mint Reward
            await mintReward.mintReward(repoSlug, nonce3);
            const finalBalance = (await token.balanceOf(walletAddress)).toString();
            // initialBalance.should.not.be.bignumber.equal(finalBalance);
            assert.notEqual(initialBalance, finalBalance);
            assert.isAbove(parseInt(finalBalance), parseInt(initialBalance), 'final balance is greater than initial balance');
        })    
    })
})