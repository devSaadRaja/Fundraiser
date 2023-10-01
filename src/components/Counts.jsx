import { ethers } from "ethers";
import { Globals } from "../App";
import React, { useState, useEffect, useContext } from "react";

export default function Counts() {
  const globals = useContext(Globals);

  const [projectsCount, setProjectsCount] = useState(0);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [minAmount, setMinAmount] = useState(0);

  async function getPojectsCount() {
    const totalProjectsCount =
      await globals.rpcFundraiserContract.getTotalProjectsCount();
    return Number(totalProjectsCount);
  }

  async function getDonatedAmount() {
    const totalDonatedAmount =
      await globals.rpcFundraiserContract.getTotalDonatedAmount();
    return ethers.formatEther(totalDonatedAmount);
  }

  async function getMinAmount() {
    const minAmount = await globals.rpcFundraiserContract.getMinAmount();
    return ethers.formatEther(minAmount);
  }

  useEffect(() => {
    getPojectsCount().then((val) => setProjectsCount(val));
    getDonatedAmount().then((val) => setDonatedAmount(val));
    getMinAmount().then((val) => setMinAmount(val));
  }, []);

  return (
    <>
      <section className="counter">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="count-item decoration-bottom">
                  <strong id="projects-count">{projectsCount}</strong>
                  <span>Projects</span>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="count-item decoration-top">
                  <strong id="donated-amount-count">{donatedAmount}</strong>
                  <span>ETH Raised</span>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="count-item">
                  <strong id="donors-count">{minAmount}</strong>
                  <span>ETH Minimum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
