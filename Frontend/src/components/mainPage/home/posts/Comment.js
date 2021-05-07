import React, { Component } from "react";
import { comment, uncomment } from "../../../../utils/apiPost";
import { isAuthenticated } from "../../../../utils/auth";
import { addNotification } from "../../../../utils/helper";
import { Link } from "react-router-dom";
import trash from "../../../../img/trash.png";
import default_icon from "../../features/default_icon.jpg";

class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 200) {
      this.setState({
        error: "Comment should not be empty and less than 200 characters long",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // dispatch fresh list of coments to parent (SinglePost)
          this.props.updateComments(data.comments);
          if (this.props.posterId !== userId)
            addNotification(postId, "comment", this.props.posterId);
        }
      });
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete your comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  renderDelete = (id, comment) => {
    if (id === isAuthenticated().user._id)
      return (
        <img
          src={trash}
          style={{ marginLeft: "10px"}}
          alt="Edit Post"
          className="post-delete-edit"
          onClick={this.deleteConfirmed(comment)}
        />
      );
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="post-comments">
          {comments.map((comment, i) => (
            <div className="comment">
              <div class="post-header">
                <div class="post-details">
                  <Link to={`/user/${comment.postedBy._id}`}>
                    <img
                      className="post-photo"
                      onError={(i) => (i.target.src = `${default_icon}`)}
                      src={`http://localhost:8080/user/photo/${comment.postedBy._id}`}
                      alt={comment.postedBy.name}
                    />
                  </Link>
                  <div>
                    <span>
                      {comment.postedBy.firstName} {comment.postedBy.lastName}
                    </span>
                    <span>{new Date(comment.created).toDateString()}</span>
                  </div>
                </div>
                <span>
                      {isAuthenticated().user._id === comment.postedBy._id && (
                        <>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => this.deleteConfirmed(comment)}
                            className="text-danger float-right mr-1"
                          >
                            Remove
                          </span>
                        </>
                      )}
                    </span>
                
              </div>
              <div className="post-content">
                <p>{comment.text}</p>
                
              </div>
            </div>
          ))}
        </div>
        <h2 className="mt-5 mb-5">Leave a comment</h2>

        <form onSubmit={this.addComment} className="comment-form">
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="Leave a comment..."
            />
            <button className="btn btn-raised btn-success mt-2">Post</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Comment;
