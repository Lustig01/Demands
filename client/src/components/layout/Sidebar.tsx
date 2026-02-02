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
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* App logo */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StorageIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          מערכת דרישות
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {section.title && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  px: 1.5,
                  pt: sectionIndex > 0 ? 2.5 : 0.5,
                  pb: 0.5,
                  display: 'block',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {section.title}
              </Typography>
            )}
            <List disablePadding>
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    sx={{
                      color: 'text.secondary',
                      '& .MuiListItemIcon-root': {
                        color: 'text.secondary',
                      },
                      '&:hover': {
                        bgcolor: 'grey.100',
                        color: 'text.primary',
                        '& .MuiListItemIcon-root': {
                          color: 'text.primary',
                        },
                      },
                      '&.active': {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        fontWeight: 600,
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                        '& .MuiTypography-root': {
                          fontWeight: 600,
                        },
                      },
                    }}
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
        sx={{
          p: 2,
          mx: 1.5,
          mb: 1.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          '&:hover': { bgcolor: 'grey.100' },
        }}
        onClick={(e) => setMenuAnchor(e.currentTarget)}
      >
        <Avatar
          src={userProfile.avatarUrl}
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'primary.light',
            color: 'primary.main',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          {userProfile.name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {userProfile.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {userProfile.role}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
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
            sx: {
              minWidth: 180,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              mt: -1,
            },
          },
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ gap: 1.5 }}>
          <PersonOutlineIcon fontSize="small" />
          פרופיל
        </MenuItem>
        <MenuItem
          onClick={() => setMenuAnchor(null)}
          sx={{ gap: 1.5, color: 'error.main' }}
        >
          <LogoutIcon fontSize="small" />
          התנתק
        </MenuItem>
      </Menu>
    </Drawer>
  );
}
