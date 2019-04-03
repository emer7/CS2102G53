import React, { Component } from "react";
import styled from "styled-components";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TextField, Button } from "@material-ui/core";

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
`;

class AcceptBid extends Component {
  // read bid on mount
  // if there is bid, then accept or not accept
  // if accept, do queries

  constructor(props) {
    const rows = [
      { bidssn: 0, placedByUsername: "ab", placedbyssn: 1, bidamt: 10, biddatetime: "01" },
      { bidssn: 1, placedByUsername: "asdf", placedbyssn: 2, bidamt: 20, biddatetime: "02" },
      { bidssn: 2, placedByUsername: "ewqr", placedbyssn: 3, bidamt: 30, biddatetime: "03" }
    ];
    super(props);
    this.state = { rows, bid: {} };
  }

  componentDidMount() {}

  handleItemClick = bid => {
    this.setState({ bid });
  };

  handleSubmit = () => {
    const { itemssn } = this.props;
    const { bid } = this.state;
    const bidObject = { itemssn, ...bid };

    console.log(bidObject);
  };

  render() {
    const { rows, bid } = this.state;

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placed By</TableCell>
              <TableCell align="right">Bid Amount</TableCell>
              <TableCell align="right">Bid Date Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.bidssn} hover onClick={() => this.handleItemClick(row)}>
                <TableCell component="th" scope="row">
                  {row.placedByUsername}
                </TableCell>
                <TableCell align="right">{row.bidamt}</TableCell>
                <TableCell align="right">{row.biddatetime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Form>
          <FormField
            name="placedByUsername"
            label="Placed By"
            InputLabelProps={{ shrink: true }}
            disabled
            value={bid.placedByUsername}
          />
          <FormButton variant="contained" onClick={this.handleSubmit}>
            Accept
          </FormButton>
        </Form>
      </div>
    );
  }
}

export default AcceptBid;
