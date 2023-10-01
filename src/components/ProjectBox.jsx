import React from "react";
import { NavLink } from "react-router-dom";

export default function ProjectBox(props) {
  const authorImageStyle = { maxWidth: "50px", borderRadius: "50%" };
  const mainImageStyle = { minWidth: "195px", borderRadius: "20px" };

  const detailsLink = `/project/${props.id}`;

  return (
    <>
      <div className="col-lg-6 currently-market-item">
        <div className="item">
          <div className="left-image">
            <img src={props.coverImage} alt="item" style={mainImageStyle} />
          </div>
          <div className="right-content">
            <h4 style={{ color: "#fff" }}>{props.title}</h4>
            <span className="author">
              <img
                src={props.authorImage}
                alt="author"
                style={authorImageStyle}
              />
              <h6>
                {props.authorName}
                <br />
                <p style={{ color: "#00A671" }}>@{props.authorUserName}</p>
              </h6>
            </span>
            <div className="line-dec"></div>
            <span className="bid">
              Currently Collected
              <br />
              <strong>{props.collected} ETH</strong>
              <br />
              <em>-</em>
            </span>
            <span className="ends">
              Ends In
              <br />
              <strong>{props.endIn}</strong>
              <br />
              <em></em>
            </span>
            <div className="text-button">
              <NavLink to={detailsLink}>View Details</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
