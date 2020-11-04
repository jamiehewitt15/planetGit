// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./Repository.sol";
import "./GLDToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol"; 

contract Jobs is Ownable {
    using SafeMath for uint256;
    
    struct job{
        uint id;
        address owner;
        string title;
        string description;
        bool monthly;
        uint salary;
        bool live;
    }

    GLDToken private token;
    uint index;
    job[] public allJobs;
    // mapping repo slug to Repo
    mapping (uint => job) jobsMap;

    constructor(address tokenAddress){
        token = GLDToken(tokenAddress);
        index = 0;
    }
    
    // Create Promotion
    function createJob(string memory _title, string memory _description, bool _monthly, uint _salary) public {
       
        // Stake salary
        require(token.transferFrom(msg.sender, address(this), _salary) == true, "Could not send tokens");

        // Create Job
        jobsMap[index] = job(index, msg.sender, _title, _description, _monthly, _salary, true);
        allJobs.push(jobsMap[index]);
        index++;
    }

    // Remove Promotion
    function removeJob(uint _id) public {
       require(msg.sender == jobsMap[_id].owner);
       
        // Release Salary Stake 
        require(token.transfer(msg.sender, jobsMap[_id].salary) == true, "Could not send tokens");
        allJobs[_id].live = false;
        delete jobsMap[_id];
    }

    // Get One Jobs
    function getJob(uint _id) public view returns(job memory) {
        return jobsMap[_id];
    }
    // Get All Jobs
    function getAllJobs() public view returns(job[] memory) {
        return allJobs;
    }
}