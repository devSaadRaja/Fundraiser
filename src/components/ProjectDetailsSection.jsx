import { Globals } from "../App";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import ProjectStatus from "./ProjectStatus";
import TextareaAutosize from "react-textarea-autosize";
import React, { useState, useEffect, useContext } from "react";

export default function ProjectDetailsSection({ projectAddress, data }) {
  const globals = useContext(Globals);

  const [isOwner, setIsOwner] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const textAreaStyle = {
    color: "white",
    width: "100%",
    margin: "25px 0",
    border: "none",
    backgroundColor: "transparent",
  };

  async function getSignedAddress() {
    const signer = await globals.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  useEffect(() => {
    getSignedAddress()
      .then((address) => setIsOwner(data.owner.ownerID === address))
      .catch((err) =>
        toast.error(err.message, { pauseOnHover: false, theme: "colored" })
      );
  }, []);

  return (
    <>
      <div className="col-lg-7">
        <div className="left-image">
          <img src={data.image} alt="" style={{ borderRadius: "20px" }} />
        </div>
      </div>
      <div className="col-lg-5 align-self-center">
        <span className="author">
          {/* { maxWidth: '50px', borderRadius: '50%' } */}
          <img
            src={data.owner[5]}
            alt=""
            style={{ width: "100px", borderRadius: "50%" }}
          />
          <h6>
            {data.owner[1]}
            <br />
            <p style={{ color: "#00A671" }}>
              @
              <NavLink to={`/user/${data.owner.ownerID}`}>
                {data.owner[2]}
              </NavLink>
            </p>
          </h6>
        </span>
        <h4>{data.title}</h4>
        <TextareaAutosize
          style={textAreaStyle}
          value={data.description}
          readOnly
        />
        <p style={{ margin: "10px 0" }}>
          Category: <b>{data.category}</b>
        </p>
        <div className="row">
          <div className="col-4">
            <span className="bid">
              Collected
              <br />
              <strong>
                {data.receivedAmount} / {data.totalAmount} ETH
              </strong>
              <br />
              <em></em>
            </span>
          </div>
          {withdrawn || deleted || completed ? null : (
            <div className="col-5">
              <span className="ends">
                Ends In
                <br />
                <strong>
                  {data.time.days}D {data.time.hours}H {data.time.minutes}M{" "}
                  {data.time.seconds}S
                </strong>
                <br />
                <em></em>
              </span>
            </div>
          )}
        </div>

        <ProjectStatus
          projectAddress={projectAddress}
          isOwner={isOwner}
          withdrawn={withdrawn}
          deleted={deleted}
          completed={completed}
          setWithdrawn={setWithdrawn}
          setDeleted={setDeleted}
          setCompleted={setCompleted}
        />
      </div>
    </>
  );
}
