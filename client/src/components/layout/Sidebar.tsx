import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { MdStorage, MdPersonOutline, MdLogout, MdExpandMore } from 'react-icons/md';
import type { NavSection, UserProfile, NavItem } from '../../types/navigation';
import LanguageSwitcher from '../LanguageSwitcher';

export const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  sections: NavSection[];
  userProfile: UserProfile;
}

function NavItemComponent({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const baseClass =
    'flex items-center gap-3 px-4 py-3 rounded-2xl text-[0.95rem] transition-colors no-underline cursor-pointer w-full text-start border-none';
  const inactiveClass = 'text-text-secondary hover:bg-gray-50 hover:text-text-primary bg-transparent';
  const activeClass = 'bg-primary-light text-primary font-semibold';

  // Case 1: Item with children (Dropdown/Popover)
  if (item.children) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${baseClass} ${isOpen ? 'bg-gray-50 text-text-primary' : inactiveClass}`}
        >
          <item.icon size={20} />
          <span className="flex-1">{item.label}</span>
          <MdExpandMore
            size={20}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-bg-paper rounded-xl shadow-lg border border-divider overflow-hidden z-10 py-1 mx-2">
            {item.children.map((child, idx) => (
              <button
                key={idx}
                onClick={() => {
                  child.onClick?.();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer text-start"
              >
                <child.icon size={18} />
                <span>{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Case 2: Action Item (onClick)
  if (item.onClick) {
    return (
      <button onClick={item.onClick} className={`${baseClass} ${inactiveClass}`}>
        <item.icon size={20} />
        <span>{item.label}</span>
      </button>
    );
  }

  // Case 3: Navigation Link
  if (item.path) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        <item.icon size={20} />
        <span>{item.label}</span>
      </NavLink>
    );
  }

  return null;
}

export default function Sidebar({ sections, userProfile }: SidebarProps) {
  const { t } = useTranslation();
  const auth = useAuth();
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
    <aside className="w-[280px] shrink-0 bg-bg-paper border-s border-divider flex flex-col h-[calc(100vh-8px)] sticky top-2">
      {/* App logo */}
      <div className="flex items-center justify-center gap-3 px-5 py-6 border-b border-divider">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <MdStorage size={22} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-text-primary">{t('app.title')}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <span
                className={`block px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wide ${sectionIndex > 0 ? 'pt-5' : ''
                  }`}
              >
                {section.title}
              </span>
            )}
            <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
              {section.items.map((item, idx) => (
                <li key={idx}>
                  <NavItemComponent item={item} />
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
      <div className="relative px-3 pb-3" ref={menuRef}>
        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full mb-2 start-3 end-3 bg-bg-paper rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-divider overflow-hidden z-20">
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-primary hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer text-start"
            >
              <MdPersonOutline size={20} />
              {t('user.profile')}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                auth.signoutRedirect();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-danger hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer text-start"
            >
              <MdLogout size={20} />
              {t('user.logout')}
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50 bg-transparent border-none text-start"
        >
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-base font-semibold">
              <MdPersonOutline size={22} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate m-0">{userProfile.name}</p>
            <p className="text-xs text-text-secondary truncate m-0">{userProfile.role}</p>
          </div>
          <MdExpandMore
            size={20}
            className={`text-text-secondary transition-transform ${menuOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
}
