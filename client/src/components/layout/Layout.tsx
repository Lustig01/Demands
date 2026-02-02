import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import type { NavSection, UserProfile } from '../../types/navigation';
import './Layout.css';

interface LayoutProps {
  navSections: NavSection[];
  userProfile: UserProfile;
}

export default function Layout({ navSections, userProfile }: LayoutProps) {
  return (
    <Box className="layout-root">
      <Sidebar sections={navSections} userProfile={userProfile} />

      <Box component="main" className="layout-main">
        <Box className="layout-content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
