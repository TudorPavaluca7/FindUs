import React, { Component } from "react";
import { read, update } from "../../../../utils/eventApi";
import { isAuthenticated } from "../../../../utils/auth";
import TextField from "@material-ui/core/TextField";

class EditEvent extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      location: "",
      time: "",
      day: null,
      description: "",
      open: false,
    };
  }

  componentDidMount = () => {
    const eventId = this.props.eventId;
    const token = isAuthenticated().token;
    read(eventId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          name: data.name,
          description: data.description,
          location: data.location,
          day: new Date(data.day),
          time: data.time
        });
      }
    });
  };

  isValid = () => {
    const { name, location, day } = this.state;
    
    const today = new Date();
    if (name.length == 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    if (location.length == 0) {
      this.setState({ error: "Location is required" });
      return false;
    }
    if (today.getTime() > day.getTime()) {
      this.setState({ error: "The chosen day is unavailable" });
      return false;
    }

    return true;
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
      const day = new Date(value);
      this.setState({ day });
    } else this.setState({ time: value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const { name, location, day, time, description } = this.state;

      const event = {
        name,
        location,
        day,
        time,
        description,
      };
      
      console.log(event)
      const eventId = this.props.eventId
      const token = isAuthenticated().token;

      update(eventId, token, event).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            name: "",
            location: "",
            error: "",
            description: "",
            loading: false,
            day: null,
            open: true,
            time: null,
          });
      });
    } else this.setState({ loading: false });
  };

  editForm = (name, location, description, day, time) => {
      
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
          <button onClick={this.clickSubmit} className="btn">
            Edit
          </button>
        </div>
      </form>
    );
  };

  render() {
    const {
      name,
      location,
      error,
      loading,
      description,
      day,
      time,
      open,
    } = this.state;
    
    
    
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 text-center">Edit an event</h2>
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
          Your event was successfully updated.
        </div>
        {loading ? (
          <div className="mt-4 mb-4 text-center">
          <h5>Loading...</h5>
        </div>
        ) : (
          ""
        )}

        {this.editForm(name, location,  description, day, time)}
      </div>
    );
  }
}

export default EditEvent;
