import React from "react";
import PageHeading from "./PageHeading";

export default function Error404() {
  return (
    <PageHeading
      exploreBtn={false}
      addNewBtn={false}
      title={"Oopsss, Page not found!"}
    />
  );
}
