import React from "react";
import styled from "styled-components";

import { Grid } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";

import { Form } from "./Constants";

const Title = styled.div`
  text-align: center;
  font-size: 2em;
  font-weight: bold;
`;

export const AccountForm = ({
  type,
  userssn,
  hideUsername,
  disableUsername,
  username,
  password,
  name,
  age,
  email,
  dob,
  phonenum,
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
  handleSubmit,
  handleDeleteAccount
}) => (
  <Form>
    <Grid container direction="column" spacing="16">
      {type && (
        <Grid item xs sm md lg xl>
          <Title>{type}</Title>
        </Grid>
      )}
      {(userssn || !hideUsername || handlePasswordChange) && (
        <Grid item xs sm md lg xl>
          <Grid container spacing="16" direction="column">
            {userssn && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="userssn"
                  label="User SNN"
                  InputLabelProps={{ shrink: !!userssn }}
                  variant="outlined"
                  fullWidth
                  value={userssn}
                  disabled
                />
              </Grid>
            )}

            {!hideUsername && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="username"
                  label="Username"
                  disabled={disableUsername}
                  InputLabelProps={{ shrink: !!username }}
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={handleUsernameChange}
                />
              </Grid>
            )}

            {handlePasswordChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  InputLabelProps={{ shrink: !!password }}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      {(handleNameChange || handleEmailChange) && (
        <Grid item xs sm md lg xl>
          <Grid container spacing="8">
            {handleNameChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="name"
                  label="Name"
                  InputLabelProps={{ shrink: !!name }}
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={handleNameChange}
                />
              </Grid>
            )}
            {handleEmailChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  InputLabelProps={{ shrink: !!email }}
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      {(handleDobChange || handleAgeChange) && (
        <Grid item xs sm md lg xl>
          <Grid container spacing="8">
            {handleDobChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  value={dob}
                  onChange={handleDobChange}
                />
              </Grid>
            )}
            {handleAgeChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="age"
                  label="Age"
                  type="number"
                  InputLabelProps={{ shrink: !!age }}
                  variant="outlined"
                  fullWidth
                  value={age}
                  onChange={handleAgeChange}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      {(handlePhonenumChange || handleAddressChange || handleNationalityChange) && (
        <Grid item xs sm md lg xl>
          <Grid container spacing="8">
            {handlePhonenumChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="phonenum"
                  label="Phone Number"
                  InputLabelProps={{ shrink: !!phonenum }}
                  variant="outlined"
                  fullWidth
                  value={phonenum}
                  onChange={handlePhonenumChange}
                />
              </Grid>
            )}
            {handleAddressChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="address"
                  label="Address"
                  InputLabelProps={{ shrink: !!address }}
                  variant="outlined"
                  fullWidth
                  value={address}
                  onChange={handleAddressChange}
                />
              </Grid>
            )}
            {handleNationalityChange && (
              <Grid item xs sm md lg xl>
                <TextField
                  name="nationality"
                  label="Nationality"
                  InputLabelProps={{ shrink: !!nationality }}
                  variant="outlined"
                  fullWidth
                  value={nationality}
                  onChange={handleNationalityChange}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      <Grid item xs sm md lg xl>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
      {handleDeleteAccount && (
        <Grid item xs sm md lg xl>
          <Button variant="text" color="secondary" fullWidth onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Grid>
      )}
    </Grid>
  </Form>
);
