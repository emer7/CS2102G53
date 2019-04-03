import React, { Component } from "react";
import styled from "styled-components";

import { TextField, Button } from "@material-ui/core";

import { ItemsTable } from "./ItemsTable";

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
class Lend extends Component {
  // Lent items
  // To lend item
  // if Lent, click will show the winning bid and time
  // if not lent, then see the current bid

  constructor(props) {
    const rows = [
      { itemssn: 0, name: 1, description: 2, minbidprice: 3, loandurationindays: 4 },
      { itemssn: 1, name: 2, description: 2, minbidprice: 3, loandurationindays: 4 },
      { itemssn: 2, name: 3, description: 2, minbidprice: 3, loandurationindays: 4 }
    ];
    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    // const { user } = this.props;
    // fetch(`/items/search/available/${user.userssn}`)
    //   .then(res => res.json())
    //   .then(data => this.setState({ rows: data }));
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
    this.setState({ loanDuration: event.target.value });
  };

  handleSubmit = () => {
    const { user } = this.props;

    fetch("/items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...this.state, loanedByUserSSN: user.userssn })
    })
      .then(res => res.json())
      .then(console.log);
  };

  render() {
    const { rows, name, description, minBidPrice, loanDuration } = this.state;

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
            label="Loan duration"
            value={loanDuration}
            onChange={this.handleLoandDurationChange}
          />
          <FormButton variant="contained" onClick={this.handleSubmit}>
            Submit
          </FormButton>
        </Form>

        <ItemsTable rows={rows} handleItemClick={this.handleItemClick} />
      </div>
    );
  }
}

export default Lend;
