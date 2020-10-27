// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./Repository.sol";
import "./GLDToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Promotions is Repository{
    
    Repository private repo;
    GLDToken private token;
    uint price;
    promotion[10] public livePromotions;
    mapping (string => promotion) promotions;
    address thisOwner; // Contract owner
    
    struct promotion{
        Repo promotedRepo;
        uint pricePaid;
    }

    constructor(address tokenAddress, address repoAddress) Repository(tokenAddress){
        repo = Repository(repoAddress);
        token = GLDToken(tokenAddress);
        thisOwner = msg.sender;
    }
    
    // Create Promotion
    function createPromotion(string memory _projectSlug, uint amount) public {
        // Check amount
        require(amount > price, "Value sent must be greater than price."); 

        // send money
        require(token.transferFrom(msg.sender, address(this), amount) == true, "Could not send tokens");

        // Get Repo
        Repo memory promotedRepo = repo.getRepo(_projectSlug);

        // Create Promotion
        promotions[_projectSlug] = promotion(promotedRepo, amount);

        // Remove lowest paid promotion & Make New Promotion Live
        for(uint i=0; i < livePromotions.length; i++){
            if(livePromotions[i].pricePaid == price){
                livePromotions[i] = promotion(promotedRepo, amount);
            }
            if(livePromotions[i].pricePaid <= price){
                price = livePromotions[i].pricePaid;
            }
        }
        
    }
    // Remove Promotion
    function removePromotion(string memory _projectSlug) public {
       
       
    }
    // Get Price
    function getPrice() public view returns(uint) {
        return price;
    }
    // Get One Promotion
    function getPromotion(string memory _projectSlug) public view returns(promotion memory) {
        return promotions[_projectSlug];
    }

    // Get All Promotions
    // function getAllPromotions() public view returns(Repository[] memory) {
    //     return price;
    // }
}