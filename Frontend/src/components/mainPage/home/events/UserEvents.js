import React, { Component } from "react";
import { displayEvents } from "../../../../utils/helper";
import {  getUserEvents } from "../../../../utils/eventApi";
import { isAuthenticated } from "../../../../utils/auth";

class UserEvents extends Component {
  constructor() {
    super();
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    getUserEvents(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ events: data });
      }
    });
  }



  render() {
    const { events } = this.state;
    const isOwner = true;
    return <div>{displayEvents(events, isOwner)}</div>;
  }
}

export default UserEvents;
