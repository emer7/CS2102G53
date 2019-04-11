import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import { Tabs, Tab } from "@material-ui/core";

import GiveFeedback from "./Feedback/GiveFeedback";
import ViewFeedback from "./Feedback/ViewFeedback";

class Feedback extends Component {
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
    const { user, handleShowDialog } = this.props;

    return (
      <div>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
          centered
        >
          <Tab label="Give Feedback" component={Link} to="/feedback/give" />
          <Tab label="View Given Feedback" component={Link} to="/feedback/view/given" />
          <Tab label="View Received Feedback" component={Link} to="/feedback/view/received" />
        </Tabs>
        <Route
          path="/feedback/give"
          render={props => (
            <GiveFeedback user={user} handleShowDialog={handleShowDialog} {...props} />
          )}
        />
        <Route
          path="/feedback/view/given"
          render={() => <ViewFeedback user={user} handleShowDialog={handleShowDialog} given />}
        />
        <Route
          path="/feedback/view/received"
          render={() => <ViewFeedback user={user} handleShowDialog={handleShowDialog} />}
        />
      </div>
    );
  }
}

export default Feedback;
