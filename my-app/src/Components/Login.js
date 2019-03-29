import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import { AccountForm } from "./AccountForm";

const Box = styled.div`
  box-shadow: 0 2px 16px 0 rgba(198, 198, 198, 0.5);
  border-width: 5px;
  border-radius: 30px;
  width: 400px;
  height: 600px;

  position: absolute;
  top: 50%;
  left: 50%;

  margin: -320px 0 0 -220px;

  display: flex;
  flex-direction: column;
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

  handleSubmit = event => {
    event.preventDefault();
    fetch("http://localhost:5000/authenticate/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.props.hasLoggedIn();
          console.log(this.props.isAuthenticated);
        }
      });
  };

  render() {
    const { match, isAuthenticated } = this.props;
    const { username, password } = this.state;

    return (
      <Box>
        <Switch>
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
        </Switch>
      </Box>
    );
  }
}

const LoginForm = props => <AccountForm type={"Login"} {...props} />;

export default Login;
