import React, { Component } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";

class CurrentlyBorrow extends Component {
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

    fetch(`/items/view/all/borrowing/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleReturn = (event, { transactionssn }) => {
    event.stopPropagation();
    fetch(`/items/return/${transactionssn}`, {
      method: "PUT"
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
            <TableCell>Loan Duration in Days</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Return</TableCell>
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
              <TableCell>{row.loandurationindays}</TableCell>
              <TableCell>
                {new Date(new Date(row.enddate) - new Date(row.enddate).getTimezoneOffset() * 60000)
                  .toISOString()
                  .slice(0, 10)}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={event => this.handleReturn(event, row)}
                >
                  Return
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default CurrentlyBorrow;
