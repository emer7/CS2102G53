import React, { Component } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";

class CurrentlyBidding extends Component {
  constructor(props) {
    const { handleTabChange } = props;
    const rows = [];

    super(props);
    this.state = { rows };
    handleTabChange(undefined, 1);
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/items/bid/view/all/user/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleDelete = (event, item) => {
    event.stopPropagation();

    const { itemssn } = item;
    const { user } = this.props;
    const { userssn } = user;
    const bidDeleteObject = { itemssn, userssn };

    fetch(`/items/bid/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bidDeleteObject)
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  handleItemClick = item => {
    const { history } = this.props;
    const { itemssn } = item;
    history.push(`/item/${itemssn}`);
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
            <TableCell>Latest Bid Amount</TableCell>
            <TableCell>Bid Date Time</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.bidssn} hover onClick={() => this.handleItemClick(row)}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.minbidprice}</TableCell>
              <TableCell>{row.bidamt}</TableCell>
              <TableCell>{row.biddatetime}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default CurrentlyBidding;
