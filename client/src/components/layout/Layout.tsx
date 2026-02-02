import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import type { NavSection, UserProfile } from '../../types/navigation';

interface LayoutProps {
  navSections: NavSection[];
  userProfile: UserProfile;
}

export default function Layout({ navSections, userProfile }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar sections={navSections} userProfile={userProfile} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top accent bar */}
        <Box sx={{ height: 4, bgcolor: 'primary.dark' }} />

        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
