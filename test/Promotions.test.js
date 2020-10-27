const { assert } = require('chai');
const Web3 = require('web3');

const provider = 'HTTP://127.0.0.1:7545' 
const web3Provider = new Web3.providers.WebsocketProvider(provider);
const web3 = new Web3(web3Provider);

const Promotions = artifacts.require("Promotions");
const Repository = artifacts.require("Repository");
const GLDToken = artifacts.require("GLDToken");
const MintReward = artifacts.require("MintReward");


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Promotions', (accounts)=>{
    // Testing the Data smart contract
    const walletAddress = accounts[0];
    let promotions;
    let repo;
    let token;
    let mintReward;
    let repoName;
    let repoSlug;
    let repoHash;
    let owner;

    before(async () => {
        // Fetch the smart contract before running tests
        promotions = await Promotions.deployed();
        repo = await Repository.deployed();
        token = await GLDToken.deployed();
        mintReward = await MintReward.deployed();
        repoName = 'Promotions Repo 1';
        repoSlug = 'promotionsRepo1';
        repoHash = 'ABC3OJNOI12092189443RNJK24R0';
        await repo.createRepo(repoSlug, repoName, repoHash);
        owner = await repo.getRepoOwner(repoSlug);
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = promotions.address;
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('Functions', async () => {
        it('Creates a promotion', async () => {
            const name = await repo.getRepoName(repoSlug)
            assert.equal(owner, walletAddress);
            assert.equal(name, repoName);
            const thisBalance = parseInt(await token.balanceOf(walletAddress));
            console.log("thisBalance:", thisBalance);
            const nonce = web3.utils.randomHex(4); 
            await mintReward.mintReward(repoSlug, nonce);
            const nowBalance = parseInt(await token.balanceOf(walletAddress));
            console.log("Now Balance:", nowBalance);
            await promotions.createPromotion(repoSlug, 10);
        })

        it('Token has the correct owner', async () => {
            
        });
        
        
       
    })
})