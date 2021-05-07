import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "./post.css";
import default_icon from "../../features/default_icon.jpg";
import thumbs_up from "../../../../img/thumbs_up.png";
import thumbs_up_full from "../../../../img/thumbs_up_full.png";
import trash from "../../../../img/trash.png";
import edit from "../../../../img/edit.png";
import { isAuthenticated } from "../../../../utils/auth";
import { addNotification } from "../../../../utils/helper";
import { remove, like, unlike } from "../../../../utils/apiPost";
import Comment from "./Comment";

// import thumbs-up-full.png
// import trash.png

class Post extends Component {
  state = {
    redirect: false,
    like: false,
    likes: this.props.likes.length,
    comments: [],
    commentButton: false,
  };

  componentDidMount() {
    this.setState({
      like: this.checkLike(this.props.likes),
      comments: this.props.comments,
    });
  }

  checkLike = (likes) => {
    const userId = isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  renderImage = (photo) => {
    if (photo)
      return (
        <img
          src={photo}
          // className="img-thunbnail mb-3"
          // style={{ height: "200px", width: "auto" }}
        />
      );
  };

  likeToggle = () => {
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.props.postId;
    const token = isAuthenticated().token;
    
    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
        if (this.state.like && this.props.posterId!== userId)
          addNotification(postId, "like", this.props.posterId);
        
      }
    });
  };

  deletePost = () => {
    const postId = this.props.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirect: true });
      }
    });
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderLikeButton = () => {
    if (this.state.like)
      return (
        <button class="like-btn" onClick={this.likeToggle}>
          <img src={thumbs_up_full} alt="" />
          {this.state.likes} Likes
        </button>
      );
    else
      return (
        <button class="like-btn" onClick={this.likeToggle}>
          <img src={thumbs_up} alt="" />
          {this.state.likes} Likes
        </button>
      );
  };

  renderComment = (postId) => {
    if (this.state.commentButton)
      return (
        <Comment
          postId={postId}
          comments={this.state.comments}
          updateComments={this.updateComments}
          posterId={this.props.posterId}
        />
      );
  };

  renderButtons = () => {
    if (this.props.posterId == isAuthenticated().user._id)
      return (
        <div>
          <Link
            to={`/post/edit/${this.props.postId}`}
            style={{ textDecoration: "none" }}
          >
            <img src={edit} alt="Delete Post" className="post-delete-edit" />
          </Link>
          <img
            src={trash}
            style={{ marginLeft: "20px" }}
            alt="Edit Post"
            className="post-delete-edit"
            onClick={this.deleteConfirmed}
          />
        </div>
      );
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={`/menu`} />;
    }

    const {
      postId,
      posterId,
      posterFirstName,
      posterLastName,
      content,
      date,
      photo,
    } = this.props;

    return (
      <div className="post">
        <div className="post-header">
          <div className="post-details">
            <Link to={`/user/${posterId}`} style={{ color: "inherit" }}>
              <img
                src={default_icon}
                className="post-photo"
                alt="User photo"
              ></img>
            </Link>
            <div>
              <Link to={`/user/${posterId}`} style={{ color: "inherit" }}>
                <span>
                  {posterFirstName + " "} {posterLastName}
                </span>
                <span>{date}</span>
              </Link>
            </div>
          </div>
          {this.renderButtons()}
        </div>

        <div class="post-content">
          <p>{content}</p>
          {this.renderImage(photo)}
        </div>

        <div class="post-buttons">
          {this.renderLikeButton()}
          <a
            class="comments-btn"
            onClick={() =>
              this.setState({ commentButton: !this.state.commentButton })
            }
          >
            {this.state.comments.length} Comments
          </a>
        </div>
        {this.renderComment(postId)}
      </div>
    );
  }
}

export default Post;
