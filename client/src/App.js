import React, { Component } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdPassword, MdEmail } from "react-icons/md";
import { Route } from "react-router-dom";

import Dashboard from "./components/dashboard";

import axios from "axios";
import toast from "react-hot-toast";
import "./output.scss";
import { Toaster } from "react-hot-toast";
axios.defaults.withCredentials = true;
require("dotenv").config();
const target = process.env.REACT_APP_HOST_BACKEND;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.onLogin = this.onLogin.bind(this);
    this.onRegister = this.onRegister.bind(this);

    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
    this.state = {
      interface: 0, //0=login;1=register;2=dashboard
      username: "",
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    axios.get(target + "user/verify").then((res) => {
      var login = res.data.login;
      if (login) {
        window.sessionStorage.setItem("user", login);
        this.setState({ interface: 2 });
      } else {
        this.setState({ interface: 0 });
      }
    });
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }
  onLogin(e) {
    e.preventDefault();
    axios
      .post(target + "user/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        let login = res.data.login;
        if (!login) toast.error("Wrong email or password");
        else {
          window.sessionStorage.setItem("user", login);
          this.setState({ interface: 2 });
        }
      });
  }
  onRegister(e) {
    e.preventDefault();
    axios
      .post(target + "user/register", {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        toast.success("Register Succesful");
        this.setState({ interface: 0 });
      })
      .catch((error) => {
        console.log(error);
        //toast.error(res.data.message);
      });
  }
  Register() {
    return (
      <>
        <h2 className="text-center login-title custom-font my-5">
          Create account
        </h2>
        <form onSubmit={this.onRegister}>
          <div className="flex bg-white relative rounded border-solid border-indigo-500 border-2 my-5">
            <span className="absolute top-1/2 -translate-y-1/2 p-2">
              <FaUserAlt />
            </span>
            <input
              onChange={this.onChange}
              value={this.state.username}
              id="username"
              type="text"
              className="w-full bg-transparent pl-10 py-1 rounded"
              placeholder="Username"
              required
              minLength="3"
              maxLength="12"
            />
          </div>
          <div className="flex bg-white relative rounded border-solid border-indigo-500 border-2 my-5">
            <span className="absolute top-1/2 -translate-y-1/2 p-2">
              <MdEmail />
            </span>
            <input
              onChange={this.onChange}
              value={this.state.email}
              id="email"
              type="email"
              className="w-full bg-transparent pl-10 py-1 rounded"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex bg-white relative rounded border-solid border-indigo-500 border-2 my-5">
            <span className="absolute top-1/2 -translate-y-1/2 p-2">
              <MdPassword />
            </span>
            <input
              onChange={this.onChange}
              value={this.state.password}
              id="password"
              type="password"
              className="w-full bg-transparent pl-10 py-1 rounded"
              placeholder="Password"
              required
              minLength="3"
              maxLength="22"
            />
          </div>

          <button
            type="submit"
            className="m-auto block bg-indigo-500 custom-font px-4 py-1 rounded text-lg font-semibold text-white my-5 transition-colors hover:bg-indigo-800"
          >
            Register
          </button>
          <div className="text-white text-center">
            Already have an account? Login {}
            <span
              onClick={() => {
                this.setState({ interface: 0 });
              }}
              className="cursor-pointer underline"
            >
              here
            </span>
            .
          </div>
        </form>
      </>
    );
  }
  Login() {
    return (
      <>
        <h2 className="text-center login-title custom-font my-5">Sign in</h2>
        <form onSubmit={this.onLogin}>
          <div className="flex bg-white relative rounded border-solid border-indigo-500 border-2 my-5">
            <span className="absolute top-1/2 -translate-y-1/2 p-2">
              <MdEmail />
            </span>
            <input
              onChange={this.onChange}
              value={this.state.email}
              id="email"
              type="email"
              className="w-full bg-transparent pl-10 py-1 rounded"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex bg-white relative rounded border-solid border-indigo-500 border-2 my-5">
            <span className="absolute top-1/2 -translate-y-1/2 p-2">
              <MdPassword />
            </span>
            <input
              onChange={this.onChange}
              value={this.state.password}
              id="password"
              type="password"
              className="w-full bg-transparent pl-10 py-1 rounded"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="m-auto block bg-indigo-500 custom-font px-4 py-1 rounded text-lg font-semibold text-white my-5 transition-colors hover:bg-indigo-800"
          >
            Login
          </button>
          <div className="text-white">
            Don't have an account? Register {}
            <span
              onClick={() => {
                this.setState({ interface: 1 });
              }}
              className="cursor-pointer underline"
            >
              here
            </span>
            .
          </div>
        </form>
      </>
    );
  }

  render() {
    return (
      <>
        <Toaster />
        <div
          className={
            (window.localStorage.getItem("darkMode") === 1 ? "login-bg" : "") +
            " h-screen bg-[#3066b3] relative"
          }
        >
          <div className="absolute left-1/2 -translate-x-1/2 font-mono flex flex-col overflow-hidden">
            <Route exact path="/">
              {() => {
                switch (this.state.interface) {
                  case 0:
                    return this.Login();
                  case 1:
                    return this.Register();
                  case 2:
                    return <Dashboard />;
                  default:
                    return null;
                }
              }}
            </Route>
          </div>
        </div>
      </>
    );
  }
}
