import React, { Component } from "react";
import { isAuthenticated } from "./auth";
import { notification } from "./api";
import Post from "../components/mainPage/home/posts/Post";
import Event from "../components/mainPage/home/events/Event";

export const displayEvents = (events, isOwner) => {
  return (
    <div>
      {events.map((event, i) => {
        console.log(event)
        const commonProps = {
          eventId: event._id,
          eventName: event.name,
          eventLocation: event.location,
          members: event.members,
          eventDay: new Date(event.day).toDateString(),
          eventTime: event.time,
          eventDescription: event.description , 
          isOwner: isOwner,
        };
        return <Event {...commonProps} />;
      })}
    </div>
  );
};

export const displayPosts = (posts) => {
  return (
    <div>
      {posts.map((post, i) => {
        const commonProps = {
          postId: post._id,
          posterId: post.postedBy._id,
          posterFirstName: post.postedBy.firstName,
          posterLastName: post.postedBy.lastName,
          content: post.content,
          date: new Date(post.created).toDateString(),
          likes: post.likes,
          comments: post.comments,
        };

        if (post.photo)
          commonProps.photo = `http://localhost:8080/post/photo/${post._id}`;
        return <Post {...commonProps} />;
      })}
    </div>
  );
};

export const addNotification = (postId, action, userId) => {
  const loggedUser = isAuthenticated().user._id;
  const token = isAuthenticated().token;

  notification(loggedUser, userId, token, postId, action).then((data) => {
    if (data.error) {
      console.log(data.error);
    }
  });
};