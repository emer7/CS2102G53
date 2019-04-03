import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";

import GiveFeedback from "./Feedback/GiveFeedback";
import ViewFeedback from "./Feedback/ViewFeedback";

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

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user } = this.props;

    return (
      <div>
        <Navbar>
          <Navlink to="/feedback/give">Give Feedback</Navlink>
          <Navlink to="/feedback/view">View Received Feedback</Navlink>
        </Navbar>

        <Route path="/feedback/give" render={() => <GiveFeedback user={user} />} />
        <Route path="/feedback/view" render={() => <ViewFeedback />} />
      </div>
    );
  }
}

export default Feedback;
