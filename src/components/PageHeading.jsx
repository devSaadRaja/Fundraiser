import React from "react";
import { NavLink } from "react-router-dom";

export default function PageHeading(props) {
  return (
    <>
      <div className="page-heading">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h6>Fundraiser</h6>
              <h2>{props.title}</h2>
              {props.exploreBtn || props.addNewBtn ? <p>or</p> : null}
              <div className="buttons">
                {props.exploreBtn ? (
                  <div className="main-button">
                    <NavLink to="/explore">Explore Other Projects</NavLink>
                  </div>
                ) : null}
                {props.addNewBtn ? (
                  <div className="main-button">
                    <NavLink to="/add-project">Start Fundraising</NavLink>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
