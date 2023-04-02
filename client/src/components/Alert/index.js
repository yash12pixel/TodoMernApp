import React from "react";
import { Alert, Stack } from "@mui/material";
const ErrorMessageAlert = (props) => {
  return (
    <Stack sx={{ width: "90%" }} spacing={2}>
      <Alert severity="error" variant="filled">
        {props.message}
      </Alert>
    </Stack>
  );
};

export default ErrorMessageAlert;
