const User = artifacts.require("UserContract");
const Repo = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");

module.exports = async function(deployer) {
  const _initialSupply = 1000000000;
  deployer.deploy(User);


  await deployer.deploy(GLDToken, _initialSupply);
  const tokenAddress = await Repo.deployed();
  console.log("repoAddress: ", tokenAddress.address)

  
  deployer.deploy(Repo, tokenAddress.address);
  // const repoAddress = await Repo.deployed();
  // console.log("repoAddress: ", repoAddress.address);
};