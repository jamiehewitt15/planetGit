pragma solidity >=0.7.0;

contract Data {
    
    struct User {
        address _address;
        bytes15 userName;
    }

    struct Repo {
        bytes15 repoName;
        bytes imgHash;
        bytes repoHash;
    }

    // mapping address to User 
    mapping (address => User) users;
    address[] public allUsers;
    // mapping address to User 
    mapping (bytes15 => Address) userAddress;
    bytes15[] public usersAddresses;
    // mapping address to User to Repo
    mapping (bytes15 => Repo) repos;
    // mapping address to User to Repo
    mapping (address => mapping (bytes15 => Repo)) userRepos;
    bytes15[] public allRepos;
    
    // Check Username is unique
    function uniqueUsername(address member) public view returns(bool isUser) {
        return (members[member] != 0);
    }
    // Create User
    function createUser(bytes15 _userName) public{
        if(users[msg.sender] =){

        }
        users[msg.sender] = User(msg.sender, _userName);
        allUsers.push(msg.sender);
    }
    // Create Repo
    function createRepo(bytes15 _projectSlug, bytes15 _projectName, bytes memory _imgHash, bytes memory _repoHash) public{
        userRepos[msg.sender][_projectSlug] = Repo(_projectName, _imgHash, _repoHash);
        allRepos.push(_projectSlug);
    }
    // Update Repo
    function updateRepo(bytes15 _projectSlug, bytes memory _repoHash) public{
        userRepos[msg.sender][_projectSlug].repoHash =  _repoHash;
    }
   // Get Repo Name
    function getRepoName(bytes15 _projectSlug) public view returns(bytes15) {
        return repos[_projectSlug].repoName;
    }
   // Get Repo Img
    function getRepoImg(bytes15 _projectSlug) public view returns(bytes memory) {
        return repos[_projectSlug].repoHash;
    }
   // Get Repo Name
    function getRepoHash(bytes15 _projectSlug) public view returns(bytes memory) {
        return repos[_projectSlug].imgHash;
    }
    // Get User function
    function getUser() public view returns(bytes15) {
        return users[msg.sender].userName;
    }
    // Get All Users
    function getAllUser() public view returns(address[] memory) {
        return allUsers;
    }
    // Get All Users
    function getAllRepos() public view returns(bytes15[] memory) {
        return allRepos;
    }
}