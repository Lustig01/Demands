import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import SettingsIcon from "@mui/icons-material/Settings";
import PageHeader from "../components/shared/PageHeader";
import SettingsTab from "../components/features/settings/SettingsTab";
import { useSettingsQuery } from "../hooks/use-settings";
import { basesApi, networksApi } from "../api/locations";
import { servicesApi, resourcesApi } from "../api/services";
import { centersApi } from "../api/organization";
import { branchesApi } from "../api/organization";
import { sectionsApi } from "../api/organization";
import { decisionReasonsApi, projectTypeOptionsApi } from "../api/settings";
import type { Base, Network, Service, Resource, Center, Branch, Section, DecisionReason, ProjectTypeOption } from "../api/types";

const tabs = [
  { label: "מרכזי נתונים (DC)", key: "bases" },
  { label: "רשתות", key: "networks" },
  { label: "שירותים", key: "services" },
  { label: "סוגי משאבים", key: "resources" },
  { label: "סיבות החלטה", key: "decisionReasons" },
  { label: "מרכזים", key: "centers" },
  { label: "ענפים", key: "branches" },
  { label: "מדורים", key: "sections" },
  { label: "סוגי פרויקט", key: "projectTypes" },
];

function BasesTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Base>("bases", basesApi);
  return <SettingsTab title="מרכז נתונים" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function NetworksTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Network>("networks", networksApi);
  return <SettingsTab title="רשת" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function ServicesTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Service>("services", servicesApi);
  return <SettingsTab title="שירות" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function ResourcesTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Resource>("resources", resourcesApi as never);
  return <SettingsTab title="סוג משאב" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function CentersTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Center>("centers", centersApi);
  return <SettingsTab title="מרכז" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function BranchesTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Branch>("branches", branchesApi as never);
  return <SettingsTab title="ענף" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function SectionsTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<Section>("sections", sectionsApi as never);
  return <SettingsTab title="מדור" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function DecisionReasonsTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<DecisionReason>("decision-reasons", decisionReasonsApi);
  return <SettingsTab title="סיבת החלטה" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

function ProjectTypesTab() {
  const { data, isLoading, create, update, remove } = useSettingsQuery<ProjectTypeOption>("project-type-options", projectTypeOptionsApi);
  return <SettingsTab title="סוג פרויקט" data={data} isLoading={isLoading} onCreate={create} onUpdate={update} onDelete={remove} />;
}

const tabComponents: Record<string, React.ComponentType> = {
  bases: BasesTab,
  networks: NetworksTab,
  services: ServicesTab,
  resources: ResourcesTab,
  decisionReasons: DecisionReasonsTab,
  centers: CentersTab,
  branches: BranchesTab,
  sections: SectionsTab,
  projectTypes: ProjectTypesTab,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveComponent = tabComponents[tabs[activeTab].key];

  return (
    <>
      <PageHeader
        title="הגדרות מערכת"
        subtitle="ניהול רשימות ערכים ומטא-דאטה"
        icon={<SettingsIcon sx={{ fontSize: 32 }} />}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <ActiveComponent />
    </>
  );
}
