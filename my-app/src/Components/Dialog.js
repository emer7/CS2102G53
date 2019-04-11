import React from "react";
import Button from "@material-ui/core/Button";
import {
  Dialog as BaseDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

const Dialog = ({ showDialog, dialogMessage, handleCloseDialog }) => (
  <BaseDialog open={showDialog} onClose={handleCloseDialog}>
    <DialogTitle>Error</DialogTitle>
    <DialogContent>
      <DialogContentText>{dialogMessage}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog} color="primary">
        Dismiss
      </Button>
    </DialogActions>
  </BaseDialog>
);

export default Dialog;
