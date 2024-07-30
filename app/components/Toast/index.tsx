"use client";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { closeSnackbar, enqueueSnackbar, OptionsObject, SnackbarKey } from "notistack";

const CloseButton = styled(CloseIcon)({
  cursor: "pointer",
});

const action = (snackbarId: SnackbarKey) => {
  return (
    <Box role="toast-alert-close-button" onClick={() => closeSnackbar(snackbarId)}>
      <CloseButton />
    </Box>
  );
};

const options: OptionsObject = {
  variant: "error",
  action,
  autoHideDuration: 3000,
};

export const openToast = (error: any) => {
  enqueueSnackbar(<Box role="toast-alert">{error}</Box>, options);
};
