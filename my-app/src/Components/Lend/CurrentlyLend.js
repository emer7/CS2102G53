import React, { Component } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

class CurrentlyLend extends Component {
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

    fetch(`/items/view/all/loaned/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  render() {
    const { rows } = this.state;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Borrower Username</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell>Minimum Bid Price</TableCell>
            <TableCell>Loan Duration in Days</TableCell>
            <TableCell>End Date</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default CurrentlyLend;
