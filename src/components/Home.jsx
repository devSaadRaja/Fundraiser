import React from "react";
import Counts from "./Counts.jsx";
import Market from "./Market.jsx";
import MainBanner from "./MainBanner.jsx";
import GetStarted from "./GetStarted.jsx";
import CreateDetails from "./CreateDetails.jsx";

export default function Home({ projectsData }) {
  return (
    <>
      <MainBanner />
      <Counts />
      <CreateDetails />
      <Market projectsData={projectsData} />
      <div
        style={{ backgroundColor: "#00A671", width: "100%", height: "200px" }}
      ></div>
      <GetStarted />
    </>
  );
}
