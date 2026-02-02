import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdStorage, MdPersonOutline, MdLogout, MdExpandMore } from 'react-icons/md';
import LanguageSwitcher from '../LanguageSwitcher';
import type { NavSection, UserProfile } from '../../types/navigation';

export const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  sections: NavSection[];
  userProfile: UserProfile;
}

export default function Sidebar({ sections, userProfile }: SidebarProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <aside className="w-[260px] shrink-0 bg-bg-paper border-s border-divider flex flex-col h-screen sticky top-0">
      {/* App logo */}
      <div className="flex items-center justify-center gap-3 p-5">
        <div className="w-10 h-10 rounded-[10px] bg-primary flex items-center justify-center">
          <MdStorage size={22} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-text-primary">{t('app.title')}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <span
                className={`block px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wide ${sectionIndex > 0 ? 'pt-5' : ''}`}
              >
                {section.title}
              </span>
            )}
            <ul className="list-none p-0 m-0">
              {section.items.map((item) => (
                <li key={item.path} className="mb-0.5">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.9rem] transition-colors no-underline ${
                        isActive
                          ? 'bg-primary-light text-primary font-semibold'
                          : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                      }`
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Language switcher */}
      <div className="flex justify-center py-2">
        <LanguageSwitcher />
      </div>

      {/* User profile */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex items-center gap-3 p-4 mx-3 mb-3 rounded-3xl cursor-pointer transition-colors hover:bg-gray-100 bg-transparent border-none text-start"
        >
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt=""
              className="w-[38px] h-[38px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[38px] h-[38px] rounded-full bg-primary-light text-primary flex items-center justify-center text-[0.95rem] font-semibold">
              {userProfile.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate m-0">{userProfile.name}</p>
            <p className="text-xs text-text-secondary truncate m-0">{userProfile.role}</p>
          </div>
          <MdExpandMore size={20} className="text-text-secondary" />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full mb-2 start-3 min-w-[180px] bg-bg-paper rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-divider overflow-hidden">
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-primary hover:bg-gray-100 transition-colors bg-transparent border-none cursor-pointer text-start"
            >
              <MdPersonOutline size={20} />
              {t('user.profile')}
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger hover:bg-gray-100 transition-colors bg-transparent border-none cursor-pointer text-start"
            >
              <MdLogout size={20} />
              {t('user.logout')}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
