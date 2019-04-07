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
            <TableCell align="right">Item Name</TableCell>
            <TableCell align="right">Item Description</TableCell>
            <TableCell align="right">Minimum Bid Price</TableCell>
            <TableCell align="right">Loan Duration in Days</TableCell>
            <TableCell align="right">End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.itemssn} hover>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.minbidprice}</TableCell>
              <TableCell align="right">{row.loandurationindays}</TableCell>
              <TableCell align="right">
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
