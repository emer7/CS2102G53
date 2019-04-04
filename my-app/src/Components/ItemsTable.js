import React from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";

export const ItemsTable = ({ rows, handleItemClick, deleteButton, handleDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Owner</TableCell>
          <TableCell align="right">Name</TableCell>
          <TableCell align="right">Description</TableCell>
          <TableCell align="right">Min Bid Price</TableCell>
          <TableCell align="right">Loan Duration in Days</TableCell>
          {deleteButton && <TableCell align="right">Delete</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.itemssn} hover onClick={() => handleItemClick(row)}>
            <TableCell component="th" scope="row">
              {row.username}
            </TableCell>
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right">{row.description}</TableCell>
            <TableCell align="right">{row.minbidprice}</TableCell>
            <TableCell align="right">{row.loandurationindays}</TableCell>
            {deleteButton && (
              <TableCell align="right">
                <Button variant="contained" fullWidth onClick={event => handleDelete(event, row)}>
                  Delete
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
