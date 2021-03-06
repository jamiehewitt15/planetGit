const { assert } = require('chai');

const Repository = artifacts.require("Repository");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Repository', (accounts)=>{
    // Testing the Data smart contract
    const walletAddress = accounts[0];
    let repo;

    before(async () => {
        // Fetch the smart contract before running tests
        repo = await Repository.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = repo.address;
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
            await repo.createRepo(repoSlug1, repoName, "A243OJNOIUND98243RNJK24R7");
            const result2 = await repo.uniqueRepoSlug(repoSlug1);
            assert.equal(result2, false);
        })
        // Test createRepo and getRepoName functions
        it('Creates Repo and gets reponame', async () => {
            const repoName = 'Project Name 2';
            const repoSlug = 'projectname2';
            await repo.createRepo(repoSlug, repoName, "B243OJNOIUND98243RNJK24R9");
            const result = await repo.getRepoName(repoSlug);
            assert.equal(result, repoName);
        })
        // Test createRepo and gets repo owner Address
        it('Creates Repo and gets repo owner Address', async () => {
            const repoName = 'Project Name 3';
            const repoSlug = 'projectname3';
            await repo.createRepo(repoSlug, repoName, "C243OJNOIUND98243RNJK13R3");
            const owner = await repo.getRepoOwner(repoSlug);
            assert.equal(owner, walletAddress);
        })
        // Test createRepo and getAllRepos functions
        it('Creates Repo and gets all repos', async () => {
            const repoSlug1 = 'projectname4';
            const repoName1 = 'Project Name 4';
            const repoHash1 = 'D1X243OJNOI12092189443RNJK24R9';
            const repoSlug2 = 'projectname5';
            const repoName2= 'Project Name 5';
            const repoHash2 = 'E23443OJNOI12092189443RNJK90PO';
            await repo.createRepo(repoSlug1, repoName1, repoHash1);
            await repo.createRepo(repoSlug2, repoName2, repoHash2);
            const result = await repo.getAllRepos();
            assert.equal(result[0], 'projectname1');
            assert.equal(result[1], 'projectname2');
        })
    })
})