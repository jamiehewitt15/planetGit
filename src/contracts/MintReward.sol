// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// Import User from RepoContract.sol
import "./RepoContract.sol";
// Import GLDToken from GLDToken.sol.sol
import "./GLDToken.sol";

contract MintReward {
    
    RepoContract private repo;
    GLDToken private token;

    event Hash(address indexed _from, string _value);

    constructor(address tokenAddress, address repoAddress) {
        token = GLDToken(tokenAddress);
        repo = RepoContract(repoAddress);
    }
    
    // Get Repo Name
    function mintReward(string memory _projectSlug) public {
        address repoOwner = repo.getRepoOwner(_projectSlug);
        token.mintMinerReward(repoOwner);
        string memory repoHash = repo.getRepoHash(_projectSlug);
        emit Hash(msg.sender, repoHash);
    }
}