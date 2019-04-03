import React, { Component } from "react";
import styled from "styled-components";

import { TextField, Button } from "@material-ui/core";

import { AccountForm } from "./AccountForm";

const FormField = styled(TextField)`
  & + & {
    margin-top: 15px;
  }
`;

const FormButton = styled(Button)`
  && {
    margin-top: 30px;
  }
`;

const Form = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      ...this.props.user
    });
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

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
    fetch("/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(console.log);
  };

  render() {
    const {
      userssn,
      username,
      password,
      name,
      age,
      email,
      dob,
      phonenum,
      address,
      nationality
    } = this.state;

    return (
      <AccountForm
        userssn={userssn}
        disableUsername
        hidePassword
        username={username}
        password={password}
        name={name}
        age={age}
        email={email}
        dob={dob}
        phoneNum={phonenum}
        address={address}
        nationality={nationality}
        handleUsernameChange={this.handleUsernameChange}
        handlePasswordChange={this.handlePasswordChange}
        handleNameChange={this.handleNameChange}
        handleAgeChange={this.handleAgeChange}
        handleEmailChange={this.handleEmailChange}
        handleDobChange={this.handleDobChange}
        handlePhonenumChange={this.handlePhonenumChange}
        handleAddressChange={this.handleAddressChange}
        handleNationalityChange={this.handleNationalityChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

export default Profile;
