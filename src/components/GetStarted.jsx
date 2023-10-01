import React from "react";
import AddProjectButton from "./AddProjectButton";

export default function GetStarted() {
  return (
    <>
      <div className="get-started">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <div className="line-dec"></div>
                <h2>
                  Ready to<em> get started?</em> Join thousands of others today.
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <AddProjectButton
              text="Start Fundraising"
              addClass="main-button center-btn"
            />
          </div>
        </div>
      </div>
    </>
  );
}
