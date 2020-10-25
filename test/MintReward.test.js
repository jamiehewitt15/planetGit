const { assert } = require('chai');

const MintReward = artifacts.require("MintReward");
const RepoContract = artifacts.require("RepoContract");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('RepoContract', (accounts)=>{
    // Testing the Data smart contract
    let mintReward;
    let repo;

    before(async () => {
        // Fetch the smart contract before running tests
        mintReward = await MintReward.deployed();
        repo = await RepoContract.deployed();
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
            const repoName = 'TomTest00000000';
            const repoHash = '21X243OJNOI12092189443RNJK24R9';
            const repoSlug = 'projectname3';
            await repo.createRepo(repoSlug, repoName, repoHash);
            const result = await repo.getRepoHash(repoSlug);
            console.log(">> getRepoHash:", result)
            console.log(">> getRepoHash:", result.receipt.status)
            assert.equal(result, repoHash);
        })
        
        it('Repo has the correct owner', async () => {
            const mintRewardAddress = await mintReward.address;
            const owner = await repo.getOwner();
            console.log("owner is:", owner)
            owner.should.equal(mintRewardAddress);
        })
    })
})