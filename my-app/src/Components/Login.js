import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import { Paper } from "@material-ui/core";

import { AccountForm } from "./AccountForm";

const Box = styled(Paper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
`;

class Login extends Component {
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

  handleSubmit = () => {
    const { handleLogin, handleShowDialog } = this.props;

    fetch("/authenticate/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage || data.message === "Missing credentials") {
          handleShowDialog(data.errorMessage || data.message);
        } else {
          handleLogin(data);
        }
      });
  };

  render() {
    const { match, isAuthenticated } = this.props;
    const { username, password } = this.state;

    return (
      <Box>
        <Route
          path={`${match.path}`}
          render={() =>
            isAuthenticated ? (
              <Redirect to="/" />
            ) : (
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={this.handleUsernameChange}
                handlePasswordChange={this.handlePasswordChange}
                handleSubmit={this.handleSubmit}
              />
            )
          }
        />
      </Box>
    );
  }
}

const LoginForm = props => <AccountForm type="Login" {...props} />;

export default Login;
