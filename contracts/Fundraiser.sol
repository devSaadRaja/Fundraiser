// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Project.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Fundraiser
 * @dev This contract manages user registration and project creation.
 */
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

    /**
     * @dev Check if a user exists.
     * @param _user The address of the user.
     * @return true if the user exists, false otherwise.
     */
    function userExists(address _user) external view returns (bool) {
        return registeredUsers[_user].exists;
    }

    /**
     * @dev Get all projects.
     * @return An array of all projects.
     */
    function getAllProjects() external view returns (Project[] memory) {
        return projects;
    }

    /**
     * @dev Get the total number of projects.
     * @return The total number of projects.
     */
    function getTotalProjectsCount() external view returns (uint256) {
        return projects.length;
    }

    /**
     * @dev Get all user addresses.
     * @return An array of all user addresses.
     */
    function getAllUserAddresses() external view returns (address[] memory) {
        return userAddresses;
    }

    /**
     * @dev Get user details.
     * @param _user The address of the user.
     * @return The user's details.
     */
    function getUserDetails(address _user) external view returns (User memory) {
        return registeredUsers[_user];
    }

    /**
     * @dev Get the minimum donation amount across all projects.
     * @return The minimum donation amount.
     */
    function getMinAmount() external view returns (uint256) {
        uint256 minAmount;
        if (projects.length > 0) minAmount = projects[0].receivedAmount();
        for (uint256 i = 1; i < projects.length; i++) {
            uint256 _amount = projects[i].receivedAmount();
            if (_amount > 0 && _amount < minAmount) minAmount = _amount;
        }

        return minAmount;
    }

    /**
     * @dev Get the total amount donated by a user across all projects.
     * @param _user The address of the user.
     * @return The total amount donated by the user.
     */
    function getUserDonatedAmount(
        address _user
    ) external view returns (uint256) {
        uint256 donatedAmount;
        for (uint256 i = 0; i < projects.length; i++)
            donatedAmount += projects[i].getUserDonatedAmount(_user);

        return donatedAmount;
    }

    /**
     * @dev Get the total amount donated across all projects.
     * @return The total amount donated.
     */
    function getTotalDonatedAmount() external view returns (uint256) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < projects.length; i++)
            totalAmount += projects[i].receivedAmount();

        return totalAmount;
    }

    /**
     * @dev Add a new user.
     * @param _name The name of the user.
     * @param _userhandle The user's handle.
     * @param _email The email of the user.
     * @param _bio The user's bio.
     * @param _img The URL of the user's image.
     */
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

    /**
     * @dev Add a new fundraising project.
     * @param _title The title of the project.
     * @param _description The description of the project.
     * @param _category The category of the project.
     * @param _projectDuration The duration of the project in seconds.
     * @param _totalAmount The total amount to be raised.
     * @param _headImg The URL of the project's header image.
     */
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
