import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import { Paper, Tabs, Tab } from "@material-ui/core";

import UpdateProfile from "./Profile/UpdateProfile";
import UpdateSecurity from "./Profile/UpdateSecurity";
import History from "./Profile/History";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { tabValue: false };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  render() {
    const { tabValue } = this.state;
    const { user, handleLogin, fetchUserDetail, handleShowDialog } = this.props;

    return (
      <React.Fragment>
        <Paper>
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleTabChange}
            centered
          >
            <Tab label="Update Profile" component={Link} to="/profile/update" />
            <Tab label="Update Security" component={Link} to="/profile/security" />
            <Tab label="Transaction History" component={Link} to="/profile/history" />
          </Tabs>
        </Paper>

        <Route
          path="/profile/update"
          render={props => (
            <UpdateProfile
              user={user}
              fetchUserDetail={fetchUserDetail}
              handleShowDialog={handleShowDialog}
              handleTabChange={this.handleTabChange}
              {...props}
            />
          )}
        />
        <Route
          path="/profile/security"
          render={props => (
            <UpdateSecurity
              user={user}
              handleLogin={handleLogin}
              handleShowDialog={handleShowDialog}
              handleTabChange={this.handleTabChange}
              {...props}
            />
          )}
        />
        <Route
          path="/profile/history"
          render={props => (
            <History user={user} handleTabChange={this.handleTabChange} {...props} />
          )}
        />
      </React.Fragment>
    );
  }
}

export default Profile;
