import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdBarChart, MdDescription, MdRemoveRedEye, MdGridOn, MdSettings } from 'react-icons/md';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import type { NavSection, UserProfile } from './types/navigation';

// Temporary static user profile
const userProfile: UserProfile = {
  name: 'Raphael Lustig',
  role: 'user',
};

export default function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
    document.title = t('app.title');
  }, [i18n.language, t]);

  // Temporary static navigation -- will be replaced by role-based logic
  const navSections: NavSection[] = [
    {
      items: [
        { label: t('nav.dashboard'), path: '/dashboard', icon: MdBarChart },
        { label: t('nav.demands'), path: '/demands', icon: MdDescription },
        { label: t('nav.moderator'), path: '/moderator', icon: MdRemoveRedEye },
        { label: t('nav.import'), path: '/import', icon: MdGridOn },
        { label: t('nav.settings'), path: '/settings', icon: MdSettings },
      ],
    },
  ];

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
