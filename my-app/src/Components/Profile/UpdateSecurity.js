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
    fetch("/users/update/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(console.log);
  };

  handleDeleteAccount = () => {
    const { user, history, handleLogin } = this.props;
    const { userssn } = user;

    fetch(`/users/delete/${userssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(console.log);

    handleLogin({ login: false });

    history.push("/");
  };

  render() {
    const { password } = this.state;

    return (
      <div>
        <AccountForm
          password={password}
          handlePasswordChange={this.handlePasswordChange}
          handleSubmit={this.handleSubmit}
        />
        <Button variant="contained" fullWidth onClick={this.handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    );
  }
}

export default UpdateSecurity;
