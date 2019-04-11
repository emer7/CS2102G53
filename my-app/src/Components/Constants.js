import styled from "styled-components";

import { Paper } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";

export const FormField = styled(TextField)`
  & + & {
    margin-top: 15px;
  }
`;

export const FormButton = styled(Button)`
  && {
    margin-top: 30px;
  }
`;

export const Form = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Box = styled(Paper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
