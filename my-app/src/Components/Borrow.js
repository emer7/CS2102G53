import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class Borrow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // fetch("http://localhost:5000/search/available/:loanedByUserSSN") // fix to search for all users
    //   .then(res => res.json())
    //   .then(data => this.setState({ rows: data }));
  }

  handleItemClick = ({ itemSSN }) => {
    const { history, match } = this.props;
    // history.push(`${match.url}/item/${itemSSN}`);
    history.push(`/item/${itemSSN}`);
  };

  render() {
    const { match } = this.props;
    const rows = [
      { itemSSN: 0, name: 1, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 0 },
      { itemSSN: 1, name: 2, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 1 },
      { itemSSN: 2, name: 3, description: 2, minBidPrice: 3, loanDuration: 4, loanedByUserSSN: 2 }
    ];
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Min Bid Price</TableCell>
              <TableCell align="right">Loan Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.itemSSN} hover onClick={() => this.handleItemClick(row)}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.minBidPrice}</TableCell>
                <TableCell align="right">{row.loanDuration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* <Route path={`${match.path}/item/:itemId`} render={props => <Item {...props} />} /> */}
      </div>
    );
  }
}

const Item = props => {
  return <h2>{props.match.params.itemId}</h2>;
};

export default Borrow;
