const { assert } = require('chai');
const Web3 = require('web3');

const provider = 'HTTP://127.0.0.1:7545' 
const web3Provider = new Web3.providers.WebsocketProvider(provider);
const web3 = new Web3(web3Provider);

const Promotions = artifacts.require("Promotions");
const Repository = artifacts.require("Repository");
const GLDToken = artifacts.require("GLDToken");
const MintReward = artifacts.require("MintReward");


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Promotions', (accounts)=>{
    // Testing the Data smart contract
    const walletAddress = accounts[0];
    let promotions;
    let repo;
    let token;
    let mintReward;
    let repoName;
    let repoSlug;
    let repoHash;
    let repoName2;
    let repoSlug2;
    let repoHash2;
    let owner;
    const amount = 1000;
    const amount2 = 2000;

    before(async () => {
        // Fetch the smart contract before running tests
        promotions = await Promotions.deployed();
        repo = await Repository.deployed();
        token = await GLDToken.deployed();
        mintReward = await MintReward.deployed();
        repoName = 'Promotions Repo 1';
        repoSlug = 'promotionsRepo1';
        repoHash = 'ABC3OJNOI12092189443RNJK24R0';
        repoName2 = 'Promotions Repo 2';
        repoSlug2 = 'promotionsRepo2';
        repoHash2 = 'XYZ3OJNOI12092189443RNJK24R1';
        await repo.createRepo(repoSlug, repoName, repoHash);
        await repo.createRepo(repoSlug2, repoName2, repoHash2);
        owner = await repo.getRepoOwner(repoSlug);
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
            const name = await repo.getRepoName(repoSlug)
            assert.equal(owner, walletAddress);
            assert.equal(name, repoName);
            const initialBalance = parseInt(await token.balanceOf(walletAddress));
            const nonce = web3.utils.randomHex(4); 
            await mintReward.mintReward(repoSlug, nonce);
            const middleBalance = parseInt(await token.balanceOf(walletAddress));
            assert.notEqual(initialBalance, middleBalance);
            assert.isAbove(middleBalance, initialBalance, 'Middle balance is greater than initial balance');
        
            
            await token.approve(promotions.address, amount)
            await promotions.createPromotion(repoSlug, amount);
            const finalBalance = parseInt(await token.balanceOf(walletAddress));
            assert.notEqual(finalBalance, middleBalance);
            assert.isAbove(middleBalance, finalBalance, 'Final balance is greater than middle balance');
        
            const retunPromotion = await promotions.getPromotion(repoSlug);
            assert.equal(retunPromotion.pricePaid, amount);
            assert.equal(retunPromotion.promotedRepo.repoHash, repoHash);
            assert.equal(retunPromotion.promotedRepo.repoName, repoName);
        })

        it('Live promotions are correctly returned', async () => {
            const livePromotions = await promotions.getAllPromotions();
            assert.equal(livePromotions[0].pricePaid, amount);
            assert.equal(livePromotions[0].promotedRepo.repoHash, repoHash);
            assert.equal(livePromotions[0].promotedRepo.repoName, repoName);
            const name2 = await repo.getRepoName(repoSlug2);
            assert.equal(name2, repoName2);

            await token.approve(promotions.address, amount2)
            await promotions.createPromotion(repoSlug2, amount2);
            const livePromotions2 = await promotions.getAllPromotions();

            console.log("livePromotion 2:", livePromotions2[9].pricePaid);
            console.log("livePromotion 2:", livePromotions2[9].promotedRepo.repoName);
            console.log("livePromotion 2:", livePromotions2[9].promotedRepo.repoHash);

            assert.equal(livePromotions2[9].pricePaid, amount2);
            assert.equal(livePromotions2[9].promotedRepo.repoHash, repoHash2);
            assert.equal(livePromotions2[9].promotedRepo.repoName, repoName2);
        });
        
        
       
    })
})