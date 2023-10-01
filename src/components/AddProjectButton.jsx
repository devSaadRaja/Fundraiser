import React from "react";
import { NavLink } from "react-router-dom";

export default function AddProjectButton(props) {
  return (
    <>
      <div className="buttons">
        <div className={props.addClass}>
          <NavLink to="/add-project">{props.text}</NavLink>
        </div>
      </div>
    </>
  );
}
