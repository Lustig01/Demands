import type { IconType } from 'react-icons';

export interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
}
