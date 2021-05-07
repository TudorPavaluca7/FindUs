import axios from "axios";

export const getEvents = (userId, token) => {
  return axios
    .get(`http://localhost:8080/events/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const addMember = (eventId, token, memberId) => {
  return axios
    .put(
      `http://localhost:8080/event/add`,
      { eventId, memberId },
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

export const removeMember = (eventId, token, memberId) => {
  return axios
    .put(
      `http://localhost:8080/event/remove`,
      { eventId, memberId },
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

export const addEvent = (event, ownerId, token) => {
  return axios
    .post(
      `http://localhost:8080/new/event`,

      { event, ownerId },
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


export const getUserEvents = (userId, token) => {
  return axios
    .get(`http://localhost:8080/userEvents/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const remove = (eventId, token) => {
  
  return axios
    .delete(`http://localhost:8080/delete/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const read = (eventId, token) => {

  return axios
  .get(`http://localhost:8080/event/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => response.data)
  .catch((err) => console.log(err));

}

export const update = (eventId, token, event) => {
  console.log(event)
  return axios
  .put(`http://localhost:8080/event/${eventId}`, {event}, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => response.data)
  .catch((err) => console.log(err));



}
