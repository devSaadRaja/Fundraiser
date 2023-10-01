import React from "react";
import ProjectBox from "./ProjectBox";
import { NavLink } from "react-router-dom";

export default function Market({ projectsData }) {
  return (
    <>
      <div className="currently-market">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="section-heading">
                <div className="line-dec"></div>
                <h2>
                  Explore some active <em>Fundraisers</em>
                </h2>
              </div>
            </div>
            <div className="col-lg-12">
              <div id="home-page-projects" className="row grid">
                {projectsData.map((data) => {
                  return (
                    <ProjectBox
                      key={data.id}
                      id={data.id}
                      title={data.title}
                      coverImage={data.image}
                      collected={data.receivedAmount}
                      endIn={
                        <>
                          {data.time.days}D {data.time.hours}H{" "}
                          {data.time.minutes}M {data.time.seconds}S
                        </>
                      }
                      authorImage={data.owner[5]}
                      authorName={data.owner[1]}
                      authorUserName={data.owner[2]}
                    />
                  );
                })}
              </div>
            </div>
            <div className="text-center mt-5">
              <div className="col-lg-12">
                <div className="buttons">
                  <div className="main-button">
                    <NavLink to="/explore">Explore All Projects</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
