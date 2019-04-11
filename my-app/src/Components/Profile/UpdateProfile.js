import React, { Component } from "react";
import styled from "styled-components";

import { Paper } from "@material-ui/core";

import { AccountForm } from "../AccountForm";

const Box = styled(Paper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
`;

class UpdateProfile extends Component {
  constructor(props) {
    const { user } = props;

    super(props);
    this.state = { ...user };
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleAgeChange = event => {
    this.setState({ age: event.target.value });
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handleDobChange = event => {
    this.setState({ dob: event.target.value });
  };

  handlePhonenumChange = event => {
    this.setState({ phonenum: event.target.value });
  };

  handleAddressChange = event => {
    this.setState({ address: event.target.value });
  };

  handleNationalityChange = event => {
    this.setState({ nationality: event.target.value });
  };

  handleSubmit = () => {
    const { fetchUserDetail, user, handleShowDialog } = this.props;

    fetch("/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage) {
          handleShowDialog(data.errorMessage);
        } else {
          fetchUserDetail(user);
        }
      });
  };

  render() {
    const { userssn, username, name, age, email, dob, phonenum, address, nationality } = this.state;

    return (
      <Box>
        <AccountForm
          userssn={userssn}
          disableUsername
          username={username}
          name={name}
          age={age}
          email={email}
          dob={dob}
          phoneNum={phonenum}
          address={address}
          nationality={nationality}
          handleUsernameChange={this.handleUsernameChange}
          handleNameChange={this.handleNameChange}
          handleAgeChange={this.handleAgeChange}
          handleEmailChange={this.handleEmailChange}
          handleDobChange={this.handleDobChange}
          handlePhonenumChange={this.handlePhonenumChange}
          handleAddressChange={this.handleAddressChange}
          handleNationalityChange={this.handleNationalityChange}
          handleSubmit={this.handleSubmit}
        />
      </Box>
    );
  }
}

export default UpdateProfile;
