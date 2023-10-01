import { ethers } from "ethers";
import { Globals } from "../App";
import { toast } from "react-toastify";
import React, { useContext } from "react";
import ProjectContractABI from "../abis/Project.json";

export default function Delete({ projectAddress }) {
  const globals = useContext(Globals);

  async function delete_() {
    try {
      const signer = await globals.getSigner();
      const projectContract = new ethers.Contract(
        projectAddress,
        ProjectContractABI,
        signer
      );

      const currentStatus = await projectContract.getCurrentStatus();
      const endTimeInSec = await projectContract.endTime();
      const endTime = new Date(endTimeInSec.toNumber() * 1000);

      if (new Date() < endTime && currentStatus != "completed") {
        const deleted = await projectContract.deleteProject({
          gasLimit: "5000000",
        });
        await deleted.wait();
      } else
        toast.success("ALREADY COMPLETED!", {
          pauseOnHover: false,
          theme: "colored",
        });
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
        pauseOnHover: false,
        theme: "colored",
      });
    }
  }

  return (
    <div className="btn btn-danger" onClick={delete_}>
      Delete
    </div>
  );
}
