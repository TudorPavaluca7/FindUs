import axios from "axios";
import default_icon from "../components/mainPage/features/default_icon.jpg";
import { isAuthenticated } from "./auth";

export const remove = (userId, token) => {
  return axios
    .delete(`http://localhost:8080/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const read = (userId, token) => {
  return axios
    .get(`http://localhost:8080/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const update = (userId, token, user) => {
  return axios
    .put(`http://localhost:8080/user/${userId}`, user, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};



export const updateLocalStorage = (user, next) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};

export const follow = (userId, token, followId) => {
  return axios
    .put(
      `http://localhost:8080/user/follow`,
      { userId, followId },
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

export const unfollow = (userId, token, unfollowId) => {
  return axios
    .put(
      `http://localhost:8080/user/unfollow`,
      { userId, unfollowId },
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

export const findPeople = (userId, token) => {
  return axios
    .get(`http://localhost:8080/user/findpeople/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const renderPhoto = () => {
  const localStorageImage = localStorage.getItem("picture");
  if (localStorageImage) return localStorageImage;
  else return default_icon;
};

export const notification = (
  loggedUserId,
  userId,
  token,
  postId,
  action_type
) => {
  return axios
    .post(
      `http://localhost:8080/addNotification`,
      { loggedUserId, userId, postId, action_type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const getNotifications = () => {
  const token = isAuthenticated().token;
  const userId = isAuthenticated().user._id;
  return axios
    .get(`http://localhost:8080/getNotifications/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};



export const getUsers = userId => {
  return axios
    .get(`http://localhost:8080/users/${userId}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const getPhoto = userId => {
  return axios
    .get(`http://localhost:8080/user/photo/${userId}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};


export const removeNotifications = () => {
  const userId = isAuthenticated().user._id
  return axios
    .delete(`http://localhost:8080/removeNotificationsByUserId/${userId}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};