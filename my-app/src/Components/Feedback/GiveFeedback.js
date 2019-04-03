import React, { Component } from "react";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MenuItem from "@material-ui/core/MenuItem";

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

class GiveFeedback extends Component {
  constructor(props) {
    const rows = [
      { userssn: 0, username: "ab", name: "orig name" },
      { userssn: 1, username: "cd", name: "orig2 name" },
      { userssn: 2, username: "ef", name: "orig3 name" }
    ];
    super(props);
    this.state = { rows };
  }

  componentDidMount() {
    const { user } = this.props;
    const { userssn } = user;

    fetch(`/users/all/except/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ rows: data }));
  }

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

  handleSubmit = event => {
    const { userssn } = this.props.user;
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
      .then(console.log);
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
            InputLabelProps={{ shrink: true }}
            disabled
            value={receivedByUsername}
          />
          <FormField
            select
            label="Comment Type"
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
