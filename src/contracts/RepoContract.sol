// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

// Import User from User.sol
import "./UserContract.sol";
// Import GLDToken from GLDToken.sol.sol
import "./GLDToken.sol";

contract repoContract {
    
    GLDToken private token;
    
    constructor(address tokenAddress) {
        
        token = GLDToken(tokenAddress);
    }

    struct Repo {
        address owner;
        string repoName;
        string repoHash;
        bool exists;
    }
    // mapping repo slug to Repo
    mapping (string => Repo) repoNames;
    // mapping User address to Repo
    mapping (address => mapping (string => Repo)) userRepos;
    string[] public allRepos;

    // Check RepoName is unique
    function uniqueRepoSlug(string memory _projectSlug) public view returns(bool isUnique) {
        if(repoNames[_projectSlug].exists != true){
            return true;
        } else{
            return false;
        }
    }
    // Create Repo
    function createRepo(string memory _projectSlug, string memory _projectName, string memory _repoHash) public{
        if(uniqueRepoSlug(_projectSlug)){
            Repo memory newRepo = Repo(msg.sender, _projectName, _repoHash, true);
            userRepos[msg.sender][_projectSlug] = newRepo;
            repoNames[_projectSlug] = newRepo;
            allRepos.push(_projectSlug);
        }
    }
    // Update Repo
    function updateRepo(string memory _projectSlug, string memory _repoHash) public{
        if(msg.sender == repoNames[_projectSlug].owner){
        userRepos[msg.sender][_projectSlug].repoHash =  _repoHash;
        repoNames[_projectSlug].repoHash =  _repoHash;
        }
    }
   // Get Repo Name
    function getRepoName(string memory _projectSlug) public view returns(string memory) {
        return repoNames[_projectSlug].repoName;
    }
   // Get Repo Name
    function getRepoHash(string memory _projectSlug) public view returns(string memory) {
        return repoNames[_projectSlug].repoHash;
    }
    // Get All Repos
    function getAllRepos() public view returns(string[] memory) {
        return allRepos;
    }

    //////////////////////
    
    // Mint Token
    function mintToken() public {
        token.mintMinerReward();
    }
    // Get Token Contract Owner
    function getOwner() public view returns(address)  {
        return token.owner();
    }
    
}