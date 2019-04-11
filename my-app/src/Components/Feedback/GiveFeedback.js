import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

import { FeedbackForm } from "./FeedbackForm";

class GiveFeedback extends Component {
  constructor(props) {
    const rows = [];

    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/users/all/except/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  };

  handleItemClick = user => {
    const { userssn, username } = user;
    this.setState({ receivedByUsername: username, receivedbyuserssn: userssn });
  };

  handleCommentType = event => {
    this.setState({ commenttype: event.target.value });
  };

  handleCommentBody = event => {
    this.setState({ commentbody: event.target.value });
  };

  handleSubmit = () => {
    const { user, history, handleShowDialog } = this.props;
    const { userssn } = user;
    const { commenttype, commentbody, receivedbyuserssn } = this.state;
    const feedbackObject = { userssn, commenttype, commentbody, receivedbyuserssn };

    fetch("/users/feedback/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(feedbackObject)
    })
      .then(res => res.json())
      .then(data => {
        if (data.errorMessage) {
          handleShowDialog(data.errorMessage);
        } else {
          history.push("/feedback/view/given");
        }
      });
  };

  render() {
    const { rows, receivedByUsername, commenttype, commentbody } = this.state;

    return (
      <Grid container spacing={8}>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.userssn} hover onClick={() => this.handleItemClick(row)}>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs sm md lg xl>
          <FeedbackForm
            receivedByUsername={receivedByUsername}
            commenttype={commenttype}
            commentbody={commentbody}
            handleCommentType={this.handleCommentType}
            handleCommentBody={this.handleCommentBody}
            handleSubmit={this.handleSubmit}
            buttonText="Submit"
          />
        </Grid>
      </Grid>
    );
  }
}

export default GiveFeedback;
