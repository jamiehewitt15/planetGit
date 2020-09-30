pragma solidity >=0.7.0;
// pragma experimental ABIEncoderV2;

contract Data {
    
    struct User {
        address _address;
        string userName;
    }

    struct Repo {
        string repoName;
        string imgHash;
        string repoHash;
    }

    // mapping address to User 
    mapping (address => User) users;
    address[] public allUsers;
    // mapping address to User to Repo
    mapping (string => Repo) repos;
    // mapping address to User to Repo
    mapping (address => mapping (string => Repo)) userRepos;
    string[] public allRepos;

    // Create User
    function createUser(string memory _userName) public{
        users[msg.sender] = User(msg.sender, _userName);
        allUsers.push(msg.sender);
    }
    // Create Repo
    function createRepo(string memory _projectSlug, string memory _projectName, string memory _imgHash, string memory _repoHash) public{
        userRepos[msg.sender][_projectSlug] = Repo(_projectName, _imgHash, _repoHash);
        allRepos.push(_projectSlug);
    }
    // Update Repo
    function updateRepo(string memory _projectSlug, string memory _repoHash) public{
        userRepos[msg.sender][_projectSlug].repoHash =  _repoHash;
    }
   // Get Repo Name
    function getRepoName(string memory _projectSlug) public view returns(string memory) {
        return repos[_projectSlug].repoName;
    }
   // Get Repo Img
    function getRepoImg(string memory _projectSlug) public view returns(string memory) {
        return repos[_projectSlug].repoHash;
    }
   // Get Repo Name
    function getRepoHash(string memory _projectSlug) public view returns(string memory) {
        return repos[_projectSlug].imgHash;
    }
    // Get User function
    function getUser() public view returns(string memory) {
        return users[msg.sender].userName;
    }
    // Get All Users
    function getAllUser() public view returns(address[] memory) {
        return allUsers;
    }
    // Get All Users
    // function getAllRepos() public view returns(string[] memory) {
    //     return allRepos;
    // }
}