import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";

class AvailableLend extends Component {
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
    fetch(`/items/view/all/loaned/not/${user.userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    const { history } = this.props;
    const { itemssn } = item;
    history.push(`/item/${itemssn}`);
  };

  handleDelete = (event, { itemssn }) => {
    event.stopPropagation();
    fetch(`/items/delete/${itemssn}`, {
      method: "DELETE"
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
        deleteButton
        handleDelete={this.handleDelete}
      />
    );
  }
}

export default AvailableLend;
