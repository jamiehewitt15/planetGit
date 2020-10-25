// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// Import GLDToken from GLDToken.sol.sol
import "./GLDToken.sol";

contract OwnershipTransfer {
    
    GLDToken public token;
    
    constructor(address tokenAddress, address newOwner) {
        token = GLDToken(tokenAddress);
        token.transferOwnership(newOwner);
        // GLDToken(tokenAddress).transferOwnership(newOwner);
    }

    
}