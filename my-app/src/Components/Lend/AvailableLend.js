import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";

class AvailableLend extends Component {
  // Lent items
  // To lend item
  // if Lent, click will show the winning bid and time
  // if not lent, then see the current bid

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
    fetch(`/items/view/all/loaned/not/${user.userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    const { history, handleChosenItem } = this.props;
    const { itemssn } = item;
    handleChosenItem(item);
    history.push(`/item/${itemssn}`);
  };

  handleDelete = (event, { itemssn }) => {
    event.stopPropagation();
    fetch(`/items/delete/${itemssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(console.log);

    this.fetchResources();
  };

  render() {
    const { rows } = this.state;

    return (
      <ItemsTable
        rows={rows}
        handleItemClick={this.handleItemClick}
        deleteButton
        handleDelete={this.handleDelete}
      />
    );
  }
}

export default AvailableLend;
