// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

// Import User from User.sol
import "./UserContract.sol";

contract repoContract {

    struct Repo {
        address owner;
        bytes15 repoName;
        bytes repoHash;
        bool exists;
    }
    // mapping repo slug to Repo
    mapping (bytes15 => Repo) repoNames;
    // mapping User address to Repo
    mapping (address => mapping (bytes15 => Repo)) userRepos;
    bytes15[] public allRepos;

    // Check RepoName is unique
    function uniqueRepoName(bytes15 _userName) public view returns(bool isUnique) {
        if(repoNames[_userName].exists != true){
            return true;
        } else{
            return false;
        }
    }
    // Create Repo
    function createRepo(bytes15 _projectSlug, bytes15 _projectName, bytes memory _repoHash) public{
        if(uniqueRepoName(_projectSlug)){
            Repo memory newRepo = Repo(msg.sender, _projectName, _repoHash, true);
            userRepos[msg.sender][_projectSlug] = newRepo;
            repoNames[_projectSlug] = newRepo;
            allRepos.push(_projectSlug);
        }
    }
    // Update Repo
    function updateRepo(bytes15 _projectSlug, bytes memory _repoHash) public{
        if(msg.sender == repoNames[_projectSlug].owner){
        userRepos[msg.sender][_projectSlug].repoHash =  _repoHash;
        repoNames[_projectSlug].repoHash =  _repoHash;
        }
    }
   // Get Repo Name
    function getRepoName(bytes15 _projectSlug) public view returns(bytes15) {
        return repoNames[_projectSlug].repoName;
    }
   // Get Repo Name
    function getRepoHash(bytes15 _projectSlug) public view returns(bytes memory) {
        return repoNames[_projectSlug].repoHash;
    }
    // Get All Repos
    function getAllRepos() public view returns(bytes15[] memory) {
        return allRepos;
    }
}