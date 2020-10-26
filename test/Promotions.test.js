const { assert } = require('chai');

const Promotions = artifacts.require("Promotions");
const Repository = artifacts.require("Repository");
const GLDToken = artifacts.require("GLDToken");


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Promotions', (accounts)=>{
    // Testing the Data smart contract
    let promotions;
    let repo;
    let token;
    

    before(async () => {
        // Fetch the smart contract before running tests
        promotions = await Promotions.deployed();
        repo = await Repository.deployed();
        token = await GLDToken.deployed();
        
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
            const repoName = 'Project Name 1';
            const repoSlug = 'projectname1';
            const repoHash = 'X243OJNOIUND98243RNJK24R9';
            await repo.createRepo(repoSlug, repoName, repoHash);
            await promotions.createPromotion(repoSlug, 10);
        })

        it('Token has the correct owner', async () => {
            
        });
        
        
       
    })
})