import React, { Component } from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Dashboard from "./components/dashboard";

import axios from "axios";
import toast from "react-hot-toast";
import "./style.scss";
import { Toaster } from "react-hot-toast";
axios.defaults.withCredentials = true
require("dotenv").config();
const target = process.env.REACT_APP_HOST_BACKEND;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.Login = this.Login.bind(this);
    this.state = {
      login: false,
      username: "",
      password: "",
    };
  }

  componentDidMount() {
    axios.get(target + "user/verify").then((res) => {
      var login = res.data.login;
      console.log(login);
      if (login) this.setState({ login: true });
    });
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }
  onSubmit(e) {
    e.preventDefault();
    axios
      .post(target + "user/login", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        let login = res.data.login;
        if (login === false) toast.error("Wrong username or password");
        else {
          this.setState({login:true})
        }
      });
  }
 Login() {
  return (
    <div className="login">
      <div className="heading">
        <h2>Sign in</h2>
        <form onSubmit={this.onSubmit}>
          <div className="input-group input-group-lg">
            <span className="input-group-addon">
              <i className="fa fa-user"></i>
            </span>
            <input
              onChange={this.onChange}
              id="username"
              type="text"
              className="form-control"
              placeholder="Username or email"
              required
            />
          </div>

          <div className="input-group input-group-lg">
            <span className="input-group-addon">
              <i className="fa fa-lock"></i>
            </span>
            <input
              onChange={this.onChange}
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
        </form>
      </div>
    </div>
  );
};
render() {
  console.log(this.state.login)
  return (
    <div>
      <Toaster />
      <Route exact path="/">
        {!this.state.login ? this.Login() : <Dashboard/>}
      </Route>
    </div>
  );
}

}