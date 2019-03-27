import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from "styled-components";

import "./App.css";

import { Users } from "./Components/Users";
import { Profile } from "./Components/Profile";
import { Login } from "./Components/Login";

const Navbar = styled.div`
  background-color: black;
  padding: 10px;
`;

const Navlink = styled(Link)`
  color: white;
  text-decoration: none;
`;

class App extends Component {
  state = {};

  componentDidMount() {
    fetch("http://localhost:5000/users").then(data =>
      data.json().then(data => {
        this.setState({
          data: data.slice(0, 1)
        });
      })
    );
  }

  onClick() {
    fetch("http://localhost:5000/users").then(data =>
      data.json().then(data => {
        this.setState({
          data
        });
      })
    );
  }

  render() {
    return (
      <Router>
        <Navbar>
          <Navlink to="/profile">Profile</Navlink>
          <Navlink to="/login">Login</Navlink>
        </Navbar>
        <Users onClick={this.onClick.bind(this)} users={this.state.data || []} />

        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
      </Router>
    );
  }
}

export default App;
