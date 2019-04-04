import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
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
          <Navlink to="/feedback/view/given">View Given Feedback</Navlink>
          <Navlink to="/feedback/view/received">View Received Feedback</Navlink>
        </Navbar>

        <Route path="/feedback/give" render={() => <GiveFeedback user={user} />} />
        <Route path="/feedback/view/given" render={() => <ViewFeedback user={user} given />} />
        <Route path="/feedback/view/received" render={() => <ViewFeedback user={user} />} />
      </div>
    );
  }
}

export default Feedback;
