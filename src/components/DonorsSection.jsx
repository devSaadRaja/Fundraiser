import { ethers } from "ethers";
import { Globals } from "../App";
import DonorDetailsBox from "./DonorDetailsBox";
import ProjectContractABI from "../abis/Project.json";
import React, { useState, useEffect, useContext } from "react";

export default function DonorsSection({ projectAddress, donorAddresses }) {
  const globals = useContext(Globals);

  const [donorsData, setDonorsData] = useState([]);

  async function getDonorsDetails(projectAddress, donorAddresses) {
    let data = [];
    for (let i = 0; i < donorAddresses.length; i++) {
      const rpcProjectContract = new ethers.Contract(
        projectAddress,
        ProjectContractABI,
        globals.rpcProvider
      );
      const donationDetails = await rpcProjectContract.getDonorDetails(
        donorAddresses[i]
      );
      const userDetails = await globals.rpcFundraiserContract.getUserDetails(
        donorAddresses[i]
      );

      const date = new Date(Number(donationDetails.date) * 1000);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      data.push({
        amountDonated: ethers.formatEther(donationDetails.amountDonated),
        date: { day, month, year, hours, minutes, seconds },
        userDetails,
      });
    }

    return data;
  }

  useEffect(() => {
    getDonorsDetails(projectAddress, donorAddresses)
      .then((data) => {
        setDonorsData(data);
        globals.setLoading(false);
      })
      .catch(() => globals.setLoading(false));
  });

  return (
    <>
      <div className="col-lg-12">
        <div className="current-bid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mini-heading">
                <h4>Donors</h4>
              </div>
            </div>
            {donorsData.length > 0 ? (
              donorsData.map((d, index) => {
                return (
                  <DonorDetailsBox
                    key={index}
                    userID={donorAddresses[index]}
                    donorImg={d.userDetails.img}
                    authorName={d.userDetails.name}
                    authorUserHandle={d.userDetails.userhandle}
                    donatedAmount={d.amountDonated}
                    donatedTime={
                      <>
                        {d.date.day}/{d.date.month}/{d.date.year},{" "}
                        {d.date.hours}:{d.date.minutes}
                      </>
                    }
                  />
                );
              })
            ) : (
              <h2 className="text-center mt-5">No one donated!</h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
