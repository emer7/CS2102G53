import React, { Component } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

class WaitingLend extends Component {
  constructor(props) {
    const { handleTabChange } = props;
    const rows = [];

    super(props);
    this.state = { rows };
    handleTabChange(undefined, 2);
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/items/view/all/waiting/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default WaitingLend;
