import React, { Component } from "react";
import { isAuthenticated } from "../../../../utils/auth";
import {
  read,
  update,
  updateLocalStorage,
  renderPhoto,
} from "../../../../utils/api";
import { Redirect } from "react-router-dom";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      loading: false,
      about: "",
      photo: "",
      reader: null,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          error: "",
          about: data.about,
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.userId;
    this.init(userId);
  }

  isValid = () => {
    const { firstName, lastName, email, password, fileSize } = this.state;
    if (fileSize > 2000000) {
      this.setState({ error: "File size should be less than 2mb" });
      return false;
    }
    if (firstName.length === 0) {
      this.setState({ error: "First Name is required" });
      return false;
    }
    if (lastName.length === 0) {
      this.setState({ error: "Last Name is required" });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid Email is required" });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
      });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    let value = "";
    let fileSize = 0;
    if (name === "photo") {
      value = event.target.files[0];
      fileSize = event.target.files[0].size;
      this.savePhoto(value);
    } else value = event.target.value;

    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  savePhoto = (value) => {
    const reader = new FileReader();
    
    console.log(value)
    reader.readAsDataURL(value);

    this.setState({ reader });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const userId = this.props.userId;
      const token = isAuthenticated().token;
      localStorage.setItem("picture", this.state.reader.result);
      update(userId, token, this.userData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          updateLocalStorage(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
      });
    } else this.setState({ loading: false });
  };

  signupForm = (firstName, lastName, email, password, about) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">First Name</label>
        <input
          onChange={this.handleChange("firstName")}
          type="text"
          className="form-control"
          value={firstName}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Last Name</label>
        <input
          onChange={this.handleChange("lastName")}
          type="text"
          className="form-control"
          value={lastName}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={this.handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <div className="text-center pb-5">
        <button onClick={this.clickSubmit} className="btn">
          Update
        </button>
      </div>
    </form>
  );

  render() {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5 text-center">Edit Profile</h2>
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
        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={renderPhoto()}
          alt="user photo"
        />

        {this.signupForm(firstName, lastName, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;
