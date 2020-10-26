// // SPDX-License-Identifier: MIT
// pragma solidity >=0.7.0;
// pragma experimental ABIEncoderV2;

// // Import User from Repository.sol
// import "./Repository.sol";
// // Import GLDToken from GLDToken.sol.sol
// import "./GLDToken.sol";

// contract Promotions is  {
    
//     Repository private repo;
//     GLDToken private token;
    

//     struct promotion {
//         address owner;
//         Repo promotedRepo;
//     }

//     promotion[] public allPromotions;

//     constructor(address tokenAddress, address repoAddress) {
//         token = GLDToken(tokenAddress);
//         repo = Repository(repoAddress);
//     }
    
//     // Create Promotion
//     function createPromotion(string memory _projectSlug) public {
//         // send money
        
//         // create promotion
        
//     }
//     // Remove Promotion
//     function removePromotion(string memory _projectSlug) public {
       
       
//     }

//     // Get Promotion

//     // Get All Promotions
//     function getAllPromotions() public view returns(promotion[] memory) {
//         return allPromotions;
//     }
// }