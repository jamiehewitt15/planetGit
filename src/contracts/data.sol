pragma solidity >=0.7.0;

contract Data {
    string dataHash = 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah';

    // Write function
    function set(string memory _dataHash) public{
        dataHash = _dataHash;
    }
    // Read function
    function get() public view returns(string memory) {
        return dataHash;
    }
}