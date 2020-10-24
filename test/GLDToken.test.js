const GLDToken = artifacts.require("GLDToken");
const { assert } = require('chai');

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should()

contract('GLDToken', accounts => {
    const _supply = 100000000000;
    const newOwner = '0xCD3a0e9Aedbf973c385Ff0b6720C0B316C0a580c';
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
        this.token = await GLDToken.new(_supply, newOwner)
    })

    describe('Token attributes', function(){
        it('Has the correct initial balance', async function(){
            const balance = (await this.token.balanceOf('0x4E8305E210943C924BA25F904D156297053f88Ae')).toNumber();
            console.log("balance", balance);
            balance.should.be.bignumber.equal(_supply);
        });
        it('Has the correct name', async function(){
            const name = await this.token.name();
            name.should.equal("Gold");
        });
        it('Has the correct initial owner', async function(){
            const owner = await this.token.owner();
            owner.should.equal(newOwner);
        });
        it('Has the correct symbol', async function(){
            const symbol = await this.token.symbol();
            symbol.should.equal("GLD");
        });
        it('Has the correct decimals', async function(){
            const decimals = (await this.token.decimals()).toNumber();
            console.log("decimals: ", decimals);
            decimals.should.be.bignumber.equal(18);
        });
    })
})