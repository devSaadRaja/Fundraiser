const { expect } = require("chai");
const { moveBlocks } = require("../utils/move-blocks");
const { passTime } = require("../utils/pass-time");

const parseEth = (eth) => ethers.parseEther(String(eth));
const formatEth = (wei) => Number(ethers.formatEther(String(wei)));

describe("Fundraiser Contract", function () {
  let donationAmount = parseEth(0.5); // 0.5 ETH
  let userParams = ["User 1", "user1", "user1@example.com", "Bio 1", "img1"];
  let projectParams = ["Project 1", "Description 1", "Category 1", 30, parseEth(10), "img1"];

  let deployer, user1, user2, fundraiser;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    fundraiser = await Fundraiser.deploy();
  });

  it("should allow users to add themselves", async function () {
    await fundraiser.connect(user1).addUser(...userParams);

    const user1Details = await fundraiser.getUserDetails(user1.address);
    expect(user1Details.exists).to.be.true;
    expect(user1Details.name).to.equal("User 1");
  });

  it("should allow users to create projects", async function () {
    await fundraiser.connect(user1).addProject(...projectParams);

    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);

    expect(projects.length).to.equal(1);
    expect(await projectContract.title()).to.equal("Project 1");
  });

  it("should allow users to donate to a project", async function () {
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();

    const projectContract = await ethers.getContractAt("Project", projects[0]);
    await projectContract.connect(user2).donate({ value: donationAmount });

    const totalDonatedAmount = await fundraiser.getTotalDonatedAmount();
    const user2DonatedAmount = await fundraiser.getUserDonatedAmount(user2.address);
    const projectReceivedAmount = await projectContract.receivedAmount();

    expect(totalDonatedAmount).to.equal(donationAmount);
    expect(user2DonatedAmount).to.equal(donationAmount);
    expect(projectReceivedAmount).to.equal(donationAmount);
  });

  it("should return the minimum received amount among all projects", async function () {
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();

    const projectContract = await ethers.getContractAt("Project", projects[0]);
    await projectContract.connect(user2).donate({ value: donationAmount });

    const minAmount = await fundraiser.getMinAmount();
    expect(minAmount).to.equal(parseEth(0.5));
  });

  it("should prevent users from adding themselves more than once", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await expect(fundraiser.connect(user1).addUser(...userParams))
      .to.be.revertedWith("User already exists!");
  });

  it("should return all user addresses", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    const userAddresses = await fundraiser.getAllUserAddresses();
    expect(userAddresses).to.have.lengthOf(1);
  });

  it("should return the correct user details", async function () {
    await fundraiser.connect(user1).addUser(...userParams);

    const user1Details = await fundraiser.getUserDetails(user1.address);
    expect(user1Details.exists).to.be.true;
    expect(user1Details.name).to.equal("User 1");

    const user2Details = await fundraiser.getUserDetails(user2.address);
    expect(user2Details.exists).to.be.false; // User 2 was not added
  });

  it("should return the correct total project count", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);

    const totalProjectsCount = await fundraiser.getTotalProjectsCount();
    expect(totalProjectsCount).to.equal(1); // Only one project was created
  });

  it("should return the correct total donated amount for a user", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);
    await projectContract.connect(user2).donate({ value: donationAmount });

    const user1DonatedAmount = await fundraiser.getUserDonatedAmount(user1.address);
    expect(user1DonatedAmount).to.equal(0); // User 1 did not donate to any project

    const user2DonatedAmount = await fundraiser.getUserDonatedAmount(user2.address);
    expect(user2DonatedAmount).to.equal(parseEth(0.5)); // User 2 donated 0.1 ETH
  });

  it("should set proper owners", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);

    expect(await fundraiser.owner()).to.equal(deployer.address);
    expect(await projectContract.owner()).to.equal(user1.address);
  });

  it("should initialize project details correctly", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);

    expect(await projectContract.title()).to.equal("Project 1");
    expect(await projectContract.description()).to.equal("Description 1");
    expect(await projectContract.category()).to.equal("Category 1");
    expect(await projectContract.totalAmount()).to.equal(parseEth(10));
    expect(await projectContract.getCurrentStatus()).to.equal("active");
  });

  it("should allow the project owner to withdraw funds", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);
    await projectContract.connect(user2).donate({ value: parseEth(5) });

    passTime(30);
    moveBlocks(1);

    await projectContract.connect(user1).withdraw();

    expect(await projectContract.getCurrentStatus()).to.equal("withdrawn");

    const fundraiserOwnerBalance = await ethers.provider.getBalance(deployer.address);
    const ownerBalance = await ethers.provider.getBalance(user1.address);

    // Verify the amounts after withdrawal (commission is 5% in this case)
    expect(ownerBalance).to.lte(parseEth(10004.5)); // 10 - 5% = 4.5
    expect(fundraiserOwnerBalance).to.lte(parseEth(10000.5)); // 5%
  });

  it("should prevent users from donating to a completed project", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);

    passTime(30);
    moveBlocks(1);

    await expect(projectContract.connect(user2).donate({ value: parseEth(0.1) }))
      .to.be.revertedWith("Completed!");
  });

  it("should prevent users from withdrawing funds twice", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);
    await projectContract.connect(user2).donate({ value: parseEth(5) });

    passTime(30);
    moveBlocks(1);

    await projectContract.connect(user1).withdraw();
    await expect(projectContract.withdraw())
      .to.be.revertedWith("Already withdrawn!");
  });

  it("should allow the project owner to delete the project", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);
    await projectContract.connect(user2).donate({ value: parseEth(0.5) });

    await projectContract.connect(user1).deleteProject();

    expect(await projectContract.getCurrentStatus()).to.equal("deleted");

    const user2DonatedAmount = await projectContract.getUserDonatedAmount(user2.address);
    expect(user2DonatedAmount).to.equal(0); // User's donation should be returned

    // Verify the user's balance after donation is returned
    const user2Balance = await ethers.provider.getBalance(user2.address);
    expect(user2Balance).to.lte(parseEth(10000)); // 0.5 ETH returned
  });

  it("should return extra amount to the donor if they donate more than totalAmount", async function () {
    await fundraiser.connect(user1).addUser(...userParams);
    await fundraiser.connect(user1).addProject(...projectParams);
    const projects = await fundraiser.getAllProjects();
    const projectContract = await ethers.getContractAt("Project", projects[0]);

    // Donate an amount greater than the totalAmount
    const accessAmount = 11;
    await projectContract.connect(user2).donate({ value: parseEth(accessAmount) });

    const user2DonatedAmount = await projectContract.getUserDonatedAmount(user2.address);
    expect(user2DonatedAmount).to.equal(await projectContract.totalAmount());

    // Calculate the expected returned amount (extra amount)
    const expectedReturnedAmount = accessAmount - formatEth(user2DonatedAmount);
    expect(expectedReturnedAmount).to.equal(1); // 11 ETH - 10 ETH = 1 ETH
  });
});