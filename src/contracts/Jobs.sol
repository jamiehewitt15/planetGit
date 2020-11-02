// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./Repository.sol";
import "./GLDToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Jobs is Ownable {
    
    struct job{
        string title;
        string description;
        bool monthly;
        uint salary;
    }

    GLDToken private token;
    uint price;
    job[] public allJobs;
    address thisOwner; // Contract owner
    

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

        // Find lowest paid promotion
        uint lowestIndex = 0;
        uint lowestPaid = livePromotions[0].pricePaid;
        emit Test(msg.sender, price, _projectSlug, lowestIndex, "Test 0");
        for(uint i = 1; i < livePromotions.length; i++){
            emit Test(msg.sender, price, _projectSlug, i, "Test 1");
            if(livePromotions[i].pricePaid < lowestPaid){
                price = lowestPaid;
                lowestIndex = i;
                emit Test(msg.sender, price, _projectSlug, i, "Test 2");
            }
        }
        // Remove lowest paid promotion & Make New Promotion Live
        emit Test(msg.sender, price, _projectSlug, lowestIndex, "Test 3");
        Test2(promotions[_projectSlug]);
        livePromotions[lowestIndex] = promotions[_projectSlug]; // promotion(promotedRepo, amount);
        Test2(livePromotions[lowestIndex]);
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

    // Get Live Promotions
    function getAllPromotions() public view returns(promotion[10] memory) {
        return livePromotions;
    }
}