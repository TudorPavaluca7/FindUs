import React, { Component } from "react";
import { isAuthenticated } from "../../../../utils/auth";
import { read  } from "../../../../utils/api";
import { listByUser } from "../../../../utils/apiPost";
import { displayPosts, addNotification} from "../../../../utils/helper";
import FollowProfile from "./FollowProfile";
import ProfileTabs from "./ProfileTabs.js";
import default_icon from "../../features/default_icon.jpg";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
      
    };
  }
  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
        let auth = JSON.parse(localStorage.getItem("jwt"));
        if (this.state.following) auth.user.following.push(this.state.user);
        else {
          const index = auth.user.following.indexOf(this.state.user);
          auth.user.following.splice(index, 1);
        }
        localStorage.setItem("jwt", JSON.stringify(auth));
        if (this.state.following)
              addNotification(null, "follow", this.state.user._id);
        
      }
    });
  };

  init = (userId) => {
    const token = isAuthenticated().token;

    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = (userId) => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.userId;
    this.init(userId);
    this.setState({
      photoUrl: `http://localhost:8080/user/photo/${userId}?${new Date().getTime()}`,
    });
  }

  componentWillReceiveProps(props) {
    const userId = props.userId;
    this.init(userId);
  }

  render() {
    const { user, posts, photoUrl } = this.state;

    return (
      <div>
        <div className="container">
          <h2 className="mt-5 mb-5">Profile</h2>
          <div className="row">
            <div className="col-md-6">
              <img
                style={{ height: "200px", width: "auto" }}
                className="img-thumbnail"
                src={photoUrl}
                onError={(i) => (i.target.src = `${default_icon}`)}
                alt={user.firstName}
              />
            </div>

            <div className="col-md-6">
              <div className="lead mt-2">
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p>Email: {user.email}</p>
                <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
              </div>

              <FollowProfile
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            </div>
          </div>

          <div className="row">
            <div className="col md-12 mt-5 mb-5">
              About
              <hr />
              <p className="lead">{user.about}</p>
              <hr />
              <ProfileTabs
                followers={user.followers}
                following={user.following}
              />
            </div>
          </div>
        </div>
        {displayPosts(posts)}
      </div>
    );
  }
}

export default Profile;
