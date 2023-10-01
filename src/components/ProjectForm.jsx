import { ethers } from "ethers";
import SetFile from "./SetFile";
import { Globals } from "../App";
import config from "../config.json";
import { toast } from "react-toastify";
import ContractABI from "../abis/Fundraiser.json";
import React, { useContext, useState } from "react";

export default function ProjectForm() {
  const globals = useContext(Globals);

  function errorMessage(msg, pos) {
    toast.error(msg, { position: pos, pauseOnHover: false, theme: "colored" });
  }

  const initialInputs = {
    title: "",
    price: 0,
    datetime: "",
    description: "",
    file: null,
    category: "Others",
  };
  const [formInputs, setFormInputs] = useState(initialInputs);

  async function addNewProject({
    title,
    description,
    category,
    datetime,
    price,
    file,
  }) {
    const signer = await globals.getSigner();
    const walletAddress = await signer.getAddress();

    const filePath = await globals.client.add(file);
    const fileIPFSLink = `${globals.infuraLink}${filePath.path}`;

    const endTimeInSec = new Date(datetime) / 1000;
    const currentTimeInSec = Math.round(new Date() / 1000);
    const durationInSec = endTimeInSec - currentTimeInSec;

    const userExists = await globals.rpcFundraiserContract.userExists(
      walletAddress
    );
    if (!userExists) errorMessage("SIGN UP FIRST!", "top-center");
    else {
      const FundraiserContract = new ethers.Contract(
        config.fundraiser.address,
        ContractABI,
        signer
      );
      const addProject = await FundraiserContract.addProject(
        title,
        description,
        category,
        durationInSec,
        ethers.parseEther(price),
        fileIPFSLink, // fileIPFSLink
        { gasLimit: 5000000 }
      );
      await addProject.wait();
    }
  }

  function onSubmitFunc(e) {
    e.preventDefault();

    const endTimeInSec = new Date(formInputs.datetime) / 1000;
    const currentTimeInSec = Math.round(new Date() / 1000);
    const threeDaysInSeconds = 3 * 24 * 60 * 60;

    if (endTimeInSec < currentTimeInSec + threeDaysInSeconds)
      errorMessage(
        "EndTime should be at least 3 days in the future!",
        "top-right"
      );
    else if (!formInputs.file) errorMessage("Add an Image!", "top-right");
    else {
      addNewProject(formInputs)
        .then(() => setFormInputs(initialInputs))
        .catch((err) => errorMessage(err.message, "top-center"));
    }
  }

  function setFormVals(e) {
    const { name, value } = e.target;
    setFormInputs((preValue) => {
      return { ...preValue, [name]: value };
    });
  }

  return (
    <>
      <form onSubmit={onSubmitFunc} id="contact">
        <div className="row">
          <div className="col-lg-4">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={formInputs.title}
              maxLength="50"
              placeholder="Ex. Sweet Shop"
              onChange={setFormVals}
              required
            />
          </div>
          <div className="col-lg-4">
            <label>Total Amount ( ETH )</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formInputs.price} // min="1"
              pattern="^\d+(?:\.\d{1,2})?$"
              placeholder="0"
              onChange={setFormVals}
              required
            />
          </div>
          <div className="col-lg-4">
            <label>End Time</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formInputs.datetime}
              onChange={setFormVals}
              required
            />
          </div>
          <div className="col-lg-12">
            <label>Description</label>
            <textarea
              name="description"
              value={formInputs.description}
              maxLength="1500"
              rows="10"
              placeholder="Tell us something about your fundraiser..."
              onChange={setFormVals}
              required
            />
          </div>
          <SetFile setFormInputs={setFormInputs} />
          <div className="col-lg-4">
            <label>Category</label>
            <select
              className="form-select"
              name="category"
              value={formInputs.category}
              onChange={setFormVals}
            >
              <option value="Others">Others</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Music & Arts">Music & Arts</option>
            </select>
          </div>
          <div className="col-lg-5">
            <button type="submit">Submit Your Project</button>
          </div>
        </div>
      </form>
    </>
  );
}
