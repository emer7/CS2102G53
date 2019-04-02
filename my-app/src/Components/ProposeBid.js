import React, { Component } from "react";
import styled from "styled-components";
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

class ProposeBid extends Component {
  // read bid on mount
  // if there is bid, then update not post
  // if there is no bid, then post
  // can delete bid
  // get the minimum bid

  constructor(props) {
    super(props);
    this.state = { bid: 0 };
  }

  componentDidMount() {}

  handleBidChange = event => {
    this.setState({ bid: event.target.value });
  };

  handleSubmit = () => {
    // fetch("/items/create", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ ...this.state, loanedByUserSSN: user.userssn })
    // })
    //   .then(res => res.json())
    //   .then(console.log);
  };

  render() {
    const { bid } = this.state;

    return (
      <Form>
        <FormField
          name="bid"
          label="Bid"
          type="number"
          value={bid}
          onChange={this.handleBidChange}
        />

        <FormButton variant="contained" onClick={this.handleSubmit}>
          Submit
        </FormButton>
      </Form>
    );
  }
}

export default ProposeBid;
