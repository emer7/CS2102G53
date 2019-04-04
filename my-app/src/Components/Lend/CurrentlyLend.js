import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";

class CurrentlyLend extends Component {
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
    const { userssn } = user;

    fetch(`/items/view/my_items_on_loan/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    const { history, handleChosenItem } = this.props;
    const { itemssn } = item;
    handleChosenItem(item);
    history.push(`/item/${itemssn}`);
  };

  render() {
    const { rows } = this.state;

    return <ItemsTable rows={rows} handleItemClick={this.handleItemClick} />;
  }
}

export default CurrentlyLend;
