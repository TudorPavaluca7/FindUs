import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../utils/auth";
import axios from "axios";
import default_icon from "../features/default_icon.jpg";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }
  componentDidMount() {
    axios
      .get(`http://localhost:8080/users`)
      .then((res) => {
        const users = res.data;
        this.setState({ users });
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
  }

  displayUser = (user, userLocation, i) => {
    if (user.location == userLocation) {
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
            <h5 className="card-title">{user.name}</h5>
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
    }
  };

  // displayUsers = (users) => {
  //   return <div className="row">
  //    {users.map((user, i) => (
  //        if (){
  //           <div>{user}</div>
  //        }
  //    ))}

  //   </div>;
  // };

  render() {
    const { users } = this.state;
    const userLocation = isAuthenticated().user.location;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        <div className="row">
          {users.map((user, i) => this.displayUser(user, userLocation,i))}
        </div>
      </div>
    );
  }
}

export default Users;

