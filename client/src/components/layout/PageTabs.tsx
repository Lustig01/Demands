import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export interface PageTab {
  label: string;
  path: string;
}

interface PageTabsProps {
  tabs: PageTab[];
  basePath: string;
}

export default function PageTabs({ tabs, basePath }: PageTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.findIndex(
    (tab) => location.pathname === `${basePath}${tab.path}`,
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(`${basePath}${tabs[newValue].path}`);
  };

  return (
    <Tabs
      value={currentTab === -1 ? 0 : currentTab}
      onChange={handleChange}
      sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.path} label={tab.label} />
      ))}
    </Tabs>
  );
}
