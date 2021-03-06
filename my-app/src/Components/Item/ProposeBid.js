import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";

import { Form } from "../Constants";

class ProposeBid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleBidChange = event => {
    this.setState({ bidamt: event.target.value });
  };

  handleSubmit = () => {
    const { item, user, history, handleShowDialog } = this.props;
    const { itemssn } = item;
    const { userssn } = user;
    const { bidamt } = this.state;
    const bidObject = { userssn, itemssn, bidamt: bidamt || undefined };

    fetch("/items/bid/create", {
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
          history.push("/borrow/bidding");
        }
      });
  };

  render() {
    const { bidamt } = this.state;
    const { item } = this.props;
    const { minbidprice } = item;

    return (
      <Form>
        <Grid container direction="column" alignItems="center" spacing={16}>
          <Grid item>
            <TextField
              name="bidamt"
              label="Bid Amount"
              type="number"
              placeholder={minbidprice}
              InputProps={{ inputProps: { min: minbidprice } }}
              value={bidamt}
              onChange={this.handleBidChange}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  }
}

export default ProposeBid;
