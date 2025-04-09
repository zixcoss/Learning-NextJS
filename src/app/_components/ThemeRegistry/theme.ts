"use client"
import { blue, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
const drawerWidth = 240;
const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'url("/static/image/background_menu.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          width: drawerWidth,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  spacing: 8,
  palette: {
    mode: "light",
    primary: process.env.NEXT_PUBLIC_IS_PRODUCTION == "1" ? red : blue,
    background: {
      default: "#FFF",
    },
  },
});

export default theme;