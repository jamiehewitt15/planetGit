// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// Import User from RepoContract.sol
import "./RepoContract.sol";
// Import GLDToken from GLDToken.sol.sol
import "./GLDToken.sol";

contract MintReward {
    
    RepoContract private repo;
    GLDToken private token;
    

    constructor(address tokenAddress, address repoAddress) {
        token = GLDToken(tokenAddress);
        repo = RepoContract(repoAddress);
    }
    
    // Get Repo Name
    function mintReward(string memory _projectSlug) public returns(string memory) {
        token.mintMinerReward();
        string memory returnHash = repo.getRepoHash(_projectSlug);
        return returnHash;
    }
}