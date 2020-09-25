pragma solidity >=0.7.1;

contract Data {
    string dataHash;

    // Write function
    function set(string memory _dataHash) public{
        dataHash = _dataHash;
    }
    // Read function
    function get() public view returns(string memory) {
        return dataHash;
    }
}