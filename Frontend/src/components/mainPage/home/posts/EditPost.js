import React, { Component } from "react";
import { read, update } from "../../../../utils/apiPost";
import { isAuthenticated } from "../../../../utils/auth";
import { Redirect } from "react-router-dom";

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      content: "",
      redirectToMenu: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (postId) => {
    read(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToMenu: true });
      } else {
        this.setState({
          id: data.postedBy._id,
          content: data.content,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.postId;
    this.init(postId);
  }

  renderImage = () => {};

  isValid = () => {
    const { content, fileSize } = this.state;
    if (fileSize > 2000000) {
      this.setState({ error: "File size should be less than 2mb" });
      return false;
    }
    if (content.length === 0) {
      this.setState({ error: "The content field is required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.props.postId;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            content: "",
            redirectToMenu: true,
          });
        }
      });
    }
  };

  editPostForm = (content) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Content</label>
        <textarea
          onChange={this.handleChange("content")}
          type="text"
          className="form-control"
          value={content}
        />
      </div>
      <div className="text-center">
        <button
          onClick={this.clickSubmit}
          className="btn btn-raised btn-primary"
        >
          Update Post
        </button>
      </div>
    </form>
  );

  render() {
    const { id, content, redirectToMenu, error, loading } = this.state;

    if (redirectToMenu) {
      return <Redirect to={`/menu`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5 text-center">Edit Post</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="mt-4 mb-4 text-center">
            <h5>Loading...</h5>
          </div>
        ) : (
          ""
        )}

        {/* <img
                    style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={`${
                        process.env.REACT_APP_API_URL
                    }/post/photo/${id}?${new Date().getTime()}`}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={title}
                /> */}

        {this.editPostForm(content)}
      </div>
    );
  }
}

export default EditPost;
