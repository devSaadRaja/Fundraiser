import React from "react";
import icon1 from "../images/icon-01.png";
import icon4 from "../images/icon-04.png";
import icon6 from "../images/icon-06.png";
import AddProjectSteps from "./AddProjectStep";
import AddProjectButton from "./AddProjectButton";

export default function CreateDetails() {
  return (
    <>
      <div className="create-fundraiser">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="section-heading">
                <div className="line-dec"></div>
                <h2>Launch Your Fundraiser & Start Collecting Funds.</h2>
              </div>
            </div>
            <div className="col-lg-4">
              <AddProjectButton
                text="Create Your Fundraiser Now"
                addClass="main-button"
              />
            </div>
            <AddProjectSteps
              heading="Set Up Your Wallet"
              desc="Sign in using your Metamask wallet for creating new fundraisers or for donating to
                            others. All funds for created fundraisers would be sent in your signed wallet address."
              icon={icon6}
              addItemClass="first-item"
            />
            <AddProjectSteps
              heading="Create Fundraiser"
              desc="Give details about the business or reason you are going to raise funds for so that the donors
                            know that they are donating their money for a genuine cause."
              icon={icon1}
              addItemClass="first-item"
            />
            <AddProjectSteps
              heading="Build a Strong Community"
              desc="Donate and help eachother in their respective works and build a strong community of ideators,
                            doers, and their contributors."
              icon={icon4}
            />
          </div>
        </div>
      </div>
    </>
  );
}
