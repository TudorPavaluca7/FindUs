import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../../../../utils/auth";
import { addMember, removeMember, remove } from "../../../../utils/eventApi";
import trash from "../../../../img/trash.png";


import "./event.css";

class Event extends Component {
  state = {
    member: false,
    redirect: false,
    members: this.props.members.length,
  };

  componentDidMount() {
    this.setState({
      member: this.checkEvent(this.props.members),
    });
  }

  checkEvent = (members) => {
    const userId = isAuthenticated().user._id;
    let match = members.some((member) => member._id === userId);
    return match;
  };

  attendToggle = () => {
    let callApi = this.state.member ? removeMember : addMember;
    const userId = isAuthenticated().user._id;
    const eventId = this.props.eventId;
    const token = isAuthenticated().token;

    callApi(eventId, token, userId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data)
        this.setState({
          member: !this.state.member,
          members: data.members.length,
        });
      }
    });
  };

  removeEvent = () => {
    const eventId = this.props.eventId;
    const token = isAuthenticated().token;
    remove(eventId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your event?");
    if (answer) {
      this.removeEvent();
    }
  };

  renderAttendButton(isOwner) {
    if (!isOwner) {
      if (!this.state.member)
        return (
          <button className="btn" onClick={this.attendToggle}>
            Attend
          </button>
        );
      else return <button className="btn"onClick={this.attendToggle}>Miss</button>;
    } else
      return (
        <Link to={`/event/edit/${this.props.eventId}`}
              style={{ textDecoration: "none" }} 
        >      
        <button className="btn">
          Edit Event
        </button>
        </Link>
      );
  }
  renderRemoveButton(isOwner) {
    if (isOwner) {
      // return <button onClick={this.deleteConfirmed}>Remove</button>;
      return (
        <img
          onClick={this.deleteConfirmed}
          src={trash}
          alt="Delete Post"
          className="post-delete"
        />
      );
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={`/your_events`} />;
    }
    const {
      eventName,
      eventLocation,
      eventDay,
      eventTime,
      members,
      eventDescription,
      isOwner,
    } = this.props;

    console.log(isOwner);

    return (
      <div className="event-container">
        <h2 className="event-name">{eventName}</h2>

        <div className="row">
          <div className="col-md-6">
            <h3 className="event-location">
              <span>Location:</span> {eventLocation}
            </h3>
          </div>
          <div className="col-md-6">
            <div className="event-time">
              <span className="event-time-detail">
                Day: <span>{eventDay}</span>
              </span>
              <span className="event-time-detail">
                Time: <span>{eventTime}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="event-description">{eventDescription}</p>

        <div className="event-members">{this.state.members} attendees</div>
        <div className="event-buttons">
          {this.renderRemoveButton(isOwner)}
          {this.renderAttendButton(isOwner)}
        </div>
      </div>
    );
  }
}

export default Event;
