import React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const FormField = styled(TextField)`
  margin-top: 15px;
`;

const FormButton = styled(Button)`
  margin-top: 15px;
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
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => (
  <Form>
    <h1>{type}</h1>
    <FormField name="username" label="Username" value={username} onChange={handleUsernameChange} />
    <FormField name="password" label="Password" value={password} onChange={handlePasswordChange} />
    <FormButton variant="contained" fullWidth onClick={handleSubmit}>
      Submit
    </FormButton>
  </Form>
);
