import React from "react";

import { Grid } from "@material-ui/core";
import { TextField, Button, MenuItem } from "@material-ui/core";

import { Form } from "../Constants";

export const FeedbackForm = ({
  receivedByUsername,
  commenttype,
  commentbody,
  handleCommentType,
  handleCommentBody,
  handleSubmit,
  buttonText
}) => (
  <Form>
    <Grid container direction="column" spacing="16">
      <Grid item xs sm md lg xl>
        <TextField
          name="receivedByUsername"
          label="To"
          InputLabelProps={{ shrink: !!receivedByUsername }}
          variant="outlined"
          fullWidth
          disabled
          value={receivedByUsername}
        />
      </Grid>
      <Grid item xs sm md lg xl>
        <TextField
          select
          label="Comment Type"
          InputLabelProps={{ shrink: !!commenttype }}
          variant="outlined"
          fullWidth
          value={commenttype}
          onChange={handleCommentType}
          margin="normal"
        >
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Bad">Bad</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs sm md lg xl>
        <TextField
          name="commentbody"
          label="Body"
          InputLabelProps={{ shrink: !!commentbody }}
          variant="outlined"
          fullWidth
          multiline
          value={commentbody}
          onChange={handleCommentBody}
        />
      </Grid>
      <Grid item xs sm md lg xl>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  </Form>
);
