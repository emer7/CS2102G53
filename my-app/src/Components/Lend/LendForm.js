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
class LendForm extends Component {
  // Lent items
  // To lend item
  // if Lent, click will show the winning bid and time
  // if not lent, then see the current bid

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleItemClick = item => {
    const { history, handleChosenItem } = this.props;
    const { itemssn } = item;
    handleChosenItem(item);
    history.push(`/item/${itemssn}`);
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  };

  handleMinBidPriceChange = event => {
    this.setState({ minBidPrice: event.target.value });
  };

  handleLoandDurationChange = event => {
    this.setState({ loanDurationInDays: event.target.value });
  };

  handleSubmit = () => {
    const { user, history } = this.props;

    fetch("/items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...this.state, loanedByUserSSN: user.userssn })
    })
      .then(res => res.json())
      .then(console.log);

    history.push("/lend/available");
  };

  render() {
    const { name, description, minBidPrice, loanDurationInDays } = this.state;

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
            value={minBidPrice}
            onChange={this.handleMinBidPriceChange}
          />
          <FormField
            name="loanDuration"
            type="number"
            label="Loan Duration in Days"
            value={loanDurationInDays}
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
