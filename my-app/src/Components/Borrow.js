import React, { Component } from "react";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class Borrow extends Component {
  // Show borrowed item and item to borrow

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch("/items/view/all")
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  }

  handleItemClick = item => {
    const { history, handleChosenItem } = this.props;
    const { itemssn } = item;
    handleChosenItem(item);
    history.push(`/item/${itemssn}`);
  };

  render() {
    const { rows } = this.state;

    // const rows = [
    //   { itemSSN: 0, name: 1, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 0 },
    //   { itemSSN: 1, name: 2, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 1 },
    //   { itemSSN: 2, name: 3, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 2 }
    // ];

    return (
      <div>
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
                <TableRow key={row.itemSSN} hover onClick={() => this.handleItemClick(row)}>
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

export default Borrow;
