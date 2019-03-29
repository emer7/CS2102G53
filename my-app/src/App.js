import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, NavLink, Switch } from "react-router-dom";
import styled from "styled-components";

import Login from "./Components/Login";
import Register from "./Components/Register";

const Navbar = styled.div`
  background-color: black;
  padding: 10px;
`;

const Navlink = styled(Link)`
  color: white;
  text-decoration: none;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  handleLogin = (login) => {
    this.setState({ isAuthenticated: login });
  };

  componentDidMount() {
    this.authenticate();
  }

  authenticate = () => {
    fetch("http://localhost:5000/authenticate/check")
      .then(res => res.json())
      .then(data => this.setState({ isAuthenticated: data.login }));
  };

  render() {
    return (
      <Router>
        <Navbar>
          <NavLink to="/">Home</NavLink>
          <Navlink to="/lend">Lend</Navlink>
          <Navlink to="/borrow">Borrow</Navlink>
          <Navlink to="/profile">Profile</Navlink>
          <Navlink to="/login">Login</Navlink>
          <Navlink to="/register">Register</Navlink>
        </Navbar>

        <Switch>
          <Route
            path="/lend"
            render={props =>
              this.state.isAuthenticated ? <Lend {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/borrow"
            render={props =>
              this.state.isAuthenticated ? <Borrow {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/profile"
            render={props =>
              this.state.isAuthenticated ? <Profile {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/login"
            render={props => (
              <Login
                handleLogin={this.handleLogin}
                isAuthenticated={this.state.isAuthenticated}
                {...props}
              />
            )}
          />
          <Route path="/register" render={props => <Register {...props} />} />
        </Switch>
      </Router>
    );
  }
}

const Lend = () => <h1>Lend</h1>;
const Borrow = () => <h1>Borrow</h1>;
const Profile = () => <h1>Profile</h1>;

export default App;
