import React from "react";
import { NavLink } from "react-router-dom";

export default function ProjectBox2(props) {
  const detailsLink = `/project/${props.id}`;

  const coverImageStyle = { borderRadius: "20px" };
  const authorImageStyle = {
    maxWidth: "50px",
    maxHeight: "50px",
    borderRadius: "50%",
  };

  return (
    <>
      <div className="col-lg-3 col-md-6">
        <div className="item">
          <div className="row">
            <div className="col-lg-12">
              <span className="author">
                <img
                  src={props.authorImage}
                  alt="author"
                  style={authorImageStyle}
                />
              </span>
              <img src={props.coverImage} alt="item" style={coverImageStyle} />
              <h4 style={{ color: "#fff" }}>{props.title}</h4>
            </div>
            <div className="col-lg-12">
              <div className="line-dec"></div>
              <div className="row">
                <div className="col-7">
                  <span>
                    Collected: <br />
                    <strong>
                      {props.collected} / {props.totalAmount} ETH
                    </strong>
                  </span>
                </div>
                <div className="col-5">
                  <span>
                    Ends on: <br /> <strong>{props.endTime}</strong>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="main-button">
                <NavLink to={detailsLink}>View Details</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
