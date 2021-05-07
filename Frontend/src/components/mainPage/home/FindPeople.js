import React, { Component } from "react";
import { findPeople } from "../../../utils/api";
import default_icon from "../features/default_icon.jpg";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../utils/auth";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    findPeople(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  displayUser = (user, i) => {
    
      return (
        <div className="card col-md-4" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={`http://localhost:8080/user/photo/${user._id}`}
            onError={(i) => (i.target.src = `${default_icon}`)}
            alt={user.firstName}
          />
          <div className="card-body">
            <h5 className="card-title">
              {user.firstName} {user.lastName}
            </h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      );
  };

  render() {
    const { users } = this.state;
    const userLocation = isAuthenticated().user.location;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Find People</h2>

        <div className="row">
          {users.map((user, i) => this.displayUser(user, userLocation, i))}
        </div>
      </div>
    );
  }
}

export default FindPeople;
