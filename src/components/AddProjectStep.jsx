import React from "react";

export default function AddProjectSteps(props) {
  const addClass = "item " + props.addItemClass;

  return (
    <>
      <div className="col-lg-4">
        <div className={addClass}>
          <div className="icon">
            <img src={props.icon} alt="" />
          </div>
          <h4>{props.heading}</h4>
          <p>{props.desc}</p>
        </div>
      </div>
    </>
  );
}
