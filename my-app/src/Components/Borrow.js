import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import { Tabs, Tab } from "@material-ui/core";

import AvailableBorrow from "./Borrow/AvailableBorrow";
import CurrentlyBorrow from "./Borrow/CurrentlyBorrow";
import CurrentlyBidding from "./Borrow/CurrentlyBidding";
import AcceptedBidding from "./Borrow/AcceptedBidding";

class Borrow extends Component {
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
          <Tab label="Available to Borrow" component={Link} to="/borrow/available" />
          <Tab label="Currently Bidding" component={Link} to="/borrow/bidding" />
          <Tab label="Waiting For Payment" component={Link} to="/borrow/accepted" />
          <Tab label="Currently Borrowed" component={Link} to="/borrow/current" />
        </Tabs>

        <Route
          path="/borrow/available"
          render={props => <AvailableBorrow user={user} {...props} />}
        />
        <Route
          path="/borrow/bidding"
          render={props => <CurrentlyBidding user={user} {...props} />}
        />
        <Route
          path="/borrow/accepted"
          render={props => <AcceptedBidding user={user} {...props} />}
        />
        <Route
          path="/borrow/current"
          render={props => <CurrentlyBorrow user={user} {...props} />}
        />
      </div>
    );
  }
}

export default Borrow;
