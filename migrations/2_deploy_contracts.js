const User = artifacts.require("UserContract");
const Repo = artifacts.require("Repository");
const GLDToken = artifacts.require("GLDToken");
const MintReward = artifacts.require("MintReward");
const Promotions = artifacts.require("Promotions");

module.exports = async function(deployer) {
  // Deploying User Contract
  deployer.deploy(User);

  // Deploying Token Contract
  await deployer.deploy(GLDToken);
  const token = await GLDToken.deployed();
  console.log(">>> Token Address: ", token.address)
  
  // Deploying Repo Contract
  await deployer.deploy(Repo, token.address);
  const repo = await Repo.deployed();
  console.log(">>> Repo Address: ", repo.address);

  // Deploying MintReward Contract
  await deployer.deploy(MintReward, token.address, repo.address);
  const mintReward = await MintReward.deployed();
  console.log(">>> mintReward Address: ", mintReward.address);

  // Deploying Promotions Contract
  await deployer.deploy(Promotions, token.address, repo.address);
  const promotions = await MintReward.deployed();
  console.log(">>> promotions Address: ", promotions.address);
  
  // Transfering ownership of the Token contract to the MintReward contract
  await token.transferOwnership(mintReward.address);
  
  // Transfering ownership of the Repo contract to the MintReward contract
  await repo.transferOwnership(mintReward.address);
};