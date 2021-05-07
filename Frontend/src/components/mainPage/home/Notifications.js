import React, { Component } from "react";
import { getNotifications } from "../../../utils/api";
import { Link } from "react-router-dom";

class Notifications extends Component {
  state = { notifications: [] };

  componentDidMount() {
    getNotifications().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ notifications: data });
      }
    });
  }

  renderType = (notification) => {
    const type = notification.action_type;
    if (type === "follow") return <span>started following you</span>;
    else if (type === "like")
      return (
        <span>
          liked your{" "}
          <Link to={`/post/${notification.post._id}`}>
            <span>post</span>
          </Link>{" "}
        </span>
      );
    else
      return (
        <span>
          commented on your{" "}
          <Link to={`/post/${notification.post._id}`}>
            {" "}
            <span>post</span>{" "}
          </Link>{" "}
        </span>
      );
  };

  displayNotification = (notification) => {
    return (
      <div className="info-post">
        <Link to={`/user/${notification.loggedUser._id}`}>
          <span>
            {notification.loggedUser.firstName}{" "}
            {notification.loggedUser.lastName}{" "}
          </span>
        </Link>
        {this.renderType(notification)}
      </div>
    );
  };

  render() {
    const { notifications } = this.state;
    console.log(notifications)
    return (
      <div class="notification-area">
        {notifications.map((notification, i) =>
          this.displayNotification(notification, i)
        )}
      </div>
    );
  }
}

export default Notifications;
