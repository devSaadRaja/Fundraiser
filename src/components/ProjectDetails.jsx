import { Globals } from "../App";
import PageHeading from "./PageHeading";
import DonorsSection from "./DonorsSection";
import useProjects from "../hooks/useProjects";
import { useParams, useNavigate } from "react-router-dom";
import ProjectDetailsSection from "./ProjectDetailsSection";
import React, { useState, useEffect, useContext } from "react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const globals = useContext(Globals);
  const { getProject } = useProjects(globals.setLoading);

  const [project, setProject] = useState(null);

  useEffect(() => {
    globals.setLoading(true); // true
    getProject(id)
      .then((data) => setProject(data))
      .catch(() => {
        globals.setLoading(false);
        navigate("/error");
      });
  }, []);

  return (
    <>
      <PageHeading
        exploreBtn={true}
        addNewBtn={true}
        title={"View Project Details"}
      />

      <div className="item-details-page">
        <div className="container">
          <div id="selected-project-details" className="row">
            {project ? (
              <>
                <div className="col-lg-12">
                  <div className="section-heading">
                    <div className="line-dec"></div>
                    <h2>
                      View Details <em>For Project</em> Here.
                    </h2>
                  </div>
                </div>
                <ProjectDetailsSection projectAddress={id} data={project} />
                <DonorsSection
                  projectAddress={id}
                  donorAddresses={project.donorAddresses}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
