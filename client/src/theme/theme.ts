import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',

  typography: {
    fontFamily: ['"Segoe UI"', 'Tahoma', 'Arial', 'sans-serif'].join(','),
  },

  shape: {
    borderRadius: 12,
  },

  palette: {
    primary: {
      main: '#1565C0',
      light: '#E3F2FD',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },

  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 2,
          padding: '10px 16px',
          transition: 'all 0.15s ease',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
  },
});

export default theme;
