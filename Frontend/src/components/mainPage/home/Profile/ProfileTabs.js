import React, { Component } from "react";
import { Link } from "react-router-dom";
import default_icon from "../../features/default_icon.jpg";

class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-center">Followers</h3>

            {followers.map((person, i) => (
              <div key={i}>
                <div>
                  <Link
                    to={`/user/${person._id}`}
                    style={{
                      textDecoration: "none",

                      color: "#000",
                    }}
                  >
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black",
                      }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      onError={(i) => (i.target.src = `${default_icon}`)}
                      src={`http://localhost:8080/user/photo/${person._id}`}
                      alt={person.firstName}
                    />
                    <div>
                      <p className="lead">
                        {person.firstName} {person.lastName}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <h3 className="text-center">Following</h3>

            {following.map((person, i) => (
              <div key={i}>
                <div>
                  <Link
                    to={`/user/${person._id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                      color: "#000",
                    }}
                  >
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black",
                      }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      onError={(i) => (i.target.src = `${default_icon}`)}
                      src={`http://localhost:8080/user/photo/${person._id}`}
                      alt={person.firstName}
                    />
                    <div>
                      <p className="lead text-center">
                        {person.firstName} {person.lastName}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
