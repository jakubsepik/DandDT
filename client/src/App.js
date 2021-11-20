import React, { Component } from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Create from "./components/create";
import RecordList from "./components/recordList";

import './style.scss'

import { Toaster } from "react-hot-toast";

export default class App extends Component {
  render() {
    return (
      <div>
        <Toaster />
        {Login()}
        <Route exact path="/">
        </Route>
      </div>
    );
  }
}
const Login = () =>{
  return (
    <div className="login">
  <div className="heading">
    <h2>Sign in</h2>
    <form action="#">

      <div className="input-group input-group-lg">
        <span className="input-group-addon"><i className="fa fa-user"></i></span>
        <input type="text" className="form-control" placeholder="Username or email"/>
          </div>

        <div className="input-group input-group-lg">
          <span className="input-group-addon"><i className="fa fa-lock"></i></span>
          <input type="password" className="form-control" placeholder="Password"/>
        </div>

        <button type="submit" className="float">Login</button>
       </form>
 		</div>
 </div>
    
  )
}