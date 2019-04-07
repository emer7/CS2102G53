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

  handleItemClick = item => {
    console.log(item);
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
            <TableCell align="right">Min Bid Price</TableCell>
            <TableCell align="right">Winning Bid</TableCell>
            <TableCell align="right">Loan Duration in Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.itemssn} hover onClick={() => this.handleItemClick(row)}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.minbidprice}</TableCell>
              <TableCell align="right">{row.bidamt}</TableCell>
              <TableCell align="right">{row.loandurationindays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default CurrentlyLend;
