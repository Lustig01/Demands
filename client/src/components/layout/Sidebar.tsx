import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TuneIcon from "@mui/icons-material/Tune";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";

export const SIDEBAR_WIDTH = 240;

const managementItems = [
  { label: "דשבורד", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "ניהול דרישות", path: "/demands", icon: <ListAltIcon /> },
  { label: "תצוגת מודריטור", path: "/moderator", icon: <TuneIcon /> },
  { label: "ייבוא אקסל", path: "/import", icon: <UploadFileIcon /> },
  { label: "הגדרות", path: "/settings", icon: <SettingsIcon /> },
];

const clientItems = [
  { label: "תצוגת לקוח", path: "/customer", icon: <VisibilityIcon /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          borderLeft: 1,
          borderRight: 0,
          borderColor: "divider",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <StorageIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>
          מערכת דרישות
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ px: 1, pt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          ניהול
        </Typography>
      </Box>
      <List dense>
        {managementItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mt: 1 }} />

      <Box sx={{ px: 1, pt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          לקוחות
        </Typography>
      </Box>
      <List dense>
        {clientItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              משתמש
            </Typography>
            <Typography variant="caption" color="text.secondary">
              user
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
