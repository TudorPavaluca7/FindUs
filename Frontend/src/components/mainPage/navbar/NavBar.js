import React, { Component } from "react";
import { Navbar, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../utils/auth";
import { getUsers, removeNotifications } from "../../../utils/api";
import "./NavBar.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferer: false,
      redirectToUser: false,
      user: "",
      users: [],
    };
  }

  clickSubmit = () => {
    removeNotifications().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        localStorage.removeItem("jwt");
        localStorage.removeItem("picture");
        this.setState({ redirectToReferer: true });
      }
    });
  };

  componentDidMount() {
    const userId = isAuthenticated().user._id;

    getUsers(userId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setUserNames(data);
      }
    });
  }

  setUserNames = (data) => {
    const users = [];
    data.forEach((data) => {
      users.push({ id: data._id, name: data.firstName + " " + data.lastName });
    });

    this.setState({ users: users });
  };

  getUser = (event) => {
    const { value } = event.target;

    this.setState({ user: value });
  };

  handleSubmit = (event) => {
    this.setState({ redirectToUser: true });
  };

  handleChange = (event, value) => {
    this.setState({ user: value });
  };

  render() {
    const { user, users, redirectToReferer, redirectToUser } = this.state;
    if (redirectToReferer) {
      return <Redirect to="/" />;
    }

    if (redirectToUser) {
      return <Redirect to={`/user/${user.id}`} />;
    }

    const style = { color: "inherit", textDecoration: "none" };

    // const style = {
    //   marginLeft: "300px",
    //   width: "150px !important",
    // };
    return (
      <Navbar className="navbar sticky-top " bg="dark" variant="dark">
        <Link style={style} to="/menu">
          <div className="name name-prop" style={{ cursor: "pointer" }}>
            Find Us
          </div>
        </Link>
        <Form inline onSubmit={this.handleSubmit}>
          <Autocomplete
            id="combo-box-demo"
            options={users}
            getOptionLabel={(option) => option.name}
            style={{
              marginLeft: "390px",
              backgroundColor: "white",
              width: 300,
            }}
            onChange={this.handleChange}
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
          />
        </Form>
        <div className="name sign-out" onClick={this.clickSubmit}>
          Sign out
        </div>
      </Navbar>
    );
  }
}

export default NavBar;

{
  /* <Autocomplete
            id="combo-box-demo"
            options={this.state.users}
            className="search-bar"
            value={this.state.user}
            placeholder="Search"
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
            onChange={this.getUser}
          /> */
}
