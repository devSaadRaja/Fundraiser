import React from "react";
import logo from "../images/logo4.png";
import { NavLink } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

export default function Navbar() {
  const AddActiveClass = ({ isActive }) =>
    isActive ? "active_class" : "not_active";

  return (
    <>
      <header className="header-area">
        <div className="container">
          <div className="row">
            <nav className="main-nav">
              <NavLink className="logo" to="/">
                <img src={logo} alt="logo" />
              </NavLink>
              <div className="nav">
                <div className="nav-link">
                  <NavLink className={AddActiveClass} to="/">
                    Home
                  </NavLink>
                </div>
                <div className="nav-link">
                  <NavLink className={AddActiveClass} to="/explore">
                    Explore
                  </NavLink>
                </div>
                <div className="nav-link">
                  <NavLink className={AddActiveClass} to="/add-project">
                    Start Fundraising
                  </NavLink>
                </div>
                <div className="nav-link">
                  <NavLink className={AddActiveClass} to="/signin">
                    <FaUserAlt />
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
