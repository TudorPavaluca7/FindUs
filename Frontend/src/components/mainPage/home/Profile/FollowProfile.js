import React, { Component } from "react";
import { follow, unfollow } from "../../../../utils/api";

class FollowProfile extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };
  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };

  renderButton = () => {
    if (!this.props.following)
      return (
        <button onClick={this.followClick} className="btn btn-black">
          Follow
        </button>
      );
    else
      return (
        <button
          onClick={this.unfollowClick}
          style={{ marginTop: 0 }}
          className="btn btn-secondary"
        >
          Unfollow
        </button>
      );
  };

  render() {
    return <div className="d-inline-block">{this.renderButton()}</div>;
  }
}

export default FollowProfile;
