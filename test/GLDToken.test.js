const GLDToken = artifacts.require("GLDToken");
const { assert } = require('chai');
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('GLDToken', accounts => {
    const _supply = 100000000000;
    let token;

    before(async () => {
        // Fetch the smart contract before running tests
        token = await GLDToken.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = token.address;
            console.log(address);
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    beforeEach(async function() {
        this.token = await GLDToken.new(_supply)
    })

    describe('Token attributes', function(){
        it('Has the correct name', async function(){
            const name = await this.token.name();
            name.should.equal("Gold");
        });
        it('Has the correct symbol', async function(){
            const symbol = await this.token.symbol();
            symbol.should.equal("GLD");
        });
        it('Has the correct decimals', async function(){

        });
    })
})