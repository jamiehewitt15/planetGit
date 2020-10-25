// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GLDToken is ERC20, Ownable {
    int tokensDistributed;

    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
        // transferOwnership(newOwner);
        tokensDistributed = 0;
    }

    function mintMinerReward() public onlyOwner {
        address repoOwner = msg.sender;
        if(tokensDistributed < 1000){
            _mint(repoOwner, 1);
        } else if(tokensDistributed < 10000){
            if(tokensDistributed % 2 == 0 ){
                _mint(repoOwner, 1);
            }
        } else if(tokensDistributed < 100000){
            if(tokensDistributed % 4 == 0 ){
                _mint(repoOwner, 1);
            }
        } else if(tokensDistributed < 1000000){
            if(tokensDistributed % 8 == 0 ){
                _mint(repoOwner, 1);
            }
        } else {
            if(tokensDistributed % 16 == 0 ){
                _mint(repoOwner, 1);
            }
        }
        tokensDistributed++;
    }
    
}