// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./Repository.sol";
import "./GLDToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Jobs is Ownable {
    
    struct job{
        address owner;
        string title;
        string description;
        bool monthly;
        uint salary;
    }

    GLDToken private token;
    uint index;
    job[] public allJobs;

    constructor(address tokenAddress){
        token = GLDToken(tokenAddress);
    }
    
    // Create Promotion
    function createPromotion(string memory _title, string memory _description, bool _monthly, uint _salary) public {
       
        // Stake salary
        require(token.transferFrom(msg.sender, address(this), _salary) == true, "Could not send tokens");

        // Create Job
        allJobs[index] = job(msg.sender, _title, _description, _monthly, _salary);
        index++;
    }

    // Remove Promotion
    function removeJob(string memory _projectSlug) public {
       
       
    }

    // Get Live Promotions
    function getAllPromotions() public view returns(job[] memory) {
        return allJobs;
    }
}