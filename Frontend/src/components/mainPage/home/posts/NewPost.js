import React, { Component } from "react";
import "./newpost.css";
import default_icon from "../../features/default_icon.jpg";
import { isAuthenticated } from "../../../../utils/auth";
import { create, list } from "../../../../utils/apiPost";
import { renderPhoto } from "../../../../utils/api";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      content: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      posts: [],
    };
  }
  componentDidMount() {
    this.postData = new FormData();
  }

  getPosts = (data) => {
    const updated = this.props.posts;
    updated.unshift(data);
    this.props.updatePosts(updated);
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  isValid = () => {
    const { content, fileSize } = this.state;
    if (fileSize > 2000000) {
      this.setState({ error: "File size should be less than 2mb" });
      return false;
    }
    if (content.length === 0) {
      this.setState({ error: "The content field is required" });
      return false;
    }
    return true;
  };

  clickSubmit = (event) => {
    event.preventDefault();

    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    if (this.isValid()) {
      create(userId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            content: "",
            photo: ""
          });
          this.getPosts(data);
        }
      });
    }
  };

  render() {
    //   if (this.state.redirect) {
    //     return <Redirect to={`/menu`} />;
    // }
    // const photoUrl = isAuthenticated().user._id
    //   ? `http://localhost:8080/user/photo/${
    //       isAuthenticated().user._id
    //     }?${new Date().getTime()}`
    //   : default_icon;
    const {error} = this.state

    return (

      <div
        className="main"
        style={({ marginBottom: "20px" }, { paddingBottom: "10px" })}
      >
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <div className="userimg">
          <img
            style={{ height: "100px", width: "auto", borderRadius: "20%" }}
            src={renderPhoto()}
          />
        </div>
        <div className="username">
          <p className="user" style={{ top: "15px" }}>
            {isAuthenticated().user.firstName} {isAuthenticated().user.lastName}
          </p>
        </div>
        <form>
          <div className="form-group">
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              placeholder="Share an article ,photo ,video or idea."
              value={this.state.content}
              onChange={this.handleChange("content")}
            ></textarea>
          </div>

          <div className="postbar">
            <input
              type="file"
              accept="images/*"
              id="chooseimg"
              onChange={this.handleChange("photo")}
              className="form-control"
            />
            <button type="button" className="imgbttn" id="imgbttn">
              &#x1f4f7; Image
            </button>
            <span>{this.state.photo.name}</span>
            <button
              onClick={this.clickSubmit}
              type="button"
              id="postmypost"
              className="postmypost btn"
            >
              Post
            </button>
          </div>
        </form>
        {/* <div>dadas</div>
        <div>dadas</div>
        <div>dadas</div> */}
      </div>
    );
  }
}

export default NewPost;
