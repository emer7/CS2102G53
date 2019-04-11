import React, { Component } from "react";

import { ItemsTable } from "../ItemsTable";
import { FormField, FormButton, Form } from "../Constants";

class AvailableBorrow extends Component {
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

    fetch(`/items/view/all/except/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleSearchQuery = event => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = () => {
    const { searchQuery } = this.state;
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/items/view/all/except/${userssn}/with/${searchQuery}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = item => {
    const { history } = this.props;
    const { itemssn } = item;
    history.push(`/item/${itemssn}`);
  };

  render() {
    const { rows, searchQuery } = this.state;

    return (
      <div>
        <Form>
          <FormField
            name="searchQuery"
            label="Search"
            value={searchQuery}
            onChange={this.handleSearchQuery}
          />
          <FormButton variant="contained" color="primary" onClick={this.handleSearch}>
            Search
          </FormButton>
        </Form>
        <ItemsTable rows={rows} handleItemClick={this.handleItemClick} />
      </div>
    );
  }
}

export default AvailableBorrow;
