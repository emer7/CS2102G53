import React, { Component } from "react";
import styled from "styled-components";

import { AccountForm } from "../AccountForm";
import { Box as BaseBox } from "../Constants";

const Box = styled(BaseBox)`
  width: 400px;
`;

class UpdateSecurity extends Component {
  constructor(props) {
    const { handleTabChange } = props;

    super(props);
    this.state = {};
    handleTabChange(undefined, 1);
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = () => {
    const { user, history, handleShowDialog } = this.props;
    const { password } = this.state;
    const { userssn } = user;
    const passwordObject = { password, userssn };

    fetch("/users/update/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(passwordObject)
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
