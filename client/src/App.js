import React, { Component } from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Dashboard from "./components/dashboard";

import axios from "axios";
import toast from "react-hot-toast";
import "./style.scss";
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
      email:"",
      password: "",
    };
  }

  componentDidMount() {
    axios.get(target + "user/verify").then((res) => {
      var login = res.data.login;
      if (login) {
        window.sessionStorage.setItem("user", login);
        this.setState({ login: true });
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
          this.setState({ interface:2 });
        }
      });
  }
  onRegister(e) {
    e.preventDefault();
    axios
      .post(target + "user/register", {
        username: this.state.username,
        email:this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        if(res.data.status==="error"){
          toast.error(res.data.message)
        }else{
          toast.success("Register Succesful")
          this.setState({interface:0})
        }
      });
  }
  Register() {
    return (
      <div className="login">
        <div className="heading">
          <h2>Register</h2>
          <form onSubmit={this.onRegister}>
            <div className="input-group input-group-lg">
              <span className="input-group-addon">
                <i className="fa fa-user"></i>
              </span>
              <input
                onChange={this.onChange}
                value={this.state.username}
                id="username"
                type="text"
                className="form-control"
                placeholder="Username"
                required
              />
            </div>

            <div className="input-group input-group-lg">
              <span className="input-group-addon">
                <i className="fa fa-envelope"></i>
              </span>
              <input
                onChange={this.onChange}
                value={this.state.email}
                id="email"
                type="email"
                className="form-control"
                placeholder="Email"
                required
              />
            </div>

            <div className="input-group input-group-lg">
              <span className="input-group-addon">
                <i className="fa fa-lock"></i>
              </span>
              <input
                onChange={this.onChange}
                value={this.state.password}
                id="password"
                type="password"
                className="form-control"
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="float">
              Register
            </button>
            <div onClick={()=>{this.setState({ interface: 0 })}}>
              Already have an account? Login here.
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  Login() {
    return (
      <div className="login">
        <div className="heading">
          <h2>Sign in</h2>
          <form onSubmit={this.onLogin}>
            <div className="input-group input-group-lg">
              <span className="input-group-addon">
                <i className="fa fa-user"></i>
              </span>
              <input
                onChange={this.onChange}
                value={this.state.email}
                id="email"
                type="email"
                className="form-control"
                placeholder="Email"
                required
              />
            </div>

            <div className="input-group input-group-lg">
              <span className="input-group-addon">
                <i className="fa fa-lock"></i>
              </span>
              <input
                onChange={this.onChange}
                value={this.state.password}
                id="password"
                type="password"
                className="form-control"
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="float">
              Login
            </button>
            <div onClick={()=>{this.setState({ interface: 1 })}}>
              Not having an account? Register here.
            </div>
          </form>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div>
        <Toaster />
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
    );
  }
}
