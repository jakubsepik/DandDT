import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";

require("dotenv").config();

const target = process.env.REACT_APP_HOST_BACKEND;

const Navbar = () => {
  return (
    <nav className="flex bg-tertiary h-[6%] items-center border-b-[1px] border-border">
      <div className="px-8 py-2 text-lg font-bold text-[#ec2127]">D&DT</div>
      <span id="user" className="px-8 text-white">
        <div>Welcome {window.sessionStorage.getItem("user")}</div>
      </span>
      <span
        onClick={() => {
          axios.get(target + "user/logout").then((res) => {
            window.sessionStorage.removeItem("user");
            window.location.reload();
          });
        }}
        title="Logout"
        className="hover:text-red-600 mx-8 cursor-pointer text-white"
      >
        <FaSignOutAlt />
      </span>
      <DropdownButton id="dropdown-item-button" title="Tools">
        <Dropdown.Item
          as="button"
          onClick={() => {
            axios.get(target + "exportFiles").then((result) => {
              const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                JSON.stringify(result.data)
              )}`;
              const link = document.createElement("a");
              link.href = jsonString;
              link.download = "data.json";

              link.click();
            });
          }}
        >
          Export in JSON
        </Dropdown.Item>
        <Dropdown.Item as="button">Another action</Dropdown.Item>
        <Dropdown.Item as="button">Something else</Dropdown.Item>
      </DropdownButton>
    </nav>
  );
};

export default Navbar;
