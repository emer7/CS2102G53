import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";

import { FeedbackForm } from "./FeedbackForm";

class ViewFeedback extends Component {
  constructor(props) {
    const rows = [];

    super(props);
    this.state = { rows, row: {} };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user, given } = this.props;
    const { userssn } = user;

    if (given) {
      fetch(`/users/feedback/view/all/given/${userssn}`)
        .then(res => res.json())
        .then(data => this.setState({ rows: data }));
    } else {
      fetch(`/users/feedback/view/all/${userssn}`)
        .then(res => res.json())
        .then(data => this.setState({ rows: data }));
    }
  };

  handleItemClick = feedback => {
    this.setState({ ...feedback });
  };

  handleCommentType = event => {
    this.setState({ commenttype: event.target.value });
  };

  handleCommentBody = event => {
    this.setState({ commentbody: event.target.value });
  };

  handleDeleteFeedback = (event, { feedbackssn }) => {
    event.stopPropagation();

    fetch(`/users/feedback/delete/${feedbackssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  handleSubmit = () => {
    const { handleShowDialog } = this.props;
    const { commenttype, commentbody, feedbackssn } = this.state;
    const feedbackObject = { commenttype, commentbody, feedbackssn };

    fetch("/users/feedback/update", {
      method: "PUT",
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
          this.fetchResources();
        }
      });
  };

  render() {
    const { given } = this.props;
    const { rows, username, commenttype, commentbody } = this.state;

    return (
      <Grid container spacing="8">
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{given ? "Given to" : "Given by"}</TableCell>
                <TableCell>Comment Type</TableCell>
                <TableCell>Comment Body</TableCell>
                {given && <TableCell>Delete</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow
                  key={row.feedbackssn}
                  hover={given}
                  onClick={() => given && this.handleItemClick(row)}
                >
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.commenttype}</TableCell>
                  <TableCell>{row.commentbody}</TableCell>
                  {given && (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={event => this.handleDeleteFeedback(event, row)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        {given && (
          <Grid item xs sm md lg xl>
            <FeedbackForm
              receivedByUsername={username}
              commenttype={commenttype}
              commentbody={commentbody}
              handleCommentType={this.handleCommentType}
              handleCommentBody={this.handleCommentBody}
              handleSubmit={this.handleSubmit}
              buttonText="Update"
            />
          </Grid>
        )}
      </Grid>
    );
  }
}

export default ViewFeedback;
