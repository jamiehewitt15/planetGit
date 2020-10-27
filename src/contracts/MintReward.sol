// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// Import User from Repository.sol
import "./Repository.sol";
// Import GLDToken from GLDToken.sol.sol
import "./GLDToken.sol";

contract MintReward {
    
    Repository private repo;
    GLDToken private token;

    event Hash(address indexed _from, string _value, string _slug, bytes4 indexed nonce);

    constructor(address tokenAddress, address repoAddress) {
        token = GLDToken(tokenAddress);
        repo = Repository(repoAddress);
    }
    
    // Get Repo Name
    function mintReward(string memory _projectSlug, bytes4 nonce) public {
        address repoOwner = repo.getRepoOwner(_projectSlug);
        token.mintMinerReward(repoOwner);
        string memory repoHash = repo.getRepoHash(_projectSlug);
        
        emit Hash(msg.sender, repoHash, _projectSlug, nonce);
    }
}