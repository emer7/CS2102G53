import React, { Component } from "react";

import { Grid } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

class History extends Component {
  constructor(props) {
    const { handleTabChange } = props;

    super(props);
    this.state = { loanRows: [], borrowRows: [] };
    handleTabChange(undefined, 2);
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources = () => {
    const { user } = this.props;
    const { userssn } = user;
    fetch(`/transactions/view/all/loan/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ loanRows: data }));

    fetch(`/transactions/view/all/borrow/${userssn}`)
      .then(res => res.json())
      .then(data => this.setState({ borrowRows: data }));
  };

  render() {
    const { loanRows, borrowRows } = this.state;

    return (
      <Grid container>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Borrower Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Returned ?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanRows.map(row => (
                <TableRow key={row.itemssn} hover>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.returnedstatus ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs sm md lg xl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loaner Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Returned ?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowRows.map(row => (
                <TableRow key={row.itemssn} hover>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.returnedstatus ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default History;
