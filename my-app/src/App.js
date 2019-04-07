import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";

import Login from "./Components/Login";
import Register from "./Components/Register";
import Borrow from "./Components/Borrow";
import Lend from "./Components/Lend";
import Item from "./Components/Item";
import Profile from "./Components/Profile";
import Feedback from "./Components/Feedback";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

const Navbar = styled.div`
  background-color: black;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const Navlink = styled(Link)`
  color: white;
  text-decoration: none;
  & + * {
    margin-left: 10px;
  }
`;

const LogoutLink = styled.span`
  color: white;
  cursor: pointer;
`;

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const Left = styled.div``;

const Right = styled.div``;

class App extends Component {
  constructor(props) {
    const user = {};
    const mostActiveRows = [];
    const mostPopularRows = [];
    const mostFeedbackRows = [];

    super(props);
    this.state = {
      isAuthenticated: false,
      user,
      mostActiveRows,
      mostPopularRows,
      mostFeedbackRows
    };
  }

  componentDidMount() {
    this.fetchResources();
  }

  handleLogin = ({ login, user }) => {
    this.setState({ isAuthenticated: login, user });
    user && this.fetchUserDetail(user);
  };

  handleLogout = () => {
    fetch("/authenticate/logout", {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => data && this.setState({ isAuthenticated: data.login, user: undefined }));
  };

  fetchUserDetail = user => {
    const { userssn } = user;

    fetch(`/users/detail/${userssn}`)
      .then(res => res.json())
      .then(data => this.setUserDetail(data));
  };

  fetchResources = () => {
    fetch("/users/search/most_active")
      .then(res => res.json())
      .then(data => this.setState({ mostActiveRows: data }));

    fetch("/users/view/loaner/most_popular")
      .then(res => res.json())
      .then(data => this.setState({ mostPopularRows: data }));

    fetch("/users/search/most_positive")
      .then(res => res.json())
      .then(data => this.setState({ mostFeedbackRows: data }));
  };

  setUserDetail = user => {
    const { dob } = user;
    const dobDate = new Date(dob);
    const transformedDob = new Date(dobDate - dobDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const transformedUser = { ...user, dob: dob ? transformedDob : undefined };

    this.setState({ user: transformedUser });
  };

  render() {
    const { user, mostActiveRows, mostPopularRows, mostFeedbackRows } = this.state;

    return (
      <Router>
        <Navbar>
          <Left>
            <Navlink to="/">Home</Navlink>
            <Navlink to="/lend">Lend</Navlink>
            <Navlink to="/borrow">Borrow</Navlink>
            <Navlink to="/feedback">Feedback</Navlink>
          </Left>
          {this.state.isAuthenticated ? (
            <Right>
              <Navlink to="/profile">{user ? `Hi, ${user.username}!` : "Profile"}</Navlink>
              <LogoutLink onClick={this.handleLogout}>Logout</LogoutLink>
            </Right>
          ) : (
            <Right>
              <Navlink to="/login">Login</Navlink>
              <Navlink to="/register">Register</Navlink>
            </Right>
          )}
        </Navbar>

        {this.state.isAuthenticated && (
          <Divider>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Most Active Borrower</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostActiveRows.map(row => (
                  <TableRow key={row.username} hover>
                    <TableCell align="center">{row.username}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Most Popular Loaner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostPopularRows.map(row => (
                  <TableRow key={row.username} hover>
                    <TableCell align="center">{row.username}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Most Positive Feedback User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostFeedbackRows.map(row => (
                  <TableRow key={row.username} hover>
                    <TableCell align="center">{row.username}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Divider>
        )}

        <Switch>
          <Route
            path="/lend"
            render={props =>
              this.state.isAuthenticated ? (
                <Lend user={user} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/borrow"
            render={props =>
              this.state.isAuthenticated ? (
                <Borrow user={user} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/feedback"
            render={props =>
              this.state.isAuthenticated ? (
                <Feedback user={user} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/item/:itemssn"
            render={props =>
              this.state.isAuthenticated ? (
                <Item user={user} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            render={props =>
              this.state.isAuthenticated ? (
                <Profile
                  user={user}
                  handleLogin={this.handleLogin}
                  fetchUserDetail={this.fetchUserDetail}
                  {...props}
                />
              ) : (
                <Redirect to="/login" />
              )
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

export default App;
