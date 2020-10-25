const { assert } = require('chai');

const RepoContract = artifacts.require("RepoContract");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('RepoContract', (accounts)=>{
    // Testing the Data smart contract
    let repo;

    before(async () => {
        // Fetch the smart contract before running tests
        repo = await RepoContract.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = repo.address;
            console.log(address);
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('storage', async () => {
        // Test uniqueRepoName function
        it('Checks unique RepoName', async () => {
            const repoName = 'Project Name 1';
            const repoSlug1 = 'projectname1';
            const result1 = await repo.uniqueRepoSlug(repoSlug1);
            // assert.equal(result1, true);
            await repo.createRepo(repoSlug1, repoName, "X243OJNOIUND98243RNJK24R9");
            const result2 = await repo.uniqueRepoSlug(repoSlug1);
            assert.equal(result2, false);
        })
        // Test createRepo and getRepoName functions
        it('Creates Repo and gets reponame', async () => {
            const repoName = 'Project Name 2';
            const repoSlug = 'projectname2';
            await repo.createRepo(repoSlug, repoName, "X243OJNOIUND98243RNJK24R9");
            const result = await repo.getRepoName(repoSlug);
            assert.equal(result, repoName);
        })
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
        // Test createRepo and getAllRepos functions
        it('Creates Repo and gets all repos', async () => {
            const repoSlug1 = 'projectname4';
            const repoName1 = 'Project Name 4';
            const repoHash1 = '21X243OJNOI12092189443RNJK24R9';
            const repoSlug2 = 'projectname5';
            const repoName2= 'Project Name 5';
            const repoHash2 = 'S23443OJNOI12092189443RNJK90PO';
            await repo.createRepo(repoSlug1, repoName1, repoHash1);
            await repo.createRepo(repoSlug2, repoName2, repoHash2);
            const result = await repo.getAllRepos();
            console.log(">> getAllRepos:", result)
            assert.equal(result[0], 'projectname1');
            assert.equal(result[1], 'projectname2');
        })
    })
})