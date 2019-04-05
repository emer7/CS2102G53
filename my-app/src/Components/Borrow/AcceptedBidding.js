import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";

class AcceptedBidding extends Component {
  constructor(props) {
    const rows = [
      {
        itemssn: 0,
        name: 1,
        description: 2,
        minbidprice: 3,
        loandurationindays: 4,
        loanedbyuserssn: 2,
        loanedByUsername: "avc"
      },
      {
        itemssn: 1,
        name: 2,
        description: 2,
        minbidprice: 3,
        loandurationindays: 4,
        loanedbyuserssn: 1,
        loanedByUsername: "safd"
      },
      {
        itemssn: 2,
        name: 3,
        description: 2,
        minbidprice: 3,
        loandurationindays: 4,
        loanedbyuserssn: 0,
        loanedByUsername: "zx"
      }
    ];
    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/items/view/all/accepted/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    console.log(item);
  };

  handleDelete = (event, item) => {
    event.stopPropagation();

    const { paymentssn } = item;

    fetch(`/payment/delete/${paymentssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  handleAccept = (event, item) => {
    event.stopPropagation();

    const { paymentssn } = item;

    fetch("/payment/update/paid", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paymentssn })
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  render() {
    const { rows } = this.state;

    return (
      <ItemsTable
        rows={rows}
        handleItemClick={this.handleItemClick}
        acceptButton
        handleAccept={this.handleAccept}
      />
    );
  }
}

export default AcceptedBidding;