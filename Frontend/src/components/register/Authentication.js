import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";
import Sidebar from "./Sidebar";
import { getCountries, getCitiesByCountry } from "../../utils/apiLocations";
import { register } from "../../utils/auth";
import Select from "react-select";
import countryList from "react-select-country-list";

class Authentication extends Component {
  constructor(props) {
    super(props);

    this.options = countryList().getData();

    this.state = {
      options: this.options,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      error: "",
      homeland: "",
      open: false,
      country: null,
      city: null,
      countries: [],
      cities: [],
    };
  }

  // changeHandler = (name) => (event) => {
  //   this.setState({ [name]: event.target.value });
  //   console.log("dasdas");
  // };
  changeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ error: "" });
    this.setState({ [name]: value });
  };

  validSelection = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      homeland,
      country,
      city,
    } = this.state;

    if (firstName.length == 0) {
      this.setState({ error: "First Name is required" });
      return false;
    }
    if (lastName.length == 0) {
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
    if (homeland == null) {
      this.setState({ error: "please select your homeland" });
      return false;
    } else if (country == null) {
      this.setState({ error: "please select a country" });
      return false;
    } else if (city == null) {
      this.setState({ error: "please select a city" });
      return false;
    }
    return true;
  };
  clickSubmit = (event) => {
    event.preventDefault();

    if (this.validSelection()) {
      const {
        firstName,
        lastName,
        email,
        password,
        homeland,
        country,
        city,
      } = this.state;
      const user = {
        firstName,
        lastName,
        email,
        password,
        homeland,
        country,
        city,
      };
      register(user).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else
          this.setState({
            error: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            homeland: "",
            open: true,
            country: null,
            city: null,
          });
      });
    }
  };

  convertDataToSelect = (data) => {
    const selectData = [];

    data.forEach((element) =>
      selectData.push({ value: element, label: element, type: "city" })
    );
    return selectData;
  };

  componentDidMount() {
    getCountries().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          countries: this.convertDataToSelect(data),
        });
      }
    });
    // this.setState({countries:countryList().getData()})
    // console.log(countryList().getData())
  }

  getCities = (country) => {
    const { value } = country;
    this.setState({ country: value });
    getCitiesByCountry(value).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          cities: this.convertDataToSelect(data),
        });
      }
    });
  };

  setLocation = (location) => {
    const { label, type } = location;
    if (type == "city") this.setState({ city: label });
    else this.setState({ homeland: label });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      error,
      open,
      countries,
      cities,
    } = this.state;

    return (
      <div>
        <Sidebar />
        <div className="main-login">
          <div style={{ marginTop: "0px" }} className="login-form">
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
              Your new account was successfully created. Please log in.
            </div>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  onChange={this.changeHandler}
                  // controlId="formBasicEmail"

                  type="text"
                  name="firstName"
                  value={firstName}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  onChange={this.changeHandler}
                  type="text"
                  value={lastName}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  onChange={this.changeHandler}
                  type="password"
                  value={password}
                  placeholder="Enter password"
                />
              </Form.Group>
              {/* <FormGroup
                controlId="formBasicPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
              /> */}
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="text"
                  onChange={this.changeHandler}
                  value={email}
                  placeholder="Enter your email"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Homeland</Form.Label>
                <Select
                  options={this.state.options}
                  // value={this.state.value}
                  onChange={this.setLocation}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Country</Form.Label>
                <Select
                  options={countries}
                  // value={country}

                  onChange={this.getCities}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>City</Form.Label>
                <Select
                  options={cities}
                  // value={country}

                  onChange={this.setLocation}
                />
              </Form.Group>

              <Link to="/">
                <button type="submit" className="btn btn-black-auth">
                  Login
                </button>
              </Link>
              <button
                onClick={this.clickSubmit}
                // type="submit"
                style={{marginTop:"17px"}}
                className="btn btn-secondary-auth"
              >
                Register
              </button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Authentication;
