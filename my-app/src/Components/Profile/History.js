import React, { Component } from "react";
import styled from "styled-components";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

class History extends Component {
  constructor(props) {
    super(props);
    this.state = { loanRows: [], borrowRows: [] };
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
      <Divider>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Borrower Username</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Returned ?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanRows.map(row => (
              <TableRow key={row.itemssn} hover>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.returnedstatus ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loaner Username</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Returned ?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowRows.map(row => (
              <TableRow key={row.itemssn} hover>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.returnedstatus ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Divider>
    );
  }
}

export default History;
