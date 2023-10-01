import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row">
            <ul className="social">
              <li>
                <a href="https://facebook.com/" target="_blank">
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" target="_blank">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/" target="_blank">
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </div>
          <div className="row">
            <p className="copyright">
              Copyright &copy; 2023 - All Rights Reserved | Fundraiser
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
