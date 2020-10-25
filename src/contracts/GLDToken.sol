// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol"; 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GLDToken is ERC20, Ownable {
    using SafeMath for uint256;

    address private systemOwner;
    uint distribution;
    uint tokenReward;
    uint systemReward;
    uint tokenTarget;

    constructor() ERC20("Gold", "GLD") {
        systemOwner = msg.sender;
        distribution        =    0;
        tokenReward         =    1000000000000000000;
        systemReward        =    100000000000000000; 
        tokenTarget         =    1000;
    }

    function mintMinerReward(address repoOwner) public onlyOwner {

        _mint(repoOwner, tokenReward);
        _mint(systemOwner, systemReward);

        if(distribution == tokenTarget){
            tokenReward = tokenReward.div(10);
            tokenTarget = tokenTarget.mul(10);
        } 
        distribution = distribution.add(1);
    }

    // Get Token Reward
    function getReward() public view returns(uint) {
        return tokenReward;
    }
    // Get Token Distribution
    function getDistribution() public view returns(uint) {
        return distribution;
    }
    // Get Token System Reward
    function getSystemReward() public view returns(uint) {
        return systemReward;
    }
    // Get Token Target
    function getTarget() public view returns(uint) {
        return tokenTarget;
    }
}