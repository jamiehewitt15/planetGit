const Repo = artifacts.require("RepoContract");

module.exports = function(deployer) {
  deployer.deploy(Repo);
};