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

class AcceptBid extends Component {
  // read bid on mount
  // if there is bid, then accept or not accept
  // if accept, do queries

  constructor(props) {
    const rows = [
      { bidssn: 0, username: "ab", placedbyssn: 1, bidamt: 10, biddatetime: "01" },
      { bidssn: 1, username: "asdf", placedbyssn: 2, bidamt: 20, biddatetime: "02" },
      { bidssn: 2, username: "ewqr", placedbyssn: 3, bidamt: 30, biddatetime: "03" }
    ];
    super(props);
    this.state = { rows, bid: {} };
  }

  componentDidMount() {
    const { item } = this.props;
    const { itemssn } = item;

    fetch(`/items/bid/view/all/item/${itemssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  }

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

  handleItemClick = bid => {
    this.setState({ bid });
  };

  handleEditItem = () => {
    const { user, item } = this.props;
    const { itemssn } = item;

    fetch("/items/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...this.state, loanedByUserSSN: user.userssn, itemSSN: itemssn })
    })
      .then(res => res.json())
      .then(console.log);
  };

  handleDeleteItem = () => {
    const { item, history } = this.props;
    const { itemssn } = item;

    fetch(`/items/delete/${itemssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(console.log);

    history.push("/lend/available");
  };

  handleSubmit = () => {
    const { item } = this.props;
    const { itemssn } = item;
    const { bid } = this.state;
    const bidObject = { itemssn, ...bid };

    console.log(bidObject);
  };

  render() {
    const { rows, bid } = this.state;
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
          <FormButton variant="contained" onClick={this.handleEditItem}>
            Update
          </FormButton>
          <FormButton variant="contained" onClick={this.handleDeleteItem}>
            Delete
          </FormButton>
        </Form>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placed By</TableCell>
              <TableCell align="right">Bid Amount</TableCell>
              <TableCell align="right">Bid Date Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.bidssn} hover onClick={() => this.handleItemClick(row)}>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">{row.bidamt}</TableCell>
                <TableCell align="right">{row.biddatetime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Form>
          <FormField
            name="username"
            label="Placed By"
            InputLabelProps={{ shrink: !!bid.username }}
            disabled
            value={bid.username}
          />
          <FormButton variant="contained" onClick={this.handleSubmit}>
            Accept
          </FormButton>
        </Form>
      </div>
    );
  }
}

export default AcceptBid;
