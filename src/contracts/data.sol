pragma solidity >=0.7.0;

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
    // mapping address to User to Repo
    mapping (string => Repo) repos;
    // mapping address to User to Repo
    mapping (address => mapping (string => Repo)) userRepos;

    // Create User
    function createUser(string memory _userName) public{
        users[msg.sender] = User(msg.sender, _userName);
    }
    // Create Repo
    function createRepo(string memory _projectSlug, string memory _projectName, string memory _imgHash, string memory _repoHash) public{
        userRepos[msg.sender][_projectSlug] = Repo(_projectName, _imgHash, _repoHash);
    }

   // Get Repo Name
    function getRepoName(string memory _projectSlug) public view returns(string memory) {
        return repos[_projectSlug].repoName;
    }
    
   // Get Repo Name
    function getRepoImg(string memory _projectSlug) public view returns(string memory) {
        return repos[_projectSlug].repoHash;
    }
    
   // Get Repo Name
    function getRepoHash(string memory _projectSlug) public view returns(string memory) {
        return repos[_projectSlug].imgHash;
    }
    // Read function
    function getUser() public view returns(string memory) {
        return users[msg.sender].userName;
    }
}