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
        it('Updates the dataHash', async () => {
            let dataHash = 'abc123';
            await data.set(dataHash);
            const result = await data.getData();
            assert.equal(result, dataHash);
        })
        it('Updates Everything', async () => {
            let dataHash = 'abc123';
            let imgHash = 'abc12321092190';
            await data.setAll(dataHash, imgHash);
            const resultImg = await data.getImg();
            const resultData = await data.getData();
            assert.equal(resultData, dataHash);
            assert.equal(resultImg, imgHash);
        })
    })
})