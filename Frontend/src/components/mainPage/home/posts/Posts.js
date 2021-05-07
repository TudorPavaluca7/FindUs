import React, { Component } from "react";
import { list } from "../../../../utils/apiPost";
import { displayPosts } from "../../../../utils/helper";
import { isAuthenticated } from "../../../../utils/auth";
// import DefaultProfile from "../images/avatar.jpg";
import NewPost from "./NewPost";


class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id
    const token = isAuthenticated().token 

    list(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  }

  updatePosts = (posts) => {
    
    this.setState({ posts });
  };

  checkFollow = (user) => {
    const jwt = isAuthenticated();

    const match = user.followers.includes(jwt.user._id);

    return match;
  };

  
  displayPosts = (posts) => {
    const validPosts = [];
    this.addValidPosts(posts, validPosts);
    return (
      <div>
        {posts.map((post, i) => {
          console.log(i)
          if (
            this.checkFollow(post.postedBy) ||
            post.postedBy._id == isAuthenticated().user._id
          ) {
            validPosts.push(post);
          }
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    
    return (
      <div>
        <NewPost updatePosts={this.updatePosts} posts={posts}  />
        {displayPosts(posts)}
      </div>
    );
  }
}

export default Posts;
