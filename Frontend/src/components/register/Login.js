import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";
import Sidebar from "./Sidebar";
import { signIn } from "../../utils/auth";
import { getPhoto } from "../../utils/api";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      reader: null,
      redirectToReferer: false,
      loading: false,
    };
  }

  changeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ error: "" });
    this.setState({ [name]: value });
  };

  isValid = () => {
    const { email } = this.state;
    if (email.length === 0) {
      this.setState({ error: "Email is required" });
      return false;
    }

    return true;
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    if (this.isValid()) {
      signIn(user).then((data) => {
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          localStorage.setItem("jwt", JSON.stringify(data));
          this.setState({ redirectToReferer: true });
          }
         
  });
      }
  };

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;
    if (redirectToReferer) {
      return <Redirect to="/menu" />;
    }

    return (
      <div>
        <Sidebar />
        <div className="main-login">
          <div className="login-form">
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

            <Form>
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

              <button onClick={this.clickSubmit} className="btn btn-black">
                Login
              </button>

              <Link to="/authentication">
                <button type="submit" className="btn btn-secondary">
                  Register
                </button>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
