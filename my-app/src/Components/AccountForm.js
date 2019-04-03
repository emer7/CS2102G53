import React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Title = styled.div`
  text-align: center;
  font-size: 2em;
  font-weight: bold;
`;

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

export const AccountForm = ({
  type,
  userssn,
  disableUsername,
  hidePassword,
  username,
  password,
  name,
  age,
  email,
  dob,
  phoneNum,
  address,
  nationality,
  handleUsernameChange,
  handlePasswordChange,
  handleNameChange,
  handleAgeChange,
  handleEmailChange,
  handleDobChange,
  handlePhonenumChange,
  handleAddressChange,
  handleNationalityChange,
  handleSubmit
}) => (
  <Form>
    {type && <Title>{type}</Title>}
    {userssn && (
      <FormField
        name="userSSN"
        label="User SNN"
        InputLabelProps={{ shrink: !!userssn }}
        value={userssn}
        disabled
      />
    )}
    <FormField
      name="username"
      label="Username"
      disabled={disableUsername}
      InputLabelProps={{ shrink: !!username }}
      value={username}
      onChange={handleUsernameChange}
    />
    {!hidePassword && (
      <FormField
        name="password"
        label="Password"
        type="password"
        InputLabelProps={{ shrink: !!password }}
        value={password}
        onChange={handlePasswordChange}
      />
    )}
    {handleNameChange && (
      <FormField
        name="name"
        label="Name"
        InputLabelProps={{ shrink: !!name }}
        value={name}
        onChange={handleNameChange}
      />
    )}
    {handleAgeChange && (
      <FormField
        name="age"
        label="Age"
        type="number"
        InputLabelProps={{ shrink: !!age }}
        value={age}
        onChange={handleAgeChange}
      />
    )}
    {handleEmailChange && (
      <FormField
        name="email"
        label="Email"
        type="email"
        InputLabelProps={{ shrink: !!email }}
        value={email}
        onChange={handleEmailChange}
      />
    )}
    {handleDobChange && (
      <FormField
        name="dob"
        label="Date of Birth"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dob}
        onChange={handleDobChange}
      />
    )}
    {handlePhonenumChange && (
      <FormField
        name="phoneNum"
        label="Phone Number"
        InputLabelProps={{ shrink: !!phoneNum }}
        value={phoneNum}
        onChange={handlePhonenumChange}
      />
    )}
    {handleAddressChange && (
      <FormField
        name="address"
        label="Address"
        InputLabelProps={{ shrink: !!address }}
        value={address}
        onChange={handleAddressChange}
      />
    )}
    {handleNationalityChange && (
      <FormField
        name="nationality"
        label="Nationality"
        InputLabelProps={{ shrink: !!nationality }}
        value={nationality}
        onChange={handleNationalityChange}
      />
    )}
    <FormButton variant="contained" fullWidth onClick={handleSubmit}>
      Submit
    </FormButton>
  </Form>
);
