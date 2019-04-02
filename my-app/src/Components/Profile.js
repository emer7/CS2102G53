import React, { Component } from "react";
import styled from "styled-components";

import { TextField, Button } from "@material-ui/core";

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
    console.log(this.state)
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
      <Form>
        <FormField
          name="userSSN"
          label="userSSN"
          InputLabelProps={{ shrink: true }}
          value={userssn}
          disabled
        />
        <FormField
          name="username"
          label="Username"
          InputLabelProps={{ shrink: true }}
          value={username}
          disabled
        />
        <FormField
          name="password"
          label="Password"
          InputLabelProps={{ shrink: true }}
          value={password}
          onChange={this.handlePasswordChange}
        />
        <FormField
          name="name"
          label="Name"
          InputLabelProps={{ shrink: true }}
          value={name}
          onChange={this.handleNameChange}
        />
        <FormField
          name="age"
          label="Age"
          type="number"
          InputLabelProps={{ shrink: true }}
          value={age}
          onChange={this.handleAgeChange}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          InputLabelProps={{ shrink: true }}
          value={email}
          onChange={this.handleEmailChange}
        />
        <FormField
          name="dob"
          label="Date of Birth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={this.handleDobChange}
        />
        <FormField
          name="phoneNum"
          label="Phone Number"
          InputLabelProps={{ shrink: true }}
          value={phonenum}
          onChange={this.handlePhonenumChange}
        />
        <FormField
          name="address"
          label="Address"
          InputLabelProps={{ shrink: true }}
          value={address}
          onChange={this.handleAddressChange}
        />
        <FormField
          name="nationality"
          label="Nationality"
          InputLabelProps={{ shrink: true }}
          value={nationality}
          onChange={this.handleNationalityChange}
        />
        <FormButton variant="contained" fullWidth onClick={this.handleSubmit}>
          Submit
        </FormButton>
      </Form>
    );
  }
}

export default Profile;
