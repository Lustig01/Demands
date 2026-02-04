import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { MdStorage, MdPersonOutline, MdLogout, MdExpandMore, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import type { NavSection, UserProfile, NavItem } from '../../types/navigation';
import LanguageSwitcher from '../LanguageSwitcher';

export const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  sections: NavSection[];
  userProfile: UserProfile;
}

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
}

function NavItemComponent({ item, collapsed }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!isOpen) return;
    // We need a global listener that's smart about the portal
    // Since the portal is outside, we can't just use menuRef.contains for the portal validation easily without a ref to it.
    // Simpler approach: Close when clicking outside.
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Check if click is on the button
      if (buttonRef.current?.contains(target)) return;
      // Check if click is inside the popup (we'll attach an id or ref to passing checking logic)
      const popup = document.getElementById(`popup-${item.label}`);
      if (popup?.contains(target)) return;

      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [isOpen, item.label]);

  useEffect(() => {
    if (isOpen && collapsed && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupStyle({
        top: rect.top,
        left: isRtl ? 'auto' : rect.right + 8,
        right: isRtl ? window.innerWidth - rect.left + 8 : 'auto',
      });
    }
  }, [isOpen, collapsed, isRtl]);

  const baseClass = `flex items-center gap-3 py-3 rounded-2xl text-[0.95rem] transition-colors no-underline cursor-pointer w-full border-none ${collapsed ? 'justify-center px-0' : 'px-4 text-start'
    }`;
  const inactiveClass = 'text-text-secondary hover:bg-gray-50 hover:text-text-primary bg-transparent';
  const activeClass = 'bg-primary-light text-primary font-semibold';

  // Case 1: Item with children (Dropdown/Popover)
  if (item.children) {
    const popupContent = (
      <div
        id={`popup-` + item.label}
        className={`bg-bg-paper rounded-xl shadow-lg border border-divider overflow-hidden z-[9999] py-1 ${collapsed ? 'fixed w-48' : 'absolute left-0 right-0 top-full mt-1 mx-2'
          }`}
        style={collapsed ? popupStyle : undefined}
      >
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
    );

    return (
      <div className="relative" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`${baseClass} ${isOpen ? 'bg-gray-50 text-text-primary' : inactiveClass}`}
          title={collapsed ? item.label : undefined}
        >
          <item.icon size={22} />
          {!collapsed && <span className="flex-1">{item.label}</span>}
          {!collapsed && (
            <MdExpandMore
              size={20}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {isOpen && (collapsed ? createPortal(popupContent, document.body) : popupContent)}
      </div>
    );
  }

  // Case 2: Action Item (onClick)
  if (item.onClick) {
    return (
      <button
        onClick={item.onClick}
        className={`${baseClass} ${inactiveClass}`}
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={22} />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  }

  // Case 3: Navigation Link
  if (item.path) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={22} />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    );
  }

  return null;
}

export default function Sidebar({ sections, userProfile }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [userPopupStyle, setUserPopupStyle] = useState<React.CSSProperties>({});
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!menuOpen) return;
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (userButtonRef.current?.contains(target)) return;
      const popup = document.getElementById('user-popup');
      if (popup?.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && collapsed && userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setUserPopupStyle({
        top: rect.top - 100, // Approximate height adjustment or calculate based on content
        left: isRtl ? 'auto' : rect.right + 8,
        right: isRtl ? window.innerWidth - rect.left + 8 : 'auto',
      });
    }
  }, [menuOpen, collapsed, isRtl]);

  const userMenuContent = (
    <div
      id="user-popup"
      className={`bg-bg-paper rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-divider overflow-hidden z-[9999] ${collapsed ? 'fixed w-48' : 'absolute bottom-full mb-2 start-3 end-3'
        }`}
      style={collapsed ? userPopupStyle : undefined}
    >
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
  );

  return (
    <aside
      className={`shrink-0 bg-bg-paper border-s border-divider flex flex-col h-[calc(100vh-8px)] sticky top-2 transition-all duration-300 ${collapsed ? 'w-[88px]' : 'w-[280px]'
        }`}
    >
      {/* App logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-divider ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <MdStorage size={22} className="text-white" />
        </div>
        {!collapsed && <h1 className="text-lg font-bold text-text-primary whitespace-nowrap">{t('app.title')}</h1>}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute top-[52px] bg-bg-paper border border-divider rounded-full p-1 shadow-sm text-text-secondary hover:text-primary cursor-pointer z-50 flex items-center justify-center w-6 h-6 ${isRtl ? '-left-3' : '-right-3'
          }`}
      >
        {collapsed ? (isRtl ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />) : (isRtl ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />)}
      </button>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-4'}`}>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && !collapsed && (
              <span
                className={`block px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wide ${sectionIndex > 0 ? 'pt-5' : ''
                  }`}
              >
                {section.title}
              </span>
            )}
            {section.title && collapsed && sectionIndex > 0 && <div className="h-4" />}

            <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
              {section.items.map((item, idx) => (
                <li key={idx}>
                  <NavItemComponent item={item} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Language switcher */}
      {!collapsed && (
        <div className="flex justify-center py-2">
          <LanguageSwitcher />
        </div>
      )}

      {/* User profile */}
      <div className={`relative pb-3 ${collapsed ? 'px-2' : 'px-3'}`} ref={menuRef}>
        {/* Dropdown menu */}
        {menuOpen && (collapsed ? createPortal(userMenuContent, document.body) : userMenuContent)}

        <button
          ref={userButtonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50 bg-transparent border-none ${collapsed ? 'justify-center border border-transparent' : 'text-start'
            }`}
        >
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-base font-semibold shrink-0">
              <MdPersonOutline size={22} />
            </div>
          )}
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate m-0">{userProfile.name}</p>
                <p className="text-xs text-text-secondary truncate m-0">{userProfile.role}</p>
              </div>
              <MdExpandMore
                size={20}
                className={`text-text-secondary transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
