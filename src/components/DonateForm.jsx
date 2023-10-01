import { ethers } from "ethers";
import { Globals } from "../App";
import { toast } from "react-toastify";
import React, { useState, useContext } from "react";
import ProjectContractABI from "../abis/Project.json";

export default function DonateForm({ projectAddress }) {
  const globals = useContext(Globals);

  const [donation, setDonation] = useState("0.05");

  function donateNow(e) {
    e.preventDefault();
    donate(projectAddress, donation);
  }

  function errorMessage(msg, pos) {
    toast.error(msg, {
      position: pos,
      pauseOnHover: false,
      theme: "colored",
    });
  }

  async function donate(projectAddress, amountDonated) {
    try {
      const signer = await globals.getSigner();
      const walletAddress = await signer.getAddress();

      const projectContract = new ethers.Contract(
        projectAddress,
        ProjectContractABI,
        signer
      );
      const projectOwner = await projectContract.owner();

      const userExists = await globals.rpcFundraiserContract.userExists(
        walletAddress
      );
      if (!userExists) errorMessage("SIGN UP FIRST!", "top-center");
      else if (walletAddress === projectOwner)
        errorMessage("You cannot donate to your own Fundraiser!", "top-right");
      else {
        const donated = await projectContract.donate({
          value: ethers.parseEther(amountDonated),
          gasLimit: "5000000",
        });

        await donated.wait();

        // // Listening to events
        // projectContract.on("Donate", (message, amount, event) => {
        //     const info = { message, amount: ethers.formatEther(amount), data: event };
        //     errorMessage(JSON.stringify(info, null, 4), "top-right");
        // });
      }
    } catch (err) {
      errorMessage(`${err.message} --- from donate`, "top-center");
    }
  }

  return (
    <>
      <form onSubmit={donateNow}>
        <label htmlFor="quantity-text">Amount ( ETH ):</label>
        <input
          type="number"
          step="0.01"
          pattern="^\d+(?:\.\d{1,2})?$"
          placeholder="0.05"
          className="quantity-text"
          min="0.05"
          value={donation}
          onChange={(e) => setDonation(e.target.value)}
          required
        />
        <button type="submit" className="mt-3">
          Donate Now
        </button>
      </form>
    </>
  );
}
