import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import type { NavSection, UserProfile } from '../../types/navigation';

interface LayoutProps {
  navSections: NavSection[];
  userProfile: UserProfile;
}

export default function Layout({ navSections, userProfile }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top accent bar */}
      <div className="h-2 bg-topbar shrink-0" />

      <div className="flex flex-1">
        <Sidebar sections={navSections} userProfile={userProfile} />
        <main className="flex-1 bg-bg-default flex flex-col">
          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
