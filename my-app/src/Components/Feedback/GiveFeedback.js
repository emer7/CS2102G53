import React, { Component } from "react";
import styled from "styled-components";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
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
    const { user, history } = this.props;
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
      .then(() => history.push("/feedback/view/given"));
  };

  render() {
    const { rows, receivedByUsername, commenttype, commentbody } = this.state;

    return (
      <Divider>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.userssn} hover onClick={() => this.handleItemClick(row)}>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Form>
          <FormField
            name="receivedByUsername"
            label="To"
            InputLabelProps={{ shrink: !!receivedByUsername }}
            disabled
            value={receivedByUsername}
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
      </Divider>
    );
  }
}

export default GiveFeedback;
