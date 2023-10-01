import { ethers } from "ethers";
import { Globals } from "../App";
import PageHeading from "./PageHeading";
import ProjectBox2 from "./ProjectBox2";
import useProjects from "../hooks/useProjects";
import UserDetailsSection from "./UserDetailsSection";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";

export default function UserProfile({ setLoading }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const globals = useContext(Globals);
  const { getMyProjects } = useProjects(setLoading);

  const [userData, setUserData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [totalCollected, setTotalCollected] = useState(0);

  async function getUserProfile(userAddress) {
    const amountDonated =
      await globals.rpcFundraiserContract.getUserDonatedAmount(userAddress);
    const userDetails = await globals.rpcFundraiserContract.getUserDetails(
      userAddress
    );

    return { ...userDetails, amountDonated: ethers.formatEther(amountDonated) };
  }

  useEffect(() => {
    setLoading(true); // true
    getUserProfile(id)
      .then((user) => {
        getMyProjects(id)
          .then((projects) => {
            setProjectsData(projects.data);
            setTotalCollected(projects.totalCollected);
            setUserData(user);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => {
        setLoading(false);
        navigate("/error");
      });
  }, []);

  return (
    <>
      <PageHeading
        exploreBtn={true}
        addNewBtn={true}
        title={"View User Details"}
      />

      <div className="author-page">
        <div className="container">
          <div id="set-user-details" className="row">
            {userData ? (
              <>
                <UserDetailsSection
                  userData={userData}
                  totalCollected={totalCollected}
                />

                <div className="col-lg-12">
                  <div className="section-heading">
                    <div className="line-dec"></div>
                    <h2>
                      {userData[1]}’s <em>Projects</em>
                    </h2>
                  </div>
                </div>
                {projectsData.length > 0 ? (
                  projectsData.map((data) => {
                    return (
                      <ProjectBox2
                        key={data.id}
                        id={data.id}
                        authorImage={data.owner[5]}
                        coverImage={data.image}
                        title={data.title}
                        collected={data.receivedAmount}
                        totalAmount={data.totalAmount}
                        endTime={
                          <>
                            {data.time.month} {data.time.day}, {data.time.year}
                          </>
                        }
                      />
                    );
                  })
                ) : (
                  <h2 className="text-center mt-5">
                    Start your First Fundraiser Now!
                  </h2>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
