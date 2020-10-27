const { assert } = require('chai');

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
            // const thisBalance = parseInt(await token.balanceOf(walletAddress));
            // console.log("thisBalance:", thisBalance);
            // await mintReward.mintReward(repoSlug);
            // await promotions.createPromotion(repoSlug, 10);
        })

        it('Token has the correct owner', async () => {
            
        });
        
        
       
    })
})