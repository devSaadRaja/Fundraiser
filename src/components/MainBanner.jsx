import React from "react";
import AddProjectButton from "./AddProjectButton";

export default function MainBanner() {
  return (
    <>
      <div className="main-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center">
              <div className="header-text">
                <h6>Fundraiser</h6>
                <h2>Create, Donate & Build a Strong Community</h2>
                <p>
                  We provide the best strategy to collect funds. Start your next
                  fundraiser for your NGO or Startup and meet people who really
                  believe in your idea.
                </p>
                <AddProjectButton text="Get Started" addClass="main-button" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
