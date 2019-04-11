import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";

import { ItemsTable } from "../ItemsTable";
import { Form } from "../Constants";

class AvailableBorrow extends Component {
  constructor(props) {
    const { handleTabChange } = props;
    const rows = [];

    super(props);
    this.state = { rows };
    handleTabChange(undefined, 0);
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

  handleSearchReset = () => {
    this.fetchResources();
  };

  handleItemClick = item => {
    const { history } = this.props;
    const { itemssn } = item;
    history.push(`/item/${itemssn}`);
  };

  render() {
    const { rows, searchQuery } = this.state;

    return (
      <React.Fragment>
        <Grid container direction="column" alignItems="center">
          <Grid item xs sm md lg xl>
            <Form>
              <Grid container alignItems="center" spacing={16}>
                <Grid item>
                  <TextField
                    name="searchQuery"
                    label="Search"
                    value={searchQuery}
                    onChange={this.handleSearchQuery}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={this.handleSearch}>
                    Search
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={this.handleSearchReset}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Grid>
        </Grid>
        <ItemsTable rows={rows} handleItemClick={this.handleItemClick} />
      </React.Fragment>
    );
  }
}

export default AvailableBorrow;
