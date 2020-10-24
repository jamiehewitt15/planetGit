const User = artifacts.require("UserContract");
const Repo = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");

module.exports = async function(deployer) {
  deployer.deploy(User);
  await deployer.deploy(Repo);
  const repoAddress = await Repo.deployed();
  console.log("repoAddress: ", repoAddress.address)
  const _initialSupply = 1000000000;
  deployer.deploy(GLDToken, _initialSupply, repoAddress.address);
};