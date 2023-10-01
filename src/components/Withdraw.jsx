import { ethers } from "ethers";
import { Globals } from "../App";
import { toast } from "react-toastify";
import React, { useContext } from "react";
import ProjectContractABI from "../abis/Project.json";

export default function Withdraw({ projectAddress }) {
  const globals = useContext(Globals);

  async function withdraw() {
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

      if (new Date() >= endTime || currentStatus === "completed") {
        const received = await projectContract.receivedAmount();
        if (ethers.formatEther(received) > 0) {
          const withdrawn = await projectContract.withdraw({
            gasLimit: "5000000",
          });
          await withdrawn.wait();
        } else
          toast.error("NO DONATION!", {
            pauseOnHover: false,
            theme: "colored",
          });
      } else {
        toast.error("NOT COMPLETED!", {
          pauseOnHover: false,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
        pauseOnHover: false,
        theme: "colored",
      });
    }
  }

  return (
    <div className="btn btn-primary" onClick={withdraw}>
      Withdraw
    </div>
  );
}
