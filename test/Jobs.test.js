const { assert } = require('chai');
const Web3 = require('web3');

const provider = 'HTTP://127.0.0.1:7545' 
const web3Provider = new Web3.providers.WebsocketProvider(provider);
const web3 = new Web3(web3Provider);

const Jobs = artifacts.require("Jobs");
const GLDToken = artifacts.require("GLDToken");


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Jobs', (accounts)=>{
    // Testing the Data smart contract
    const walletAddress = accounts[0];
    let token;
    let jobs;

    before(async () => {
        // Fetch the smart contract before running tests
        jobs = await Jobs.deployed();
        token = await GLDToken.deployed();
    })

    describe('deployment', async()=> { 
        it('Deploys successfully', async () => {
            const address = jobs.address;
            // Test the smart contract has been deployed with a valid address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('Functions', async () => {
        it('Creates a job', async () => {
            const initialBalance = parseInt(await token.balanceOf(walletAddress));
            const title = "Jobtitle";
            const description = "Jobtitle - this is a fantastic job. Start today!"; 
            const monthly = false;
            const salary = 50;
            await token.approve(jobs.address, salary);
            await jobs.createJob(title, description, monthly, salary)
            const finalBalance = parseInt(await token.balanceOf(walletAddress));
            // assert.notEqual(finalBalance, initialBalance);
            // assert.isAbove(initialBalance, finalBalance, 'Final balance is greater than middle balance');
        
            // const retunJob = await jobs.getJob(title);
            // console.log("retunJob", retunJob);
            // assert.equal(retunJob.title, title);
            // assert.equal(retunJob.description, description);
            // assert.equal(retunJob.monthly, monthly);
            // assert.equal(retunJob.salary, salary);
        })
        it('Removes a job', async () => {
            const initialBalance = parseInt(await token.balanceOf(walletAddress));
            const ID = 0;
            await jobs.removeJob(ID);
            const finalBalance = parseInt(await token.balanceOf(walletAddress));
            // assert.notEqual(finalBalance, initialBalance);
            // assert.isAbove(initialBalance, finalBalance, 'Final balance is greater than middle balance');
        
            const retunJob = await jobs.getJob(ID);
            console.log("retunJob", retunJob);
            // assert.equal(retunJob.title, title);
            // assert.equal(retunJob.description, description);
            // assert.equal(retunJob.monthly, monthly);
            // assert.equal(retunJob.salary, salary);
            
        })

       
    })
})