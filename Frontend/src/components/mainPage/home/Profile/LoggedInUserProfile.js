import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../../utils/auth";
import { renderPhoto } from "../../../../utils/api";
import { listByUser } from "../../../../utils/apiPost";
import { displayPosts } from "../../../../utils/helper";
import DeleteUser from "./DeleteUser";
import ProfileTabs from "./ProfileTabs.js";


class LoggedInUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

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
    this.loadPosts(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.userId;
    this.loadPosts(userId);
  }

  render() {
    const { posts } = this.state;

    const {
      _id,
      firstName,
      lastName,
      created,
      email,
      about,
      followers,
      following,
    } = isAuthenticated().user;

    return (
      <div>
        <div className="container">
          <h2 className="mt-5 mb-5">Profile</h2>
          <div className="row">
            <div className="col-md-6">
              <img
                style={{ height: "200px", width: "auto" }}
                className="img-thumbnail"
                src={renderPhoto()}
                alt="User"
              />
            </div>

            <div className="col-md-6">
              <div className="lead mt-2">
                <p>
                   {firstName} {lastName}
                </p>
                <p>Email: {email}</p>
                <p>{`Joined ${new Date(created).toDateString()}`}</p>
              </div>

              <div className="d-inline-block">
                <Link className="btn btn-raised mr-5" to={`/user/edit/${_id}`}>
                  Edit Profile
                </Link>
                <DeleteUser userId={_id} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col md-12 mt-5 mb-5">
              About
              <hr />
              <p className="lead">{about}</p>
              <hr />
              <ProfileTabs followers={followers} following={following} />
            </div>
          </div>
        </div>
        {displayPosts(posts)}
      </div>
    );
  }
}

export default LoggedInUserProfile;
