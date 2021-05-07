import React, { Component } from "react";
import { isAuthenticated } from "../../../../utils/auth";
import { addEvent } from "../../../../utils/eventApi";
import TextField from "@material-ui/core/TextField";

class NewEvent extends Component {
  state = {
    name: "",
    location: "",
    error: "",
    description: "",
    loading: false,
    open: false,
    date: null,
    time: null,
    owner: isAuthenticated().user._id,
    redirectToEvents: false,
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = event.target.value;

    this.setState({ [name]: value });
  };

  changeDateTime = (event) => {
    const { value } = event.target;
    console.log(value);
    if (value.length == 10) {
      const date = new Date(value);
      this.setState({ date });
    } else this.setState({ time: value });
  };

  isValid = () => {
    const { name, location, date } = this.state;
    const today = new Date();

    if (name.length === 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    if (location.length === 0) {
      this.setState({ error: "Location is required" });
      return false;
    }

    if (date === null) {
      this.setState({ error: "You should choose a date" });
      return false;
    }
    if (today.getTime() > date.getTime()) {
      this.setState({ error: "The chosen date is unavailable" });
      return false;
    }

    return true;
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const { name, location, date, time, description, owner } = this.state;
      const event = {
        name,
        location,
        date,
        time,
        description,
      };
      console.log(event);
      const token = isAuthenticated().token;

      addEvent(event, owner, token).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            name: "",
            location: "",
            error: "",
            description: "",
            loading: false,
            date: null,
            open: true,
            time: null,
          });
      });
    } else this.setState({ loading: false });
  };

  signupForm = (name, location, date, time, description) => {
    return (
      <form style={{ paddingBottom: "100px" }}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Location</label>
          <input
            onChange={this.handleChange("location")}
            type="text"
            className="form-control"
            value={location}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Date</label>
          <div>
            <TextField
              onChange={this.changeDateTime}
              type="date"
              style={{ backgroundColor: "white" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="text-muted">Time</label>
          <div>
            <TextField
              type="time"
              defaultValue="00:00"
              onChange={this.changeDateTime}
              style={{ backgroundColor: "white" }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="text-muted">Description</label>
          <textarea
            onChange={this.handleChange("description")}
            type="text"
            className="form-control"
            value={description}
          />
        </div>

        <div className="text-center">
          <button onClick={this.clickSubmit} className="btn ">
            Submit
          </button>
        </div>
      </form>
    );
  };

  render() {
    const {
      name,
      location,
      date,
      time,
      error,
      loading,
      description,
      open,
    } = this.state;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5 text-center">Organize an event</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          Your event was successfully created.
        </div>
        {loading ? (
          <div className="mt-4 mb-4 text-center">
          <h5>Loading...</h5>
        </div>
        ) : (
          ""
        )}

        {this.signupForm(name, location, date, time, description)}
      </div>
    );
  }
}

export default NewEvent;
