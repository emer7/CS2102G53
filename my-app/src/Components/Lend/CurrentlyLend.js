import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";

class CurrentlyLend extends Component {
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

    fetch(`/items/view/all/loaned/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    console.log(item);
  };

  render() {
    const { rows } = this.state;

    return <ItemsTable rows={rows} handleItemClick={this.handleItemClick} />;
  }
}

export default CurrentlyLend;
