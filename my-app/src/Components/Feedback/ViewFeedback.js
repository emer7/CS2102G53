import React, { Component } from "react";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MenuItem from "@material-ui/core/MenuItem";
import { TextField, Button } from "@material-ui/core";

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const FormField = styled(TextField)`
  & + & {
    margin-top: 15px;
  }
`;

const FormButton = styled(Button)`
  && {
    margin-top: 30px;
  }
`;

const Form = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

class ViewFeedback extends Component {
  constructor(props) {
    const rows = [
      {
        feedbackssn: 0,
        username: "abc",
        commenttype: "ab",
        commentbody:
          "orig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig name"
      },
      { feedbackssn: 1, username: "abe", commenttype: "cd", commentbody: "orig2 name" },
      { feedbackssn: 2, username: "abd", commenttype: "ef", commentbody: "orig3 name" }
    ];
    super(props);
    this.state = { rows: rows, row: {} };
  }

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
      .then(console.log);
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
      .then(console.log);
  };

  componentDidMount() {
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
  }

  render() {
    const { given } = this.props;
    const { rows, username, commenttype, commentbody } = this.state;

    return (
      <Divider>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Given by </TableCell>
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
              Submit
            </FormButton>
          </Form>
        )}
      </Divider>
    );
  }
}

export default ViewFeedback;
