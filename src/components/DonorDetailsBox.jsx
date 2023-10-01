import React from "react";
import { NavLink } from "react-router-dom";

export default function DonorDetailsBox(props) {
  const userLink = `/user/${props.userID}`;

  return (
    <>
      <div className="col-lg-4 col-md-6">
        <div className="item">
          <div className="left-img">
            <img src={props.donorImg} alt="donor" />
          </div>
          <div className="right-content">
            <h4>{props.authorName}</h4>
            <p style={{ color: "#00A671" }}>
              @<NavLink to={userLink}>{props.authorUserHandle}</NavLink>
            </p>
            <div className="line-dec"></div>
            <h6>
              <em>{props.donatedAmount} ETH</em>
            </h6>
            <span className="date">{props.donatedTime}</span>
          </div>
        </div>
      </div>
    </>
  );
}
