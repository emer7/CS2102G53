import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import styled from "styled-components";

import LendForm from "./Lend/LendForm";
import AvailableLend from "./Lend/AvailableLend";
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
  // Lent items
  // To lend item
  // if Lent, click will show the winning bid and time
  // if not lent, then see the current bid

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, handleChosenItem } = this.props;

    return (
      <div>
        <Navbar>
          <Navlink to="/lend/form">Lend an Item</Navlink>
          <Navlink to="/lend/available">Currently Not Lent</Navlink>
          <Navlink to="/lend/current">Currently Lent</Navlink>
        </Navbar>

        <Route path="/lend/form" render={props => <LendForm user={user} {...props} />} />
        <Route
          path="/lend/available"
          render={props => (
            <AvailableLend user={user} handleChosenItem={handleChosenItem} {...props} />
          )}
        />
        <Route
          path="/lend/current"
          render={props => (
            <CurrentlyLend user={user} handleChosenItem={handleChosenItem} {...props} />
          )}
        />
      </div>
    );
  }
}

export default Lend;
