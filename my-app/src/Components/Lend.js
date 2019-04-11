import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import { Paper, Tabs, Tab } from "@material-ui/core";

import LendForm from "./Lend/LendForm";
import AvailableLend from "./Lend/AvailableLend";
import WaitingLend from "./Lend/WaitingLend.js";
import CurrentlyLend from "./Lend/CurrentlyLend";

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = { tabValue: false };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  render() {
    const { tabValue } = this.state;
    const { user, handleShowDialog } = this.props;

    return (
      <React.Fragment>
        <Paper>
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleTabChange}
            centered
          >
            <Tab label="Lend an Item" component={Link} to="/lend/form" />
            <Tab label="Available to Lent" component={Link} to="/lend/available" />
            <Tab label="Waiting For Payment" component={Link} to="/lend/waiting" />
            <Tab label="Currently Lent" component={Link} to="/lend/current" />
          </Tabs>
        </Paper>

        <Route
          path="/lend/form"
          render={props => (
            <LendForm
              user={user}
              handleShowDialog={handleShowDialog}
              handleTabChange={this.handleTabChange}
              {...props}
            />
          )}
        />
        <Route
          path="/lend/available"
          render={props => (
            <AvailableLend user={user} handleTabChange={this.handleTabChange} {...props} />
          )}
        />
        <Route
          path="/lend/waiting"
          render={props => (
            <WaitingLend user={user} handleTabChange={this.handleTabChange} {...props} />
          )}
        />
        <Route
          path="/lend/current"
          render={props => (
            <CurrentlyLend user={user} handleTabChange={this.handleTabChange} {...props} />
          )}
        />
      </React.Fragment>
    );
  }
}

export default Lend;
