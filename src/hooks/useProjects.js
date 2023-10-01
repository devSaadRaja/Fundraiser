import { ethers } from 'ethers';
import config from '../config.json';
import { useEffect, useState } from "react";
import ContractABI from '../abis/Fundraiser.json';
import * as dates from 'number-to-date-month-name';
import ProjectContractABI from '../abis/Project.json';

export default function useProjects(setLoading) {
  const [projectsData, setProjectsData] = useState([]);

  const rpcProvider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.REACT_APP_QUICKNODE_ID}`
  );
  const rpcFundraiserContract = new ethers.Contract(config.fundraiser.address, ContractABI, rpcProvider);

  function getParsedTime(endTime) {
    const eTime = new Date(Number(endTime) * 1000);

    const day = eTime.getDate();
    const month = dates.toMonth(eTime.getMonth() + 1, 's');
    const year = eTime.getFullYear();

    const endTimeInSeconds = new Date(Number(endTime));
    const currentTimeInSeconds = Math.round(new Date() / 1000);
    const remainingTime = endTimeInSeconds - currentTimeInSeconds;

    let days, hours, minutes, seconds;
    if (remainingTime < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
    else {
      days = Math.floor(remainingTime / (60 * 60 * 24));
      hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
      minutes = Math.floor((remainingTime % (60 * 60)) / 60);
      seconds = Math.floor(remainingTime % 60);
    }

    return { day, month, year, days, hours, minutes, seconds, remainingTime }
  }

  async function getProject(address) {
    const rpcProjectContract = new ethers.Contract(address, ProjectContractABI, rpcProvider);
    const data = await rpcProjectContract.getProjectDetails();
    const ownerDetails = await rpcFundraiserContract.getUserDetails(data[0]);
    const time = getParsedTime(data[2]);

    return {
      id: address,
      image: data[5],
      title: data[3],
      description: data[4],
      category: data[8],
      status: data[9],
      totalAmount: ethers.formatEther(data[6]),
      receivedAmount: ethers.formatEther(data[7]),
      owner: { ownerID: data[0], ...ownerDetails },
      donorAddresses: data[1],
      time: {
        day: time.day,
        month: time.month,
        year: time.year,
        days: time.days,
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
        remainingTimeInSecs: time.remainingTime
      }
    };
  }

  async function getAllProjects() {
    let projectDetails = [];
    const projects = await rpcFundraiserContract.getAllProjects();
    for (let i = 0; i < projects.length; i++) {
      const project = await getProject(projects[i]);
      // if (project.status === "active" && project.remainingTimeInSecs > 0)
      projectDetails.push(project);
    }

    return projectDetails;
  }

  async function getMyProjects(userID) {
    const projects = await getAllProjects();
    const data = projects.filter(proj => proj.owner.ownerID === userID);
    let sum = 0;
    data.forEach(collected => sum += collected.receivedAmount);

    return { data: data, totalCollected: sum };
  }

  useEffect(() => {
    setLoading(true);  // true
    getAllProjects()
      .then(data => {
        setProjectsData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { projectsData, getProject, getMyProjects };
}