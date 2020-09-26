// const { assert, before, contract } = require('chai');

const Data = artifacts.require("Data");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Data', (accounts)=>{
    // Testing the Data smart contract
    let data;

    before(async() => {
        // Fetch the smart contract before running tests
        data = await Data.deployed();
    })

    describe('deployment', async()=> { 
        it('deploys successfully', async () => {
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
        it('updates the dataHash', async () => {

        })
    })
})