import React, { Component } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "@material-ui/core";

class CurrentlyBidding extends Component {
  constructor(props) {
    const rows = [
      { bidssn: 0, bidamt: 212, biddatetime: "a", itemssn: 0, name: 1, minbidprice: 3 },
      { bidssn: 2, bidamt: 152, biddatetime: "c", itemssn: 0, name: 1, minbidprice: 3 },
      { bidssn: 1, bidamt: 123, biddatetime: "b", itemssn: 0, name: 1, minbidprice: 3 }
    ];
    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentDidUpdate() {
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
    const bidDeleteObject = { userssn, itemssn };

    fetch(`/items/bid/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bidDeleteObject)
    })
      .then(res => res.json())
      .then(console.log);

    this.setState(this.state);
  };

  handleItemClick = item => {
    const { history, handleChosenItem } = this.props;
    const { itemssn } = item;
    handleChosenItem(item);
    history.push(`/item/${itemssn}`);
  };

  render() {
    const { rows } = this.state;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell align="right">Minimum Bid Price</TableCell>
            <TableCell align="right">Bid Amount</TableCell>
            <TableCell align="right">Bid Date Time</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.bidssn} hover onClick={() => this.handleItemClick(row)}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.minbidprice}</TableCell>
              <TableCell align="right">{row.bidamt}</TableCell>
              <TableCell align="right">{row.biddatetime}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
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
