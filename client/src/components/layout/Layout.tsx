import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import type { NavSection, UserProfile } from '../../types/navigation';

interface LayoutProps {
  navSections: NavSection[];
  userProfile: UserProfile;
}

export default function Layout({ navSections, userProfile }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar sections={navSections} userProfile={userProfile} />
      <main className="flex-1 bg-bg-default flex flex-col">
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
