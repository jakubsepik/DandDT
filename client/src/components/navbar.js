import React, { useState, useEffect, useRef } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdSettings, IoMdArrowDropdown } from "react-icons/io";
import {MdLightMode, MdDarkMode} from "react-icons/md"
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";

require("dotenv").config();

const target = process.env.REACT_APP_HOST_BACKEND;

const Navbar = ({darkModeChange}) => {
  const [dropdown, setDropdown] = useState(false);
 
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <nav className="flex bg-tertiary h-[8%] items-center border-b-[1px] border-border">
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

      <div className="text-white rounded ">
        <button
          ref={dropdown ? wrapperRef : null}
          onClick={() => setDropdown(!dropdown)}
          className=" flex flex-row relative py-2 px-2 rounded"
        >
          <IoMdSettings />
          <IoMdArrowDropdown />

          <ul className={
              (dropdown ? "block" : "hidden") +
              " settings dark:text-white dark:bg-dark_primary border-x-2 border-b-2 border-quaternary text-black absolute bg-slate-100 top-100 left-[-75%] w-[250%] z-10 rounded-b-lg text-sm"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <li>
              <button
                onClick={(event) => {
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
                Export to JSON
              </button>
            </li>
            <li>
              <button className="flex justify-center m-auto items-center gap-x-2"
              onClick={() => {
                darkModeChange()
              }}>
                <span>Theme</span>
                <span>{(window.localStorage.getItem("darkMode")=="1"?<MdDarkMode/>:<MdLightMode/>)}</span>
              </button>
            </li>
          </ul>
        </button>
      </div>
    </nav>
  );

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
};

export default Navbar;
