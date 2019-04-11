import React from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";

export const ItemsTable = ({
  rows,
  handleItemClick,
  deleteButton,
  handleDelete,
  acceptButton,
  handleAccept,
  returnButton,
  handleReturn
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Item Owner</TableCell>
          <TableCell>Item Name</TableCell>
          <TableCell>Item Description</TableCell>
          <TableCell>Minimum Bid Price</TableCell>
          <TableCell>Loan Duration in Days</TableCell>
          {deleteButton && <TableCell>Delete</TableCell>}
          {acceptButton && <TableCell>Pay</TableCell>}
          {returnButton && <TableCell>Return</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.itemssn} hover onClick={() => handleItemClick(row)}>
            <TableCell component="th" scope="row">
              {row.username}
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.minbidprice}</TableCell>
            <TableCell>{row.loandurationindays}</TableCell>
            {deleteButton && (
              <TableCell>
                <Button variant="contained" fullWidth onClick={event => handleDelete(event, row)}>
                  Delete
                </Button>
              </TableCell>
            )}
            {acceptButton && (
              <TableCell>
                <Button variant="contained" fullWidth onClick={event => handleAccept(event, row)}>
                  Pay
                </Button>
              </TableCell>
            )}
            {returnButton && (
              <TableCell>
                <Button variant="contained" fullWidth onClick={event => handleReturn(event, row)}>
                  Return
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
