import React, { Component } from "react";
import styled from "styled-components";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";

import { FormField, FormButton, Form as BaseForm } from "../Constants";

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const Form = styled(BaseForm)`
  width: 100%;
`;

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

  handleDeleteFeedback = ({ feedbackssn }) => {
    fetch(`/users/feedback/delete/${feedbackssn}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => this.fetchResources());
  };

  handleSubmit = () => {
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
      .then(() => this.fetchResources());
  };

  render() {
    const { given } = this.props;
    const { rows, username, commenttype, commentbody } = this.state;

    return (
      <Divider>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{given ? "Given to" : "Given by"}</TableCell>
              <TableCell align="right">Comment Type</TableCell>
              <TableCell align="right">Comment Body</TableCell>
              {given && <TableCell align="right">Delete</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.feedbackssn}
                hover={given}
                onClick={() => given && this.handleItemClick(row)}
              >
                {" "}
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">{row.commenttype}</TableCell>
                <TableCell align="right">{row.commentbody}</TableCell>
                {given && (
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => this.handleDeleteFeedback(row)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {given && (
          <Form>
            <FormField
              name="receivedByUsername"
              label="To"
              InputLabelProps={{ shrink: !!username }}
              disabled
              value={username}
            />
            <FormField
              select
              label="Comment Type"
              InputLabelProps={{ shrink: !!commenttype }}
              value={commenttype}
              onChange={this.handleCommentType}
              margin="normal"
            >
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Bad">Bad</MenuItem>
            </FormField>
            <FormField
              name="commentbody"
              label="Body"
              InputLabelProps={{ shrink: !!commentbody }}
              value={commentbody}
              onChange={this.handleCommentBody}
            />
            <FormButton variant="contained" onClick={this.handleSubmit}>
              Update
            </FormButton>
          </Form>
        )}
      </Divider>
    );
  }
}

export default ViewFeedback;
