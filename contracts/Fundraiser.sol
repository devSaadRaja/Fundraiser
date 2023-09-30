// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Project.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    // ==================== STRUCTURE ==================== //

    struct User {
        bool exists;
        string name;
        string userhandle;
        string email;
        string bio;
        string img;
        Project[] myProjects;
    }

    address[] public userAddresses;
    mapping(address => User) public registeredUsers;

    Project[] public projects;

    // ==================== EVENTS ==================== //

    event AddUser(address userAddress);
    event AddProject(string title, uint256 totalAmount);

    // ==================== MODIFIERS ==================== //

    modifier isValidAddress(address _newOwner) {
        require(_newOwner != address(0), "New owner address is not valid!");
        _;
    }

    modifier userDoesNotExist(address _user) {
        require(!registeredUsers[_user].exists, "User already exists!");
        _;
    }

    // ==================== FUNCTIONS ==================== //

    function userExists(address _user) external view returns (bool) {
        return registeredUsers[_user].exists;
    }

    function getAllProjects() external view returns (Project[] memory) {
        return projects;
    }

    function getTotalProjectsCount() external view returns (uint256) {
        return projects.length;
    }

    function getAllUserAddresses() external view returns (address[] memory) {
        return userAddresses;
    }

    function getUserDetails(address _user) external view returns (User memory) {
        return registeredUsers[_user];
    }

    function getMinAmount() external view returns (uint256) {
        uint256 minAmount;
        if (projects.length > 0) minAmount = projects[0].receivedAmount();
        for (uint256 i = 1; i < projects.length; i++) {
            uint256 _amount = projects[i].receivedAmount();
            if (_amount > 0 && _amount < minAmount) minAmount = _amount;
        }

        return minAmount;
    }

    function getUserDonatedAmount(
        address _user
    ) external view returns (uint256) {
        uint256 donatedAmount;
        for (uint256 i = 0; i < projects.length; i++)
            donatedAmount += projects[i].getUserDonatedAmount(_user);

        return donatedAmount;
    }

    function getTotalDonatedAmount() external view returns (uint256) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < projects.length; i++)
            totalAmount += projects[i].receivedAmount();

        return totalAmount;
    }

    function addUser(
        string memory _name,
        string memory _userhandle,
        string memory _email,
        string memory _bio,
        string memory _img
    ) external userDoesNotExist(msg.sender) {
        userAddresses.push(msg.sender);
        registeredUsers[msg.sender] = User(
            true,
            _name,
            _userhandle,
            _email,
            _bio,
            _img,
            new Project[](0)
        );

        emit AddUser(msg.sender);
    }

    function addProject(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _projectDuration,
        uint256 _totalAmount,
        string memory _headImg
    ) external {
        Project project = new Project(
            owner(),
            msg.sender,
            _title,
            _description,
            _category,
            _projectDuration,
            _totalAmount,
            _headImg
        );
        registeredUsers[msg.sender].myProjects.push(project);
        projects.push(project);

        emit AddProject(_title, _totalAmount);
    }
}
