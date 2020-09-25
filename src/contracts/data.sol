pragma solidity 0.7.0;

contract Data {
    string dataHash;

    // Write function
    function set(string memory _dataHash) public{
        dataHash = _dataHash;
    }
    // Read function
}