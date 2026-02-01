import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";

export default function AppLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginRight: `${SIDEBAR_WIDTH}px`,
          bgcolor: "background.default",
        }}
      >
        <Outlet />
      </Box>
      <Sidebar />
    </Box>
  );
}
