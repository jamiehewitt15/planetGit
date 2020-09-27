pragma solidity >=0.7.0;

contract Data {
    string projectName;
    string repoHash;
    string imgHash = 'QmNWxPVpr26ichSV9jBdPrFdjPTXBx5f1XQG4roZtVNrah';

    // Write Project Name function
    function setName(string memory _projectName) public{
        projectName = _projectName;
    }
    // Write REPO function
    function setImg(string memory _imgHash) public{
        imgHash = _imgHash;
    }
    // Write REPO function
    function setRepo(string memory _repoHash) public{
        repoHash = _repoHash;
    }
    // Write ALL function
    function setAll(string memory _projectName, string memory _imgHash, string memory _repoHash) public{
        projectName = _projectName;
        imgHash = _imgHash;
        repoHash = _repoHash;
    }
    // Read function
    function getName() public view returns(string memory) {
        return projectName;
    }
    // Read function
    function getImg() public view returns(string memory) {
        return imgHash;
    }
    // Read function
    function getRepo() public view returns(string memory) {
        return repoHash;
    }
}