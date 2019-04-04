import React, { Component } from "react";
import styled from "styled-components";

import { FormField, FormButton, Form } from "../Constants";

class LendForm extends Component {
  // Lent items
  // To lend item
  // if Lent, click will show the winning bid and time
  // if not lent, then see the current bid

  constructor(props) {
    super(props);
    this.state = {};
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
    const { user, history } = this.props;
    const { userssn } = user;

    fetch("/items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...this.state, userssn })
    })
      .then(res => res.json())
      .then(console.log);

    history.push("/lend/available");
  };

  render() {
    const { name, description, minbidprice, loandurationindays } = this.state;

    return (
      <div>
        <Form>
          <FormField name="name" label="Name" value={name} onChange={this.handleNameChange} />
          <FormField
            name="description"
            label="Description"
            value={description}
            onChange={this.handleDescriptionChange}
          />
          <FormField
            name="minBidPrice"
            type="number"
            label="Minimum bid price"
            value={minbidprice}
            onChange={this.handleMinBidPriceChange}
          />
          <FormField
            name="loanDuration"
            type="number"
            label="Loan Duration in Days"
            value={loandurationindays}
            onChange={this.handleLoandDurationChange}
          />
          <FormButton variant="contained" onClick={this.handleSubmit}>
            Submit
          </FormButton>
        </Form>
      </div>
    );
  }
}

export default LendForm;
