import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/register/Login";
import Authentication from "./components/register/Authentication";
import MainPage from "./components/mainPage/MainPage";

import "./App.css";

class MainRouter extends Component {
  render() {
    return (
      <Router>
        {/* The exact param disables the partial matching for a route and makes
          sure that it only returns the route if the path is an EXACT match to the
          current url. */}
        <Route path="/" exact component={Login} />
        <Route path="/authentication" component={Authentication} />
        <Route path="/menu" component={MainPage} />
        <Route exact path="/user/:userId" component={MainPage} />
        <Route exact path="/users" component={MainPage} />
        <Route exact path="/user/edit/:userId" component={MainPage} />
        <Route exact path="/findpeople" component={MainPage} />
        <Route exact path="/event/add" component={MainPage} />
        <Route exact path="/event/edit/:eventId" component={MainPage} />
        <Route exact path="/events" component={MainPage} />
        <Route path="/your_events" component={MainPage} />
        <Route exact path="/post/:postId" component={MainPage} />
        <Route exact path="/post/edit/:postId" component={MainPage} />
        <Route path="/notifications" component={MainPage} />
      </Router>
    );
  }
}

export default MainRouter;
