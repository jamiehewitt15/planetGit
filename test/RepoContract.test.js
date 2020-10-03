const { assert } = require('chai');

const Data = artifacts.require("Data");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Data', (accounts)=>{
    // Testing the Data smart contract
    let data;

    before(async () => {
        // Fetch the smart contract before running tests
        data = await Data.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = data.address;
            console.log(address);
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('storage', async () => {
        it('Updates the projectName', async () => {
            let projectName = 'abc123';
            await data.setName(projectName);
            const result = await data.getName();
            assert.equal(result, projectName);
        })
        it('Updates project Name', async () => {
            let projectName = 'abc123';
            await data.setName(projectName);
            const resultData = await data.getName();
            assert.equal(resultData, projectName);
        })
        it('Updates Image Hash', async () => {
            let imgHash = 'abc12321092190';
            await data.setImg(imgHash);
            const resultImg = await data.getImg();
            assert.equal(resultImg, imgHash);
        })
        it('Updates Repo Hash', async () => {
            let repoHash = 'lksdjkdopewabc12321092190';
            await data.setRepo(repoHash);
            const resultRepo = await data.getRepo();
            assert.equal(resultRepo, repoHash);
        })
        it('Updates Everything', async () => {
            let projectName = 'abc123';
            let imgHash = 'abc12321092190';
            let repoHash = 'lksdjkdopewabc12321092190';
            await data.setAll(projectName, imgHash, repoHash);
            const resultImg = await data.getImg();
            const resultData = await data.getName();
            const resultRepo = await data.getRepo();
            assert.equal(resultData, projectName);
            assert.equal(resultImg, imgHash);
            assert.equal(resultRepo, repoHash);
        })
    })
})