// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Project
 * @dev This contract represents a fundraising project where users can donate funds.
 */
contract Project is Ownable {
    // ==================== STRUCTURE ==================== //

    address public immutable fundraiserOwner;
    string public title;
    string public description;
    string public headImg;
    uint256 public totalAmount; // amount to be raised
    uint256 public receivedAmount = 0;
    string public category;
    uint256 public startTime;
    uint256 public endTime;

    struct donorDetails {
        uint256 amountDonated;
        uint256 date;
    }
    mapping(address => donorDetails) public donors;
    address[] public donorAddresses;

    enum Statuses {
        Active,
        Completed,
        Withdrawn,
        Deleted
    }
    Statuses public currentStatus;

    // ==================== EVENTS ==================== //

    event Donate(address donor, uint256 amount);
    event Withdraw(uint256 amount);
    event Delete(address project);

    // ==================== MODIFIERS ==================== //

    modifier isNotOwner() {
        require(msg.sender != owner(), "Project owner!");
        _;
    }

    modifier isActive() {
        require(currentStatus == Statuses.Active, "Not active!");
        _;
    }

    modifier isCompleted() {
        require(
            block.timestamp >= endTime || currentStatus == Statuses.Completed,
            "Not completed yet!"
        );
        _;
    }

    modifier isNotCompleted() {
        require(
            block.timestamp < endTime && currentStatus != Statuses.Completed,
            "Completed!"
        );
        _;
    }

    modifier hasNotWithdrawn() {
        require(currentStatus != Statuses.Withdrawn, "Already withdrawn!");
        _;
    }

    modifier hasNotDeleted() {
        require(currentStatus != Statuses.Deleted, "Already deleted!");
        _;
    }

    modifier hasAmount() {
        require(address(this).balance > 0, "No amount!");
        _;
    }

    // ==================== CONSTRUCTOR ==================== //

    constructor(
        address _fundraiserOwner,
        address _projectOwner,
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _projectDuration,
        uint256 _totalAmount,
        string memory _headImg
    ) {
        fundraiserOwner = _fundraiserOwner;
        transferOwnership(_projectOwner);
        title = _title;
        description = _description;
        category = _category;
        startTime = block.timestamp;
        endTime = block.timestamp + _projectDuration;
        headImg = _headImg;
        totalAmount = _totalAmount;
        currentStatus = Statuses.Active;
    }

    // ==================== FUNCTIONS ==================== //

    /**
     * @dev Get the current status of the project.
     * @return The current status as a string ("active," "completed," "withdrawn," or "deleted").
     */
    function getCurrentStatus() public view returns (string memory) {
        if (currentStatus == Statuses.Completed) return "completed";
        else if (currentStatus == Statuses.Withdrawn) return "withdrawn";
        else if (currentStatus == Statuses.Deleted) return "deleted";
        else return "active";
    }

    /**
     * @dev Get the details of a donor.
     * @param _donor The address of the donor.
     * @return The donor's details.
     */
    function getDonorDetails(
        address _donor
    ) external view returns (donorDetails memory) {
        return donors[_donor];
    }

    /**
     * @dev Get the amount donated by a user.
     * @param _user The address of the user.
     * @return The amount donated by the user.
     */
    function getUserDonatedAmount(
        address _user
    ) external view returns (uint256) {
        return donors[_user].amountDonated;
    }

    /**
     * @dev Get the details of the project.
     * @return The project owner's address, donor addresses, end time, title, description, header image URL,
     * total amount, received amount, category, and current status.
     */
    function getProjectDetails()
        external
        view
        returns (
            address,
            address[] memory,
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            string memory,
            string memory
        )
    {
        return (
            owner(), // projectOwner
            donorAddresses,
            endTime,
            title,
            description,
            headImg,
            totalAmount,
            receivedAmount,
            category,
            getCurrentStatus()
        );
    }

    /**
     * @dev Allow users to donate to the project.
     */
    function donate() external payable isNotOwner isActive isNotCompleted {
        address user = msg.sender;
        uint256 amount = msg.value;
        uint256 remainingAmount = totalAmount - receivedAmount;

        uint256 moneyToReturn;
        if (amount > remainingAmount) {
            moneyToReturn = amount - remainingAmount;
            amount = remainingAmount;
        }
        receivedAmount += amount;

        if (donors[user].amountDonated == 0) {
            donors[user].amountDonated = amount;
            donorAddresses.push(user);
        } else donors[user].amountDonated += amount;

        donors[user].date = block.timestamp;

        if (moneyToReturn > 0) {
            (bool sent, ) = payable(user).call{value: moneyToReturn}("");
            require(sent, "Failed to send Ether");
        }
        if (receivedAmount >= totalAmount) currentStatus = Statuses.Completed;

        emit Donate(user, amount);
    }

    /**
     * @dev Allow the owner or fundraiser owner to withdraw funds from the project.
     */
    function withdraw()
        external
        hasNotWithdrawn
        hasNotDeleted
        isCompleted
        hasAmount
    {
        require(msg.sender == owner() || msg.sender == fundraiserOwner);

        uint256 ownerAmount;
        uint256 commission;
        uint256 amount = address(this).balance;

        // < 50% : 20% , < 90% : 10% , < 100% : 5% , == 100% : 2%
        if (amount < ((totalAmount * 50) / 100))
            commission = (amount * 20) / 100;
        else if (amount < ((totalAmount * 90) / 100))
            commission = (amount * 10) / 100;
        else if (amount < totalAmount) commission = (amount * 5) / 100;
        else commission = (amount * 2) / 100;

        ownerAmount = amount - commission;

        (bool sent1, ) = payable(owner()).call{value: ownerAmount}("");
        require(sent1, "Failed to send Ether to owner");
        (bool sent2, ) = payable(fundraiserOwner).call{value: commission}("");
        require(sent2, "Failed to send Ether to fundraiserOwner");

        currentStatus = Statuses.Withdrawn;
        emit Withdraw(amount);
    }

    /**
     * @dev Delete the project and refund donors.
     */
    function deleteProject() external onlyOwner isActive isNotCompleted {
        for (uint256 i = 0; i < donorAddresses.length; i++) {
            address addr = donorAddresses[i];

            (bool sent, ) = payable(addr).call{
                value: donors[addr].amountDonated
            }("");
            require(sent, "Failed to send Ether");

            delete donors[addr];
        }
        currentStatus = Statuses.Deleted;

        emit Delete(address(this));
    }
}
