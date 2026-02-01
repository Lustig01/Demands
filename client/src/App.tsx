import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import DemandManagementPage from "./pages/DemandManagementPage";
import ModeratorViewPage from "./pages/ModeratorViewPage";
import ExcelImportPage from "./pages/ExcelImportPage";
import SettingsPage from "./pages/SettingsPage";
import CustomerViewPage from "./pages/CustomerViewPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/demands" element={<DemandManagementPage />} />
        <Route path="/moderator" element={<ModeratorViewPage />} />
        <Route path="/import" element={<ExcelImportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/customer" element={<CustomerViewPage />} />
      </Route>
    </Routes>
  );
}

export default App;
