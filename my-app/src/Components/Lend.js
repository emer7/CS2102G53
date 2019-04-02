import React, { Component } from "react";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
class Lend extends Component {
  // Lent items
  // To lend item
  // if Lent, click will show the winning bid and time
  // if not lent, then see the current bid

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { user } = this.props;
    fetch(`/items/search/available/${user.userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
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

    // const rows = [
    //   { itemSSN: 0, name: 1, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 0 },
    //   { itemSSN: 1, name: 2, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 1 },
    //   { itemSSN: 2, name: 3, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 2 }
    // ];

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

        {rows && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Min Bid Price</TableCell>
                <TableCell align="right">Loan Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.itemssn} hover onClick={() => this.handleItemClick(row)}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">{row.minbidprice}</TableCell>
                  <TableCell align="right">{row.loanduration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
}

export default Lend;
