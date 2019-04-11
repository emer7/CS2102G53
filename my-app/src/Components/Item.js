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
    const { loanedbyssn } = row;

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Owner</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Minimum Bid Price</TableCell>
              <TableCell>Loan Duration in Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.minbidprice}</TableCell>
              <TableCell>{row.loandurationindays}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {user.userssn == loanedbyssn ? (
          <AcceptBid
            item={row}
            user={user}
            history={history}
            updateItemDetail={this.fetchResources}
          />
        ) : (
          <ProposeBid item={row} user={user} history={history} />
        )}
      </div>
    );
  }
}

export default Item;
