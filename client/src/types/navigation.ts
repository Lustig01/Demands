import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<SvgIconProps>;
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
