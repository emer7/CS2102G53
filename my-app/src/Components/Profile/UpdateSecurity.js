import React, { Component } from "react";

import { Button } from "@material-ui/core";

import { AccountForm } from "../AccountForm";

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
      <div>
        <AccountForm
          hideUsername
          password={password}
          handlePasswordChange={this.handlePasswordChange}
          handleSubmit={this.handleSubmit}
        />
        <Button variant="contained" color="secondary" fullWidth onClick={this.handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    );
  }
}

export default UpdateSecurity;
