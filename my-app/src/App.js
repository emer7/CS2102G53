import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";

import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { AppBar, Toolbar as DefaultToolbar } from "@material-ui/core";
import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import { Button, IconButton } from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import DefaultAccountCircle from "@material-ui/icons/AccountCircle";

import Login from "./Components/Login";
import Register from "./Components/Register";
import Borrow from "./Components/Borrow";
import Lend from "./Components/Lend";
import Item from "./Components/Item";
import Profile from "./Components/Profile";
import Feedback from "./Components/Feedback";

const Toolbar = styled(DefaultToolbar)`
  display: flex;
  justify-content: space-between;
`;

const AccountCircle = styled(DefaultAccountCircle)`
  margin-right: 3px;
`;

const DrawerList = styled(List)`
  width: 250px;
`;

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
    this.handleCloseDrawer();
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
    fetch("/users/search/most/active/borrower")
      .then(res => res.json())
      .then(data => this.setState({ mostActiveRows: data }));

    fetch("/users/search/most/popular/loaner")
      .then(res => res.json())
      .then(data => this.setState({ mostPopularRows: data }));

    fetch("/users/search/most/positive/feedback")
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

  handleCloseDrawer = () => {
    this.setState({ openDrawer: false });
  };

  handleOpenDrawer = () => {
    this.setState({ openDrawer: true });
  };

  render() {
    const {
      isAuthenticated,
      user,
      mostActiveRows,
      mostPopularRows,
      mostFeedbackRows,
      openDrawer
    } = this.state;

    const drawerList = (
      <DrawerList>
        {!isAuthenticated && (
          <ListItem button component={Link} to="/profile" onClick={this.handleCloseDrawer}>
            <AccountCircle />
          </ListItem>
        )}
        {isAuthenticated && (
          <ListItem button component={Link} to="/profile" onClick={this.handleCloseDrawer}>
            <AccountCircle />
            <ListItemText primary={user ? `Hi, ${user.username}!` : "Profile"} />
          </ListItem>
        )}
        <ListItem button component={Link} to="/" onClick={this.handleCloseDrawer}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/lend" onClick={this.handleCloseDrawer}>
          <ListItemText primary="Lend" />
        </ListItem>
        <ListItem button component={Link} to="/borrow" onClick={this.handleCloseDrawer}>
          <ListItemText primary="Borrow" />
        </ListItem>
        <ListItem button component={Link} to="/feedback" onClick={this.handleCloseDrawer}>
          <ListItemText primary="Feedback" />
        </ListItem>
      </DrawerList>
    );

    return (
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
            <Right>
              {isAuthenticated && (
                <Button component={Link} to="/profile" color="inherit">
                  <AccountCircle />
                  {user ? user.username : "Profile"}
                </Button>
              )}
              {isAuthenticated && (
                <Button onClick={this.handleLogout} color="inherit">
                  Logout
                </Button>
              )}
              {!isAuthenticated && (
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
              )}
              {!isAuthenticated && (
                <Button component={Link} to="/register" color="inherit">
                  Register
                </Button>
              )}
            </Right>
          </Toolbar>
        </AppBar>

        <Drawer open={openDrawer} onClose={this.handleCloseDrawer}>
          {drawerList}
        </Drawer>

        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              isAuthenticated && (
                <Grid container spacing="8">
                  <Grid item xs sm md lg xl>
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
                  </Grid>
                  <Grid item xs sm md lg xl>
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
                  </Grid>
                  <Grid item xs sm md lg xl>
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
                  </Grid>
                </Grid>
              )
            }
          />
          <Route
            path="/lend"
            render={props =>
              isAuthenticated ? <Lend user={user} {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/borrow"
            render={props =>
              isAuthenticated ? <Borrow user={user} {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/feedback"
            render={props =>
              isAuthenticated ? <Feedback user={user} {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/item/:itemssn"
            render={props =>
              isAuthenticated ? <Item user={user} {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/profile"
            render={props =>
              isAuthenticated ? (
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
              <Login handleLogin={this.handleLogin} isAuthenticated={isAuthenticated} {...props} />
            )}
          />
          <Route path="/register" render={props => <Register {...props} />} />
        </Switch>
      </Router>
    );
  }
}

export default App;
