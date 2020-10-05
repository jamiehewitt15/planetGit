// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

contract UserContract {
    
    struct User {
        address _address;
        string userName;
        string imgHash;
        bool exists;
    }

    // mapping address to User 
    mapping (address => User) UserAddrsMap;
    // mapping username to User 
    mapping (string => User) userNameMap;
    
    address[] public allUserAddrs;
    // mapping address to User 
    
    string[] public allUserNames;
    
    
    // Check Username is unique
    function uniqueUsername(string memory _userName) public view returns(bool isUnique) {
        if(userNameMap[_userName].exists != true){
            return true;
        } else{
            return false;
        }
    }
    // Create User with Img
    function createUser(string memory _userName, string memory _imgHash) public{
        if(uniqueUsername(_userName)){
        UserAddrsMap[msg.sender] = User(msg.sender, _userName, _imgHash, true);
        userNameMap[_userName] = User(msg.sender, _userName, _imgHash, true);
        allUserAddrs.push(msg.sender);
        allUserNames.push(_userName);
        }
    }
    // Get Username with Address function
    function getUserName() public view returns(string memory) {
        return UserAddrsMap[msg.sender].userName;
    }
    // Get User Img with Address function
    function getUserImg() public view returns(string memory) {
        return UserAddrsMap[msg.sender].imgHash;
    }
    // Get All Users
    function getAllUsers() public view returns(string[] memory) {
        return allUserNames;
    }
}