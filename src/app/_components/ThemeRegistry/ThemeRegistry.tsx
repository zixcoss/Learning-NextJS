"use client"
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import theme from "./theme";

type Props = {
    children: React.ReactNode;
};

export default function ThemeRegistry({children}: Props) {

  return (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
}
