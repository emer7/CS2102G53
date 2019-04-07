import React, { Component } from "react";

import { FormField, FormButton, Form } from "../Constants";

class ProposeBid extends Component {
  // read bid on mount
  // if there is bid, then update not post
  // if there is no bid, then post
  // can delete bid
  // get the minimum bid

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleBidChange = event => {
    this.setState({ bidamt: event.target.value });
  };

  handleSubmit = () => {
    const { item, user, history } = this.props;
    const { itemssn } = item;
    const { userssn } = user;
    const { bidamt } = this.state;
    const bidObject = { itemssn, bidamt, userssn };

    fetch("/items/bid/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bidObject)
    })
      .then(res => res.json())
      .then(() => history.push("/borrow/bidding"));
  };

  render() {
    const { bidamt } = this.state;
    const { item } = this.props;
    const { minbidprice } = item;

    return (
      <Form>
        <FormField
          name="bidamt"
          label="Bid Amount"
          type="number"
          placeholder={minbidprice}
          InputProps={{ inputProps: { min: minbidprice } }}
          value={bidamt}
          onChange={this.handleBidChange}
        />

        <FormButton variant="contained" onClick={this.handleSubmit}>
          Submit
        </FormButton>
      </Form>
    );
  }
}

export default ProposeBid;
