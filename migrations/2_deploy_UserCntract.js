const User = artifacts.require("UserContract");

module.exports = function(deployer) {
  deployer.deploy(User);
};