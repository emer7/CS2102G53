import React, { Component } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";

class AcceptedBidding extends Component {
  constructor(props) {
    const rows = [];

    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/items/view/all/accepted/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleDelete = (event, item) => {
    event.stopPropagation();

    const { paymentssn } = item;

    fetch(`/payment/delete/${paymentssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  handleAccept = (event, item) => {
    event.stopPropagation();

    const { paymentssn } = item;

    fetch("/payment/update/paid", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paymentssn })
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  render() {
    const { rows } = this.state;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Owner</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell>Minimum Bid Price</TableCell>
            <TableCell>Winning Bid</TableCell>
            <TableCell>Loan Duration in Days</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Pay</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.itemssn} hover>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.minbidprice}</TableCell>
              <TableCell>{row.bidamt}</TableCell>
              <TableCell>{row.loandurationindays}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={event => this.handleDelete(event, row)}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={event => this.handleAccept(event, row)}
                >
                  Pay
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default AcceptedBidding;
