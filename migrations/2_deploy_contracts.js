const User = artifacts.require("UserContract");
const Repo = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");

module.exports = async function(deployer) {
  const _initialSupply = 1000000000;
  deployer.deploy(User);


  await deployer.deploy(GLDToken, _initialSupply);
  const token = await GLDToken.deployed();
  console.log(">>> Token Address: ", token.address)
  
  await deployer.deploy(Repo, token.address);
  const repo = await Repo.deployed();
  console.log(">>> Repo Address: ", repo.address);
  
  await token.transferOwnership(repo.address);

  
};