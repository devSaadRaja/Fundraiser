import SetFile from "./SetFile";
import { ethers } from "ethers";
import { Globals } from "../App";
import config from "../config.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ContractABI from "../abis/Fundraiser.json";
import React, { useContext, useState } from "react";

export default function UserForm() {
  const navigate = useNavigate();
  const globals = useContext(Globals);

  const [formInputs, setFormInputs] = useState({
    name: "",
    userhandle: "",
    email: "",
    bio: "",
    file: null,
  });

  async function addNewUser() {
    const { name, userhandle, email, bio, file } = formInputs;
    const signer = await globals.getSigner();
    const address = await signer.getAddress();
    const signedIn = await globals.rpcFundraiserContract.userExists(address);

    if (signedIn) navigate(`/user/${address}`);
    setFormInputs({ name: "", userhandle: "", email: "", bio: "", file: null });

    const filePath = await globals.client.add(file);
    const fileIPFSLink = `${globals.infuraLink}${filePath.path}`;
    await addUser(signer, name, userhandle, email, bio, fileIPFSLink); // fileIPFSLink

    navigate(`/user/${address}`);
  }

  async function addUser(signer, name, userhandle, email, bio, image) {
    try {
      const contract = new ethers.Contract(
        config.fundraiser.address,
        ContractABI,
        signer
      );
      const user = await contract.addUser(name, userhandle, email, bio, image, {
        gasLimit: 5000000,
      });
      await user.wait();
    } catch (err) {
      toast.error(err.message, { pauseOnHover: false, theme: "colored" });
    }
  }

  function onSubmitFunc(e) {
    e.preventDefault();
    if (!formInputs.file)
      toast.error("Add an Image!", { pauseOnHover: false, theme: "colored" });
    else {
      addNewUser().catch((err) =>
        toast.error(err.message, { pauseOnHover: false, theme: "colored" })
      );
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
      <form onSubmit={onSubmitFunc} id="user-details">
        <div className="row">
          <div className="col-lg-4">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formInputs.name}
              maxLength="50"
              placeholder="Ex. Ed Sheeran"
              onChange={setFormVals}
              required
            />
          </div>
          <div className="col-lg-4">
            <label>Username</label>
            <input
              type="text"
              name="userhandle"
              value={formInputs.userhandle}
              maxLength="20"
              placeholder="@"
              onChange={setFormVals}
              required
            />
          </div>
          <div className="col-lg-4">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formInputs.email}
              maxLength="50"
              placeholder="help@fundraiser.com"
              onChange={setFormVals}
              required
            />
          </div>
          <div className="col-lg-9">
            <label>Bio</label>
            <br />
            <textarea
              name="bio"
              rows="10"
              value={formInputs.bio}
              maxLength="1500"
              placeholder="Tell us something about yourself..."
              onChange={setFormVals}
              required
            />
          </div>
          <SetFile setFormInputs={setFormInputs} />
          <div className="col-lg-12">
            <button>Register</button>
          </div>
        </div>
      </form>
    </>
  );
}
