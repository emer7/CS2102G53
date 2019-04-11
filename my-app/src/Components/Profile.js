import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import { Tabs, Tab } from "@material-ui/core";

import UpdateProfile from "./Profile/UpdateProfile";
import UpdateSecurity from "./Profile/UpdateSecurity";
import History from "./Profile/History";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ value: false });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { user, handleLogin, fetchUserDetail } = this.props;

    return (
      <div>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
          centered
        >
          <Tab label="Update Profile" component={Link} to="/profile/update" />
          <Tab label="Update Security" component={Link} to="/profile/security" />
          <Tab label="Transaction History" component={Link} to="/profile/history" />
        </Tabs>

        <Route
          path="/profile/update"
          render={props => (
            <UpdateProfile user={user} fetchUserDetail={fetchUserDetail} {...props} />
          )}
        />
        <Route
          path="/profile/security"
          render={props => <UpdateSecurity user={user} handleLogin={handleLogin} {...props} />}
        />
        <Route path="/profile/history" render={props => <History user={user} {...props} />} />
      </div>
    );
  }
}

export default Profile;
