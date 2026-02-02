import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdBarChart, MdDescription, MdRemoveRedEye, MdGridOn, MdSettings } from 'react-icons/md';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import type { NavSection, UserProfile } from './types/navigation';
import { useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AuthCallback from './auth/AuthCallback';
import LoadingScreen from './auth/LoadingScreen';

export default function App() {
  const { t, i18n } = useTranslation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
    document.title = t('app.title');
  }, [i18n.language, t]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Create user profile from auth user
  const userProfile: UserProfile = user
    ? {
      name: user.fullName || user.username,
      role: user.roles[0] || 'user',
      avatarUrl: undefined, // Add if available in future
    }
    : { name: '', role: '' };

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
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout navSections={navSections} userProfile={userProfile} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/demands" element={<div>Demands Page (Placeholder)</div>} />
        <Route path="/moderator" element={<div>Moderator Page (Placeholder)</div>} />
        <Route path="/import" element={<div>Import Page (Placeholder)</div>} />
        <Route path="/settings" element={<div>Settings Page (Placeholder)</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
