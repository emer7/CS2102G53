import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export const ItemsTable = ({ rows, handleItemClick }) => {
  return (
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
          <TableRow key={row.itemssn} hover onClick={() => handleItemClick(row)}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.description}</TableCell>
            <TableCell align="right">{row.minbidprice}</TableCell>
            <TableCell align="right">{row.loandurationindays}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
