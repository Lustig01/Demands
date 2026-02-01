import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Heebo", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: "rtl",
        },
      },
    },
  },
});

export default theme;
