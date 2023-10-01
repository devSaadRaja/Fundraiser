import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FaRegHandPaper, FaHeart, FaDollarSign } from "react-icons/fa";

export default function UserDetailsSection({ userData, totalCollected }) {
  const textareaStyle = {
    color: "white",
    width: "100%",
    marginTop: "50px",
    border: "none",
    backgroundColor: "transparent",
  };

  return (
    <>
      <div className="col-lg-6">
        <div className="author">
          <img
            src={userData[5]}
            alt=""
            style={{ borderRadius: "50%", maxWidth: "170px" }}
          />
          <h4>
            {userData[1]} <br />{" "}
            <p style={{ color: "#00A671" }}>@{userData[2]}</p>
          </h4>
        </div>
        <TextareaAutosize style={textareaStyle} value={userData[4]} readOnly />
      </div>
      <div className="col-lg-6">
        <div className="right-info">
          <div className="row">
            <div className="col-4">
              <div className="info-item">
                <i>
                  <FaRegHandPaper />
                </i>
                <h6>
                  {userData[6].length}
                  <br />
                  <em>Projects</em>
                </h6>
              </div>
            </div>
            <div className="col-4">
              <div className="info-item">
                <i>
                  <FaDollarSign />
                </i>
                <h6>
                  {totalCollected} ETH <em>Collected</em>
                </h6>
              </div>
            </div>
            <div className="col-4">
              <div className="info-item">
                <i>
                  <FaHeart />
                </i>
                <h6>
                  {userData.amountDonated} ETH <em>Donated</em>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
