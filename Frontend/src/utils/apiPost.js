import axios from "axios";
import { isAuthenticated } from "./auth";

export const create = (userId, token, post) => {
  return axios
    .post(`http://localhost:8080/post/new/${userId}`, post, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const list = (userId, token) => {
  return axios
    .get(`http://localhost:8080/posts/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const read = (postId) => {
  const token = isAuthenticated().token;
  return axios
    .get(`http://localhost:8080/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const update = (postId, token, post) => {
  return axios
    .put(`http://localhost:8080/post/${postId}`, post, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const listByUser = (userId, token) => {
  return axios
    .get(`http://localhost:8080/posts/by/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const remove = (postId, token) => {
  return axios
    .delete(`http://localhost:8080/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const like = (userId, token, postId) => {
  return axios
    .put(
      `http://localhost:8080/post/like`,
      { userId, postId },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const unlike = (userId, token, postId) => {
  return axios
    .put(
      `http://localhost:8080/post/unlike`,
      { userId, postId },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const comment = (userId, token, postId, comment) => {
  return axios
    .put(
      `http://localhost:8080/post/comment`,
      { userId, postId, comment },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const uncomment = (userId, token, postId, comment) => {
  return axios
    .put(
      `http://localhost:8080/post/uncomment`,
      { userId, postId, comment },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};
