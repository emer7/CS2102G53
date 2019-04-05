import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import styled from "styled-components";

import AvailableBorrow from "./Borrow/AvailableBorrow";
import CurrentlyBorrow from "./Borrow/CurrentlyBorrow";
import CurrentlyBidding from "./Borrow/CurrentlyBidding";
import AcceptedBidding from "./Borrow/AcceptedBidding";

const Navbar = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const Navlink = styled(Link)`
  color: black;
  text-decoration: none;
  & + * {
    margin-left: 10px;
  }
`;

class Borrow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user } = this.props;

    return (
      <div>
        <Navbar>
          <Navlink to="/borrow/available">Available to Borrow</Navlink>
          <Navlink to="/borrow/bidding">Currently Bidding</Navlink>
          <Navlink to="/borrow/accepted">Payment Pending</Navlink>
          <Navlink to="/borrow/current">Currently Borrowed</Navlink>
        </Navbar>

        <Route
          path="/borrow/available"
          render={props => (
            <AvailableBorrow user={user} {...props} />
          )}
        />
        <Route
          path="/borrow/bidding"
          render={props => (
            <CurrentlyBidding user={user} {...props} />
          )}
        />
        <Route
          path="/borrow/accepted"
          render={props => <AcceptedBidding user={user} {...props} />}
        />
        <Route
          path="/borrow/current"
          render={props => (
            <CurrentlyBorrow user={user} {...props} />
          )}
        />
      </div>
    );
  }
}

export default Borrow;
