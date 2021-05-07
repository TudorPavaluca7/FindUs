import React, { Component } from "react";
import "./home.css";
import Profile from "./Profile/Profile";
import EditProfile from "./Profile/EditProfile";
import { isAuthenticated } from "../../../utils/auth";
import { read } from "../../../utils/apiPost";
import FindPeople from "../home/FindPeople";
import Posts from "./posts/Posts";
import Post from "./posts/Post";
import LoggedInUserProfile from "./Profile/LoggedInUserProfile";
import Events from "./events/Events";
import UserEvents from "./events/UserEvents";
import NewEvent from "./events/NewEvent";
import EditEvent from "./events/EditEvent";
import EditPost from "./posts/EditPost";
import Notifications from "./Notifications";

class Home extends Component {
  state = {
    commonProps: null,
  };

  getPost = (postId) => {
    read(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        const commonProps = {
          postId: data._id,
          posterId: data.postedBy._id,
          posterFirstName: data.postedBy.firstName,
          posterLastName: data.postedBy.lastName,
          content: data.content,
          date: new Date(data.created).toDateString(),
          likes: data.likes,
          comments: data.comments,
        };
         this.setState({commonProps})
        // return <Post {...commonProps} />;
        //callback( commonProps );
        // console.log("1" + this.state.commonProps);
        
      }
    });
  };

  renderComponent = () => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "notifications") return <Notifications />;
    if (parts[1] === "user" && parts[2] == "edit")
      return <EditProfile userId={parts[3]} />;
    if (parts[1] === "post" && parts[2] == "edit")
      return <EditPost postId={parts[3]} />;
    if (parts[1] === "event" && parts[2] == "edit")
      return <EditEvent eventId={parts[3]} />;
    if (parts[1] === "findpeople") return <FindPeople />;
    if (parts[1] === "user") {
      if (parts[2] === isAuthenticated().user._id)
        return <LoggedInUserProfile userId={parts[2]} />;
      else return <Profile userId={parts[2]} />;
    }
    if (parts[1] === "events") return <Events />;
    if (parts[1] === "your_events") return <UserEvents />;
    if (parts[1] === "event" && parts[2] == "add") return <NewEvent /> ;
    if (parts[1] === "post") {
       this.getPost(parts[2])
       if (this.state.commonProps!==null)
         return <Post {...this.state.commonProps} /> 
    } else return <Posts />;
  };

  render() {
    return <div className="home">{this.renderComponent()}</div>;
  }
}

export default Home;
