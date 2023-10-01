import Loading from "react-fullscreen-loading";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import React, { createContext, useState } from "react";

import "./css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { ethers } from "ethers";
import { Buffer } from "buffer";
import config from "./config.json";
import ContractABI from "./abis/Fundraiser.json";
import { create as ipfsHttpClient } from "ipfs-http-client";

import Home from "./components/Home";
import Sepolia from "./components/Sepolia";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import Footer from "./components/Footer";
import Explore from "./components/Explore";
import Error404 from "./components/Error404";
import AddProject from "./components/AddProject";
import UserProfile from "./components/UserProfile";
import ProjectDetails from "./components/ProjectDetails";

import useProjects from "./hooks/useProjects";

const Globals = createContext();

function App() {
  const [loading, setLoading] = useState(true); // true
  const { projectsData } = useProjects(setLoading);

  const rpcProvider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.REACT_APP_QUICKNODE_ID}`
  );
  const rpcFundraiserContract = new ethers.Contract(
    config.fundraiser.address,
    ContractABI,
    rpcProvider
  );
  const infuraLink = "https://fundraisinggg.infura-ipfs.io/ipfs/";

  async function getSigner() {
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  }

  const pid = `${process.env.REACT_APP_IPFS_PROJECT_ID}:${process.env.REACT_APP_IPFS_PROJECT_SECRET}`;
  const auth = "Basic " + Buffer.from(pid).toString("base64");
  const client = ipfsHttpClient({
    host: "ipfs.infura.io",
    port: process.env.REACT_APP_IPFS_HTTP_CLIENT_PORT,
    protocol: "https",
    headers: { authorization: auth },
  });

  const globals = {
    client: client,
    infuraLink: infuraLink,
    rpcProvider: rpcProvider,
    rpcFundraiserContract: rpcFundraiserContract,
    getSigner: getSigner,
    setLoading: setLoading,
  };

  return (
    <>
      <ToastContainer />

      <Loading loading={loading} background="#2a2a2a" loaderColor="#00A671" />

      <Sepolia />
      {loading ? null : <Navbar />}

      <Globals.Provider value={globals}>
        <Routes>
          <Route path="/" element={<Home projectsData={projectsData} />} />
          <Route
            path="/explore"
            element={
              <Explore setLoading={setLoading} projectsData={projectsData} />
            }
          />
          <Route path="/add-project" element={<AddProject />} />
          <Route
            path="/user/:id"
            element={<UserProfile setLoading={setLoading} />}
          />
          <Route path="/signin" element={<SignIn setLoading={setLoading} />} />
          <Route
            path="/project/:id"
            element={<ProjectDetails setLoading={setLoading} />}
          />
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </Globals.Provider>

      <Footer />
    </>
  );
}

export default App;
export { Globals };
