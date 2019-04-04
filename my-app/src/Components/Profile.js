import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import styled from "styled-components";

import UpdateProfile from "./Profile/UpdateProfile";
import UpdateSecurity from "./Profile/UpdateSecurity";

const Navbar = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const Navlink = styled(Link)`
  color: black;
  text-decoration: none;
  & + * {
    margin-left: 10px;
  }
`;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, handleLogin, fetchUserDetail } = this.props;

    return (
      <div>
        <Navbar>
          <Navlink to="/profile/update">Update Profile</Navlink>
          <Navlink to="/profile/security">Update Security</Navlink>
        </Navbar>

        <Route path="/profile/update" render={props => <UpdateProfile user={user} fetchUserDetail={fetchUserDetail} {...props} />} />
        <Route
          path="/profile/security"
          render={props => <UpdateSecurity user={user} handleLogin={handleLogin} {...props} />}
        />
      </div>
    );
  }
}

export default Profile;
