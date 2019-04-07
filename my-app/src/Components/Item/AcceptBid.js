import React, { Component } from "react";
import styled from "styled-components";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

import { FormField, FormButton, Form as BaseForm } from "../Constants";

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const Form = styled(BaseForm)`
  flex-grow: 1;
`;

const Half = styled.div`
  flex-grow: 1;
`;

class AcceptBid extends Component {
  constructor(props) {
    const rows = [];
    const { item } = props;
    const { name, description, minbidprice, loandurationindays } = item;

    super(props);
    this.state = { rows, bid: {}, name, description, minbidprice, loandurationindays };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { item } = this.props;
    const { itemssn } = item;

    fetch(`/items/bid/view/all/item/${itemssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

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

  handleItemClick = bid => {
    this.setState({ bid });
  };

  handleEditItem = () => {
    const { user, item, updateItemDetail } = this.props;
    const { itemssn } = item;
    const { userssn } = user;

    fetch("/items/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...this.state, itemssn, userssn })
    })
      .then(res => res.json())
      .then(() => updateItemDetail());
  };

  handleSubmit = () => {
    const { user, item, history } = this.props;
    const { bid } = this.state;
    const { itemssn } = item;
    const { userssn } = user;
    const bidObject = { userssn, itemssn, ...bid };

    fetch("/winningBid/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bidObject)
    })
      .then(res => res.json())
      .then(() => history.push("/lend/available"));
  };

  render() {
    const { rows, bid } = this.state;
    const { name, description, minbidprice, loandurationindays } = this.state;

    return (
      <Divider>
        <Half>
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
            <FormButton variant="contained" onClick={this.handleEditItem}>
              Update
            </FormButton>
          </Form>
        </Half>
        <Half>
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
        </Half>
      </Divider>
    );
  }
}

export default AcceptBid;
