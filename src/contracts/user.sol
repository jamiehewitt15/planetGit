pragma solidity >=0.7.0;

contract Data {
    
    struct User {
        address _address;
        bytes15 userName;
    }

    // mapping address to User 
    mapping (address => User) UserAddrsMap;
    address[] public allUserAddrs;
    // mapping address to User 
    mapping (bytes15 => User) userNameMap;
    bytes15[] public allUserNames;
    
    
    // Check Username is unique
    function uniqueUsername(bytes15 _userName) public view returns(bool isUnique) {
        return (allUserNames[_userName] == 0);
    }
    // Create User
    function createUser(bytes15 _userName) public{
        if(uniqueUsername(_userName)){
        UserAddrsMap[msg.sender] = User(msg.sender, _userName);
        userNameMap[_userName] = User(msg.sender, _userName);
        allUserAddrs.push(msg.sender);
        allUserNames.push(_userName);
        }
    }
   // Get Repo Img
    function getRepoImg(bytes15 _projectSlug) public view returns(bytes memory) {
        return repos[_projectSlug].repoHash;
    }
    // Get User function
    function getUser() public view returns(bytes15) {
        return users[msg.sender].userName;
    }
    // Get All Users
    function getAllUser() public view returns(address[] memory) {
        return allUsers;
    }
}