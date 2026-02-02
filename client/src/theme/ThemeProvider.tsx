import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import rtlCache from './rtlCache';

interface AppThemeProviderProps {
  children: ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <CacheProvider value={rtlCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
