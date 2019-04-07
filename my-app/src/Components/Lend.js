import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import styled from "styled-components";

import LendForm from "./Lend/LendForm";
import AvailableLend from "./Lend/AvailableLend";
import WaitingLend from "./Lend/WaitingLend.js";
import CurrentlyLend from "./Lend/CurrentlyLend";

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

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user } = this.props;

    return (
      <div>
        <Navbar>
          <Navlink to="/lend/form">Lend an Item</Navlink>
          <Navlink to="/lend/available">Available to Lent</Navlink>
          <Navlink to="/lend/waiting">Waiting For Payment</Navlink>
          <Navlink to="/lend/current">Currently Lent</Navlink>
        </Navbar>

        <Route path="/lend/form" render={props => <LendForm user={user} {...props} />} />
        <Route
          path="/lend/available"
          render={props => (
            <AvailableLend user={user} {...props} />
          )}
        />
        <Route
          path="/lend/waiting"
          render={props => (
            <WaitingLend user={user} {...props} />
          )}
        />
        <Route
          path="/lend/current"
          render={props => (
            <CurrentlyLend user={user} {...props} />
          )}
        />
      </div>
    );
  }
}

export default Lend;
