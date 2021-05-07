import React, { Component } from "react";
import NavBar from "./navbar/NavBar";
import Features from "./features/Features";
import Home from "./home/Home";
import Info from "./info/Info";
import { isAuthenticated } from "../../utils/auth";
class MainPage extends Component {
  state = {};

  render() {
    const mystyle = {
      display: "flex",
    };
    
    let show=""
    if (isAuthenticated()) {
      show = <div> <NavBar /> <div style={mystyle}> <Features /> <Home /> <Info /> </div> </div>;
    } else {
      show = <div>Access denied</div>;
    }
    return (
      <div>
        {show}
        
      </div>
    );
  }
}

export default MainPage;
