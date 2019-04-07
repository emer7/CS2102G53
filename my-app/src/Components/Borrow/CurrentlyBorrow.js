import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";

class CurrentlyBorrow extends Component {
  constructor(props) {
    const rows = [];
    
    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/items/view/all/borrowing/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    console.log(item);
  };

  handleReturn = (event, { transactionssn }) => {
    event.stopPropagation();
    fetch(`/items/return/${transactionssn}`, {
      method: "PUT"
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
        returnButton
        handleReturn={this.handleReturn}
      />
    );
  }
}

export default CurrentlyBorrow;
