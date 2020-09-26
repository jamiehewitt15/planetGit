const { contracts_build_directory } = require('../truffle-config');
const { assert } = require('chai');

const Data = artifacts.require("Data");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contracts_build_directory('Data', (accounts)=>{
    // Testing the Data smart contract
    let data;

    describe('deployment', async()=> {
        it('deploys successfully', async () => {
            data = await Data.deployed();
            const address = data.address;
            console.log(address);
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })
})