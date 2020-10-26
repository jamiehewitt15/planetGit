// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

// Import User from RepoContract.sol
import "./RepoContract.sol";
// Import GLDToken from GLDToken.sol.sol
import "./GLDToken.sol";

contract Promotions {
    
    RepoContract private repo;
    GLDToken private token;
    

    struct promotion {
        address owner;
        string repoName;
        string repoHash;
        bool live;
    }

    promotion[] public allPromotions;

    constructor(address tokenAddress, address repoAddress) {
        token = GLDToken(tokenAddress);
        repo = RepoContract(repoAddress);
    }
    
    // Create Promotion
    function createPromotion(string memory _projectSlug) public {
        
        
    }
    // Remove Promotion
    function removePromotion(string memory _projectSlug) public {
       
       
    }

    // Get Promotion

    // Get All Promotions
    function getAllPromotions() public view returns(promotion[] memory) {
        return allPromotions;
    }
}