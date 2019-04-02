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
    <Title>{type}</Title>
    <FormField name="username" label="Username" value={username} onChange={handleUsernameChange} />
    <FormField name="password" label="Password" value={password} onChange={handlePasswordChange} />
    {handleNameChange && (
      <FormField name="name" label="Name" value={name} onChange={handleNameChange} />
    )}
    {handleAgeChange && (
      <FormField name="age" label="Age" type="number" value={age} onChange={handleAgeChange} />
    )}
    {handleEmailChange && (
      <FormField
        name="email"
        label="Email"
        type="email"
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
        value={phoneNum}
        onChange={handlePhonenumChange}
      />
    )}
    {handleAddressChange && (
      <FormField name="address" label="Address" value={address} onChange={handleAddressChange} />
    )}
    {handleNationalityChange && (
      <FormField
        name="nationality"
        label="Nationality"
        value={nationality}
        onChange={handleNationalityChange}
      />
    )}
    <FormButton variant="contained" fullWidth onClick={handleSubmit}>
      Submit
    </FormButton>
  </Form>
);
