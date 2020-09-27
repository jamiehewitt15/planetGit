pragma solidity >=0.7.0;

contract Data {
    string projectName;
    string imgHash = 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah';

    // Write function
    function setName(string memory _projectName) public{
        projectName = _projectName;
    }
    // Write function
    function setAll(string memory _projectName, string memory _imgHash) public{
        projectName = _projectName;
        imgHash = _imgHash;
    }
    // Read function
    function getName() public view returns(string memory) {
        return projectName;
    }
    // Read function
    function getImg() public view returns(string memory) {
        return imgHash;
    }
}