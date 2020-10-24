const User = artifacts.require("UserContract");
const Repo = artifacts.require("RepoContract");
const GLDToken = artifacts.require("GLDToken");

module.exports = async function(deployer) {
  deployer.deploy(User);
  deployer.deploy(Repo);
  const _initialSupply = 1000000000;
  deployer.deploy(GLDToken, _initialSupply, '0x2d6edDF06b63F53DAa6Cd9727aD40eB90Dab8559');
};