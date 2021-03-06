import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

import { Form } from "../Constants";

class AcceptBid extends Component {
  constructor(props) {
    const rows = [];
    const { item } = props;
    const { name, description, minbidprice, loandurationindays } = item;

    super(props);
    this.state = { rows, name, description, minbidprice, loandurationindays };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { item } = this.props;
    const { itemssn } = item;

    fetch(`/items/bid/view/all/item/${itemssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  };

  handleMinBidPriceChange = event => {
    this.setState({ minbidprice: event.target.value });
  };

  handleLoandDurationChange = event => {
    this.setState({ loandurationindays: event.target.value });
  };

  handleEditItem = () => {
    const { name, description, minbidprice, loandurationindays } = this.state;
    const { item, updateItemDetail, handleShowDialog } = this.props;
    const { itemssn } = item;
    const itemObject = {
      name,
      description,
      minbidprice: minbidprice || undefined,
      loandurationindays: loandurationindays || undefined,
      itemssn
    };

    fetch("/items/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itemObject)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage) {
          handleShowDialog(data.errorMessage);
        } else {
          updateItemDetail();
        }
      });
  };

  handleAcceptBid = (event, bid) => {
    event.stopPropagation();

    const { user, item, history, handleShowDialog } = this.props;
    const { itemssn } = item;
    const { userssn } = user;
    const { bidssn, bidamt, placedbyssn } = bid;
    const bidObject = { bidssn, itemssn, bidamt, placedbyssn, userssn };

    fetch("/bid/winning/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bidObject)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage) {
          handleShowDialog(data.errorMessage);
        } else {
          history.push("/lend/available");
        }
      });
  };

  render() {
    const { rows } = this.state;
    const { name, description, minbidprice, loandurationindays } = this.state;

    return (
      <Grid container>
        <Grid item xs sm md lg xl>
          <Form>
            <Grid container direction="column" spacing={16}>
              <Grid item xs sm md lg xl>
                <TextField
                  name="name"
                  label="Item Name"
                  value={name}
                  fullWidth
                  onChange={this.handleNameChange}
                />
              </Grid>
              <Grid item xs sm md lg xl>
                <TextField
                  name="description"
                  label="Item Description"
                  multiline
                  value={description}
                  fullWidth
                  onChange={this.handleDescriptionChange}
                />
              </Grid>
              <Grid item xs sm md lg xl>
                <TextField
                  name="minBidPrice"
                  type="number"
                  label="Minimum Bid Price"
                  value={minbidprice}
                  fullWidth
                  onChange={this.handleMinBidPriceChange}
                />
              </Grid>
              <Grid item xs sm md lg xl>
                <TextField
                  name="loanDuration"
                  type="number"
                  label="Loan Duration in Days"
                  value={loandurationindays}
                  fullWidth
                  onChange={this.handleLoandDurationChange}
                />
              </Grid>
              <Grid item xs sm md lg xl>
                <Button variant="contained" color="primary" fullWidth onClick={this.handleEditItem}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Grid>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Placed By</TableCell>
                <TableCell>Bid Amount</TableCell>
                <TableCell>Bid Date Time</TableCell>
                <TableCell>Accept Bid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.bidssn} hover>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.bidamt}</TableCell>
                  <TableCell>{row.biddatetime}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={event => this.handleAcceptBid(event, row)}
                    >
                      Accept
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default AcceptBid;
