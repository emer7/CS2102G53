import React, { Component } from "react";

import { FormField, FormButton, Form } from "../Constants";

class LendForm extends Component {
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
    const { user, history, handleShowDialog } = this.props;
    const { userssn } = user;

    fetch("/items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...this.state, userssn })
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
          <FormButton variant="contained" color="primary" onClick={this.handleSubmit}>
            Submit
          </FormButton>
        </Form>
      </div>
    );
  }
}

export default LendForm;
