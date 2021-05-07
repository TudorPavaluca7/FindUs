import React, { Component } from "react";
import { Link } from "react-router-dom";
import default_icon from "./default_icon.jpg";
import "./features.css";
import { isAuthenticated } from "../../../utils/auth";
import { renderPhoto } from "../../../utils/api";

class Features extends Component {
  state = {};

  render() {
    const style = { color: "inherit", textDecoration: "none" };
    return (
      <div className="features">
        <Link style={style} to={`/user/${isAuthenticated().user._id}`}>
          <div className="panel">
            <img
              src={`http://localhost:8080/user/photo/${
                isAuthenticated().user._id
              }?${new Date().getTime()}`}
              className="panel"
            ></img>
            <div className="text">
              {isAuthenticated().user.firstName}{" "}
              {isAuthenticated().user.lastName}
            </div>
          </div>
        </Link>
        <ul className="panel">
          <Link style={style} to={`/user/edit/${isAuthenticated().user._id}`}>
            <li>Edit Profile</li>
          </Link>
          <Link style={style} to="/findpeople">
            <li>Find People</li>
          </Link>
          <Link style={style} to="/events">
            <li>Events</li>
          </Link>
          <Link style={style} to="/event/add">
            <li>Organize an event</li>
          </Link>
          <Link style={style} to="/your_events">
            <li>Your events</li>
          </Link>
          <Link style={style} to="/notifications">
            <li>Notifications</li>
          </Link>
        </ul>
      </div>
    );
  }
}

export default Features;
