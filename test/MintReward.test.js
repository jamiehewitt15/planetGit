const { assert } = require('chai');

const MintReward = artifacts.require("MintReward");
const RepoContract = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('RepoContract', (accounts)=>{
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
        // it('Creates Repo and gets RepoHash', async () => {
        //     const repoName = 'TomTest00000000';
        //     const repoHash = '21X243OJNOI12092189443RNJK24R9';
        //     const repoSlug = 'projectname3';
        //     await repo.createRepo(repoSlug, repoName, repoHash);
        //     const result = await repo.getRepoHash(repoSlug);
        //     console.log(">> getRepoHash:", result)
        //     console.log(">> getRepoHash:", result.receipt.status)
        //     assert.equal(result, repoHash);
        // })
        
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