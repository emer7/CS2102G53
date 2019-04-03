import React, { Component } from "react";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class ViewFeedback extends Component {
  constructor(props) {
    const rows = [
      {
        feedbackssn: 0,
        givenByUsername: "abc",
        commenttype: "ab",
        commentbody:
          "orig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig nameorig name"
      },
      { feedbackssn: 1, givenByUsername: "abe", commenttype: "cd", commentbody: "orig2 name" },
      { feedbackssn: 2, givenByUsername: "abd", commenttype: "ef", commentbody: "orig3 name" }
    ];
    super(props);
    this.state = { rows: rows };
  }

  render() {
    const { rows } = this.state;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Given by </TableCell>
            <TableCell align="right">Comment Type</TableCell>
            <TableCell align="right">Comment Body</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.feedbackssn}>
              <TableCell component="th" scope="row">
                {row.givenByUsername}
              </TableCell>
              <TableCell align="right">{row.commenttype}</TableCell>
              <TableCell align="right">{row.commentbody}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default ViewFeedback;
