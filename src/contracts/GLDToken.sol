// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GLDToken is ERC20, Ownable {
    constructor(uint256 initialSupply, address newOwner) public ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
        transferOwnership(newOwner);
    }

}