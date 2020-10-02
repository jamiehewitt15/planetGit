pragma solidity >=0.7.0;

contract User {
    
    struct User {
        address _address;
        bytes15 userName;
        bytes imgHash;
        bool valid;
    }

    // mapping address to User 
    mapping (address => User) UserAddrsMap;
    address[] public allUserAddrs;
    // mapping address to User 
    mapping (bytes15 => User) userNameMap;
    bytes15[] public allUserNames;
    
    
    // Check Username is unique
    function uniqueUsername(bytes15 _userName) public view returns(bool isUnique) {
        return (userNameMap[_userName].valid != true);
    }
    // Create User
    function createUser(bytes15 _userName, bytes memory _imgHash) public{
        if(uniqueUsername(_userName)){
        UserAddrsMap[msg.sender] = User(msg.sender, _userName, _imgHash, true);
        userNameMap[_userName] = User(msg.sender, _userName, _imgHash, true);
        allUserAddrs.push(msg.sender);
        allUserNames.push(_userName);
        }
    }
    // Get Username with Address function
    function getUserName() public view returns(bytes15) {
        return UserAddrsMap[msg.sender].userName;
    }
    // Get User Img with Address function
    function getUserImg() public view returns(bytes15) {
        return UserAddrsMap[msg.sender].userName;
    }
    // Get All Users
    function getAllUser() public view returns(bytes15[] memory) {
        return allUserNames;
    }
}