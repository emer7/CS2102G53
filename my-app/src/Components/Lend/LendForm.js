import React, { Component } from "react";
import styled from "styled-components";

import { Grid } from "@material-ui/core";

import { Box as BaseBox, Form } from "../Constants";
import { TextField, Button } from "@material-ui/core";

const Box = styled(BaseBox)`
  width: 500px;
`;

class LendForm extends Component {
  constructor(props) {
    const { handleTabChange } = props;

    super(props);
    this.state = {};
    handleTabChange(undefined, 0);
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  };

  handleMinBidPriceChange = event => {
    this.setState({ minbidprice: event.target.value });
  };

  handleLoandDurationChange = event => {
    this.setState({ loandurationindays: event.target.value });
  };

  handleSubmit = () => {
    const { name, description, minbidprice, loandurationindays } = this.state;
    const { user, history, handleShowDialog } = this.props;
    const { userssn } = user;
    const itemObject = {
      userssn,
      name,
      description,
      minbidprice: minbidprice || undefined,
      loandurationindays: loandurationindays || undefined
    };

    fetch("/items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itemObject)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage) {
          handleShowDialog(data.errorMessage);
        } else {
          history.push("/lend/available");
        }
      });
  };

  render() {
    const { name, description, minbidprice, loandurationindays } = this.state;

    return (
      <Box>
        <Form>
          <Grid container direction="column" spacing={16}>
            <Grid item xs sm md lg xl>
              <TextField
                name="name"
                label="Item name"
                fullWidth
                value={name}
                onChange={this.handleNameChange}
              />
            </Grid>
            <Grid item xs sm md lg xl>
              <TextField
                name="description"
                label="Item description"
                multiline
                fullWidth
                value={description}
                onChange={this.handleDescriptionChange}
              />
            </Grid>
            <Grid item xs sm md lg xl>
              <TextField
                name="minBidPrice"
                type="number"
                label="Minimum bid price"
                placeholder="0"
                InputProps={{ inputProps: { min: "0" } }}
                fullWidth
                value={minbidprice}
                onChange={this.handleMinBidPriceChange}
              />
            </Grid>
            <Grid item xs sm md lg xl>
              <TextField
                name="loanDuration"
                type="number"
                label="Loan Duration in Days"
                placeholder="0"
                InputProps={{ inputProps: { min: "0" } }}
                fullWidth
                value={loandurationindays}
                onChange={this.handleLoandDurationChange}
              />
            </Grid>
            <Grid item xs sm md lg xl>
              <Button variant="contained" color="primary" fullWidth onClick={this.handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Box>
    );
  }
}

export default LendForm;
