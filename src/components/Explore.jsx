import PageHeading from "./PageHeading";
import ProjectBox2 from "./ProjectBox2";
import FilterCategory from "./FilterCategory";
import React, { useState, useEffect } from "react";

export default function Explore({ setLoading, projectsData }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setLoading(true); // true
    setFilteredData(projectsData);
    setLoading(false);
  }, [projectsData]);

  return (
    <>
      <PageHeading
        exploreBtn={false}
        addNewBtn={false}
        title={"Discover Projects To Donate"}
      />
      <div className="discover-items">
        <div className="container">
          <div id="discover-projects" className="row">
            <div className="col-lg-6">
              <div className="section-heading">
                <div className="line-dec"></div>
                <h2>
                  Discover Some Of the <em>Projects</em>
                </h2>
              </div>
            </div>

            <FilterCategory
              setFilteredData={setFilteredData}
              projectsData={projectsData}
            />

            {filteredData.map((data) => {
              return (
                <ProjectBox2
                  key={data.id}
                  id={data.id}
                  authorImage={data.owner[5]}
                  coverImage={data.image}
                  title={data.title}
                  collected={data.receivedAmount}
                  totalAmount={data.totalAmount}
                  endTime={
                    <>
                      {data.time.month} {data.time.day}, {data.time.year}
                    </>
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
