const User = artifacts.require("UserContract");
const Repo = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");

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
  
  // Transfering ownership of the Token contract to the Repo contract
  await token.transferOwnership(repo.address);
};