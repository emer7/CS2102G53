import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";

import Login from "./Components/Login";
import Register from "./Components/Register";
import Borrow from "./Components/Borrow";
import Lend from "./Components/Lend";
import Item from "./Components/Item";

const Navbar = styled.div`
  background-color: black;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const Navlink = styled(Link)`
  color: white;
  text-decoration: none;
  & + & {
    margin-left: 10px;
  }
`;

const Left = styled.div``;

const Right = styled.div``;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  handleLogin = ({ login, user }) => {
    this.setState({ isAuthenticated: login, user });
  };

  componentDidMount() {
    // this.authenticate();
  }

  authenticate = () => {
    fetch("http://localhost:5000/authenticate/check")
      .then(res => res.json())
      .then(data => this.setState({ isAuthenticated: data.login }));
  };

  render() {
    // const { user } = this.state;
    const user = { userSSN: 1, username: "mock" };

    return (
      <Router>
        <Navbar>
          <Left>
            <Navlink to="/">Home</Navlink>
            <Navlink to="/lend">Lend</Navlink>
            <Navlink to="/borrow">Borrow</Navlink>
          </Left>
          {this.state.isAuthenticated ? (
            <Navlink to="/profile">{user ? `Hi, ${user.username}!` : "Profile"}</Navlink>
          ) : (
            <Right>
              <Navlink to="/login">Login</Navlink>
              <Navlink to="/register">Register</Navlink>
            </Right>
          )}
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
          <Route path="/item/:itemSSN" render={props => <Item user={user} {...props} />} />
        </Switch>
      </Router>
    );
  }
}

const Profile = () => <h1>Profile</h1>;

export default App;
