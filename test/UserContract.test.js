const { assert } = require('chai');

const UserContract = artifacts.require("UserContract");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('UserContract', (accounts)=>{
    // Testing the Data smart contract
    let user;

    before(async () => {
        // Fetch the smart contract before running tests
        user = await UserContract.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = user.address;
            console.log(address);
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('storage', async () => {
        // Test uniqueUsername function
        it('Checks unique username', async () => {
            let username = 'johnTest0000000';
            await user.createUser(username, "X243OJNOIUND98243RNJK24R9");
            const result = await user.uniqueUsername(username);
            assert.equal(result, false);
        })
        // Test createUser and getUserName functions
        it('Creates User and gets username', async () => {
            let username = 'SarahTest000000';
            await user.createUser(username, "X243OJNOIUND98243RNJK24R9");
            const result = await user.getUserName();
            assert.equal(result, username);
        })
        // Test createUser and getUserImg functions
        it('Creates User and gets userImg', async () => {
            const username = 'TomTest00000000';
            const imgHash = '21X243OJNOI12092189443RNJK24R9';
            await user.createUser(username, imgHash);
            const result = await user.getUserImg();
            assert.equal(result, imgHash);
        })
        // Test createUser and getAllUsers functions
        it('Creates User and gets all users', async () => {
            const username1 = 'TomTest00000000';
            const imgHash1 = '21X243OJNOI12092189443RNJK24R9';
            const username2 = 'SarahTest000000';
            const imgHash2 = 'S23443OJNOI12092189443RNJK90PO';
            await user.createUser(username1, imgHash1);
            await user.createUser(username2, imgHash2);
            const result = await user.getAllUsers();
            console.log(">> getAllUsers:", result)
            assert.equal(result[0], 'johnTest0000000');
            assert.equal(result[1], 'SarahTest000000');
        })
        
    })
})