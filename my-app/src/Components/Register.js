import React, { Component } from "react";
import { Route } from "react-router-dom";
import styled from "styled-components";

import { AccountForm } from "./AccountForm";
import { Box as BaseBox } from "./Constants";

const Box = styled(BaseBox)`
  width: 500px;
`;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };

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
    const { history, handleShowDialog } = this.props;
    const {
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
    const userObject = {
      username,
      password,
      name,
      age,
      email,
      dob,
      phonenum,
      address,
      nationality
    };

    fetch("/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userObject)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage) {
          handleShowDialog(data.errorMessage);
        } else {
          history.push("/login");
        }
      });
  };

  render() {
    const { match } = this.props;
    const {
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
      <Box>
        <Route
          path={`${match.path}`}
          render={() => (
            <RegistrationForm
              username={username}
              password={password}
              name={name}
              age={age}
              email={email}
              dob={dob}
              phonenum={phonenum}
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
          )}
        />
      </Box>
    );
  }
}

const RegistrationForm = props => <AccountForm type="Register" {...props} />;

export default Register;
