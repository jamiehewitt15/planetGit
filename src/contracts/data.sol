pragma solidity >=0.7.0;

contract Data {
    string dataHash = 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah';
    string imgHash;

    // Write function
    function set(string memory _dataHash) public{
        dataHash = _dataHash;
    }
    // Write function
    function setAll(string memory _dataHash, string memory _imgHash) public{
        dataHash = _dataHash;
        imgHash = _imgHash;
    }
    // Read function
    function getData() public view returns(string memory) {
        return dataHash;
    }
    // Read function
    function getImg() public view returns(string memory) {
        return imgHash;
    }
}