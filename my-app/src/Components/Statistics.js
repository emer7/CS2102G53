import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

class Statistics extends Component {
  constructor(props) {
    const mostActiveRows = [];
    const mostPopularRows = [];
    const mostFeedbackRows = [];

    super(props);
    this.state = {
      mostActiveRows,
      mostPopularRows,
      mostFeedbackRows
    };
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    fetch("/users/search/most/active/borrower")
      .then(res => res.json())
      .then(data => this.setState({ mostActiveRows: data }));

    fetch("/users/search/most/popular/loaner")
      .then(res => res.json())
      .then(data => this.setState({ mostPopularRows: data }));

    fetch("/users/search/most/positive/feedback")
      .then(res => res.json())
      .then(data => this.setState({ mostFeedbackRows: data }));
  };

  render() {
    const { mostActiveRows, mostPopularRows, mostFeedbackRows } = this.state;

    return (
      <Grid container>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Most Active Borrower</TableCell>
                <TableCell align="center">Number of Times Borrowed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mostActiveRows.map(row => (
                <TableRow key={row.username}>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.numoftimesborrowed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Most Popular Loaner</TableCell>
                <TableCell align="center">Number of Times Loaned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mostPopularRows.map(row => (
                <TableRow key={row.username}>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.numoftimesloaned}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Most Positive Feedback User</TableCell>
                <TableCell align="center">Number of Praises</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mostFeedbackRows.map(row => (
                <TableRow key={row.username}>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.numoftimespraised}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default Statistics;
