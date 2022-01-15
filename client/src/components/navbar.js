import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

import axios from "axios";

require("dotenv").config();
const target = process.env.REACT_APP_HOST_BACKEND;
// Here, we display our Navbar
const Navbar = () => {
  return (
    <nav>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="navbar-brand text-light">
          DanDT
        </div>
        

        <div>Welcome {window.sessionStorage.getItem("user")}</div>
        <button onClick={()=>{
          axios.get(target + "user/logout").then((res)=>{
            window.sessionStorage.removeItem("user")
          window.location.reload()
          })
          
        }}>Logout</button>
      </nav>
    </nav>
  );
};

export default Navbar;
