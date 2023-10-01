import Delete from "./Delete";
import { ethers } from "ethers";
import { Globals } from "../App";
import Withdraw from "./Withdraw";
import DonateForm from "./DonateForm";
import React, { useContext, useEffect } from "react";
import ProjectContractABI from "../abis/Project.json";

export default function ProjectStatus({ projectAddress, isOwner, ...props }) {
  const globals = useContext(Globals);

  const btnSectionsStyle = {
    marginTop: "50px",
    display: "flex",
    justifyContent: "space-between",
  };

  async function getCurrentStatus() {
    const projectContract = new ethers.Contract(
      projectAddress,
      ProjectContractABI,
      globals.rpcProvider
    );
    const currentStatus = await projectContract.getCurrentStatus();

    return currentStatus;
  }

  useEffect(() => {
    getCurrentStatus().then((status) => {
      if (status === "withdrawn") props.setWithdrawn(true);
      else if (status === "deleted") props.setDeleted(true);
      else if (status === "completed") props.setCompleted(true);
    });
  }, []);

  return (
    <>
      {props.withdrawn && <h3 className="mt-5">"WITHDRAWN"</h3>}
      {props.deleted && <h3 className="mt-5">"DELETED"</h3>}
      {props.completed && <h3 className="mt-5">"COMPLETED"</h3>}

      {isOwner ? (
        <div style={btnSectionsStyle}>
          {!props.withdrawn && !props.deleted && (
            <Withdraw projectAddress={projectAddress} />
          )}
          {!props.withdrawn && !props.deleted && !props.completed && (
            <Delete projectAddress={projectAddress} />
          )}
        </div>
      ) : (
        !props.withdrawn &&
        !props.deleted &&
        !props.completed && <DonateForm projectAddress={projectAddress} />
      )}
    </>
  );
}
