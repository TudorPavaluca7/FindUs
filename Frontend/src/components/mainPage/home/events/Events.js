import React, { Component } from "react";
import { displayEvents } from "../../../../utils/helper";
import { getEvents } from "../../../../utils/eventApi";
import { isAuthenticated } from "../../../../utils/auth";

class Events extends Component {
  constructor() {
    super();
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    getEvents(userId, token).then((data) => {
      if (data.error) {
        console.log(data);
      } else {
        this.setState({ events: data });
      }
    });
  }


  render() {
    const { events } = this.state;
    const isOwner = false;
    return <div>{displayEvents(events, isOwner)}</div>;
  }
}

export default Events;
