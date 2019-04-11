import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import { Tabs, Tab } from "@material-ui/core";

import LendForm from "./Lend/LendForm";
import AvailableLend from "./Lend/AvailableLend";
import WaitingLend from "./Lend/WaitingLend.js";
import CurrentlyLend from "./Lend/CurrentlyLend";

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ value: false });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { user } = this.props;

    return (
      <div>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
          centered
        >
          <Tab label="Lend an Item" component={Link} to="/lend/form" />
          <Tab label="Available to Lent" component={Link} to="/lend/available" />
          <Tab label="Waiting For Payment" component={Link} to="/lend/waiting" />
          <Tab label="Currently Lent" component={Link} to="/lend/current" />
        </Tabs>
        <Route path="/lend/form" render={props => <LendForm user={user} {...props} />} />
        <Route path="/lend/available" render={props => <AvailableLend user={user} {...props} />} />
        <Route path="/lend/waiting" render={props => <WaitingLend user={user} {...props} />} />
        <Route path="/lend/current" render={props => <CurrentlyLend user={user} {...props} />} />
      </div>
    );
  }
}

export default Lend;
