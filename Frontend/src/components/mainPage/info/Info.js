import React, { Component } from "react";
import default_icon from "../features/default_icon.jpg";
import { renderPhoto } from "../../../utils/api";
import "./info.css";
import { isAuthenticated } from "../../../utils/auth";

class Info extends Component {
  state = {
    redirectTo: false,
  };

  render() {
    return (
      <div className="info text-center">
        <img
          // src={`http://localhost:8080/user/photo/${isAuthenticated().user._id}?${new Date().getTime()}`}
          src={renderPhoto()}
          className="info-photo"
        ></img>
        <div>
          {" "}
          {isAuthenticated().user.firstName} {isAuthenticated().user.lastName}{" "}
        </div>
        <div> {isAuthenticated().user.homeland} </div>
      </div>
    );
  }
}

export default Info;
