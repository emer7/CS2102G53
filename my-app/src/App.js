import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";

import { AppBar, Toolbar as BaseToolbar } from "@material-ui/core";
import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import { Button, IconButton } from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import DefaultAccountCircle from "@material-ui/icons/AccountCircle";

import Statistics from "./Components/Statistics";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Borrow from "./Components/Borrow";
import Lend from "./Components/Lend";
import Item from "./Components/Item";
import Profile from "./Components/Profile";
import Feedback from "./Components/Feedback";
import Dialog from "./Components/Dialog";

const Toolbar = styled(BaseToolbar)`
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

    super(props);
    this.state = {
      isAuthenticated: false,
      user,
      showDialog: false
    };
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

  setUserDetail = user => {
    const { dob } = user;
    const dobDate = new Date(dob || null);
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

  handleCloseDialog = () => {
    this.setState({ showDialog: false });
  };

  handleShowDialog = message => {
    this.setState({ showDialog: true, dialogMessage: message });
  };

  render() {
    const { isAuthenticated, user, openDrawer, showDialog, dialogMessage } = this.state;

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

        <Dialog
          showDialog={showDialog}
          dialogMessage={dialogMessage}
          handleCloseDialog={this.handleCloseDialog}
        />

        <Switch>
          <Route exact path="/" render={() => isAuthenticated && <Statistics />} />
          <Route
            path="/lend"
            render={props =>
              isAuthenticated ? (
                <Lend user={user} handleShowDialog={this.handleShowDialog} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/borrow"
            render={props =>
              isAuthenticated ? (
                <Borrow user={user} handleShowDialog={this.handleShowDialog} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/feedback"
            render={props =>
              isAuthenticated ? (
                <Feedback user={user} handleShowDialog={this.handleShowDialog} {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/item/:itemssn"
            render={props =>
              isAuthenticated ? (
                <Item user={user} handleShowDialog={this.handleShowDialog} {...props} />
              ) : (
                <Redirect to="/login" />
              )
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
                  handleShowDialog={this.handleShowDialog}
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
                isAuthenticated={isAuthenticated}
                handleShowDialog={this.handleShowDialog}
                {...props}
              />
            )}
          />
          <Route
            path="/register"
            render={props => <Register handleShowDialog={this.handleShowDialog} {...props} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
