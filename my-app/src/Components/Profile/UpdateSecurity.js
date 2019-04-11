import React, { Component } from "react";
import styled from "styled-components";

import { Paper } from "@material-ui/core";

import { AccountForm } from "../AccountForm";

const Box = styled(Paper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
`;

class UpdateSecurity extends Component {
  constructor(props) {
    const { user } = props;

    super(props);
    this.state = { ...user };
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = () => {
    const { history, handleShowDialog } = this.props;

    fetch("/users/update/password", {
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
          history.push("/");
        }
      });
  };

  handleDeleteAccount = () => {
    const { user, history, handleLogin } = this.props;
    const { userssn } = user;

    fetch(`/users/delete/${userssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        handleLogin({ login: false });
        history.push("/");
      });
  };

  render() {
    const { password } = this.state;  

    return (
      <Box>
        <AccountForm
          hideUsername
          password={password}
          handlePasswordChange={this.handlePasswordChange}
          handleSubmit={this.handleSubmit}
          handleDeleteAccount={this.handleDeleteAccount}
        />
      </Box>
    );
  }
}

export default UpdateSecurity;
