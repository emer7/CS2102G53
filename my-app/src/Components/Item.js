import React, { Component } from "react";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import AcceptBid from "./AcceptBid";
import ProposeBid from "./ProposeBid";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { row: {} };
  }

  componentDidMount() {
    // fetch("/search/available/:loanedByUserSSN") // fix to get the item from db
    //   .then(res => res.json())
    //   .then(data => this.setState({ rows: data }));
    // const rows = [
    //   {
    //     itemssn: 0,
    //     name: 1,
    //     description: 2,
    //     minbidprice: 3,
    //     loandurationindays: 4,
    //     loanedbyuserssn: 2
    //   },
    //   {
    //     itemssn: 1,
    //     name: 2,
    //     description: 2,
    //     minbidprice: 3,
    //     loandurationindays: 4,
    //     loanedbyuserssn: 1
    //   },
    //   {
    //     itemssn: 2,
    //     name: 3,
    //     description: 2,
    //     minbidprice: 3,
    //     loandurationindays: 4,
    //     loanedbyuserssn: 0
    //   }
    // ];
    const { match, item } = this.props;
    // const { itemssn } = match.params;
    // const row = rows.find(row => row.itemssn == itemssn);
    const row = item || {};
    this.setState({ row });
  }

  render() {
    const { row } = this.state;
    const { user } = this.props;
    const { loanedbyuserssn } = row;

    return (
      <div>
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
            <TableRow>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.minbidprice}</TableCell>
              <TableCell align="right">{row.loanduration}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {user.userssn == loanedbyuserssn ? <AcceptBid itemssn={row.itemssn} /> : <ProposeBid />}
      </div>
    );
  }
}

export default Item;
