"use client";
import { Box, CircularProgress, styled } from "@mui/material";
import { FunctionComponent } from "react";

const LoadingWrapper = styled(Box)({
  position: "absolute",
  display: "flex",
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  top: 0,
  zIndex: 9999,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
});

const Loading: FunctionComponent = () => {
  return (
    <LoadingWrapper>
      <CircularProgress data-testid="loading" />
    </LoadingWrapper>
  );
};

export default Loading;
