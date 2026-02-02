import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/RemoveRedEye';
import UploadFileIcon from '@mui/icons-material/GridOn';
import SettingsIcon from '@mui/icons-material/Settings';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import type { NavSection, UserProfile } from './types/navigation';

// Temporary static navigation -- will be replaced by role-based logic
const navSections: NavSection[] = [
  {
    items: [
      { label: 'דשבורד', path: '/dashboard', icon: DashboardIcon },
      { label: 'ניהול דרישות', path: '/demands', icon: ListAltIcon },
      { label: 'תצוגת מודריטור', path: '/moderator', icon: VisibilityIcon },
      { label: 'ייבוא אקסל', path: '/import', icon: UploadFileIcon },
      { label: 'הגדרות', path: '/settings', icon: SettingsIcon },
    ],
  },
];

// Temporary static user profile
const userProfile: UserProfile = {
  name: 'Raphael Lustig',
  role: 'user',
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout navSections={navSections} userProfile={userProfile} />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
