import React from "react";
import PageHeading from "./PageHeading";
import ProjectForm from "./ProjectForm";

export default function AddProject() {
  return (
    <>
      <PageHeading
        exploreBtn={true}
        addNewBtn={false}
        title={"Create Your Project Now"}
      />
      <div className="item-details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <div className="line-dec"></div>
                <h2>
                  Give your <em>Project details</em> Here.
                </h2>
              </div>
            </div>
            <div className="col-lg-12">
              <ProjectForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
