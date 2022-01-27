import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { DropdownButton,Dropdown } from "react-bootstrap";

import axios from "axios";

require("dotenv").config();
const target = process.env.REACT_APP_HOST_BACKEND;
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark">
      <div className="navbar-brand text-light">DanDT</div>
      <span id="user">
        <div>Welcome {window.sessionStorage.getItem("user")}</div>
        <i
          className="fa fa-sign-out"
          onClick={() => {
            axios.get(target + "user/logout").then((res) => {
              window.sessionStorage.removeItem("user");
              window.location.reload();
            });
          }}
          title="Logout"
        ></i>
      </span>
      <DropdownButton id="dropdown-item-button" title="Tools">
        <Dropdown.Item as="button" onClick={()=>{console.log("hello")}}>Files</Dropdown.Item>
        <Dropdown.Item as="button">Another action</Dropdown.Item>
        <Dropdown.Item as="button">Something else</Dropdown.Item>
      </DropdownButton>
    </nav>
  );
};

export default Navbar;
