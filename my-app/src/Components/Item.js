import React, { Component } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

import AcceptBid from "./Item/AcceptBid";
import ProposeBid from "./Item/ProposeBid";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { row: {} };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { match } = this.props;
    const { itemssn } = match.params;
    fetch(`/items/view/${itemssn}`)
      .then(res => res.json())
      .then(data => this.setState({ row: data }));
  };

  render() {
    const { row } = this.state;
    const { user, history } = this.props;
    const { loanedbyuserssn } = row;

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Owner</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Min Bid Price</TableCell>
              <TableCell align="right">Loan Duration in Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.minbidprice}</TableCell>
              <TableCell align="right">{row.loandurationindays}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {user.userssn == loanedbyuserssn ? (
          <AcceptBid item={row} user={user} history={history} />
        ) : (
          <ProposeBid item={row} user={user} history={history} />
        )}
      </div>
    );
  }
}

export default Item;
