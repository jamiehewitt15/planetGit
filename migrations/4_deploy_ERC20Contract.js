const GLDToken = artifacts.require("GLDToken");

module.exports = function(deployer) {
  const _initialSupply = 1000000000;
  deployer.deploy(GLDToken, _initialSupply);
};