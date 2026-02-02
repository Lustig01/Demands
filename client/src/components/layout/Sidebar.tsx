import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import StorageIcon from '@mui/icons-material/Storage';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { NavSection, UserProfile } from '../../types/navigation';
import './Sidebar.css';

export const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  sections: NavSection[];
  userProfile: UserProfile;
}

export default function Sidebar({ sections, userProfile }: SidebarProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      className="sidebar"
    >
      {/* App logo */}
      <Box className="sidebar-logo">
        <Box className="sidebar-logo-icon-box">
          <StorageIcon className="sidebar-logo-icon" />
        </Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          מערכת דרישות
        </Typography>
      </Box>

      {/* Navigation */}
      <Box className="sidebar-nav">
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {section.title && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                className={`sidebar-section-title${sectionIndex > 0 ? ' sidebar-section-title-spaced' : ''}`}
              >
                {section.title}
              </Typography>
            )}
            <List disablePadding>
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding className="sidebar-nav-item">
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    className="sidebar-nav-button"
                  >
                    <ListItemIcon>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { fontSize: '0.9rem' } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* User profile */}
      <Box
        className="sidebar-user-profile"
        onClick={(e) => setMenuAnchor(e.currentTarget)}
      >
        <Avatar
          src={userProfile.avatarUrl}
          className="sidebar-avatar"
        >
          {userProfile.name.charAt(0)}
        </Avatar>
        <Box className="sidebar-user-info">
          <Typography variant="body2" fontWeight={600} noWrap>
            {userProfile.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {userProfile.role}
          </Typography>
        </Box>
        <IconButton size="small" className="sidebar-expand-btn">
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            className: 'sidebar-menu-paper',
          },
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)} className="sidebar-menu-item">
          <PersonOutlineIcon fontSize="small" />
          פרופיל
        </MenuItem>
        <MenuItem
          onClick={() => setMenuAnchor(null)}
          className="sidebar-menu-item-logout"
        >
          <LogoutIcon fontSize="small" />
          התנתק
        </MenuItem>
      </Menu>
    </Drawer>
  );
}
