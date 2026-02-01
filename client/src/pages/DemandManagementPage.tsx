
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";

import PageHeader from "../components/shared/PageHeader";
import StatusBadge from "../components/shared/StatusBadge";
import DataTable from "../components/shared/DataTable";
import FilterBar, { type FilterConfig } from "../components/shared/FilterBar";
import DemandDialog from "../components/features/demands/DemandDialog";

import { useDemands } from "../hooks/use-demands";
import { useSettingsQuery } from "../hooks/use-settings";
import { projectsApi } from "../api/projects";
import { servicesApi, resourcesApi } from "../api/services";
import { basesApi, environmentsApi, networksApi } from "../api/locations";
import type { Demand, DemandStatus, DemandFilters } from "../api/types";

// Helper for formatting
function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("he-IL");
}

function formatValue(value: number | null, unit?: string) {
  if (value === null || value === undefined) return "-";
  const formatted = value.toLocaleString("he-IL");
  return unit ? `${unit} ${formatted}` : formatted;
}

export default function DemandManagementPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DemandFilters>({});

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");

  // Data queries
  const { data: demands, isLoading } = useDemands(Object.keys(filters).length > 0 ? filters : undefined);

  // Use useQuery directly for APIs that don't match SettingsApi interface (create/update signatures differ)
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: projectsApi.getAll });
  const { data: resources = [] } = useQuery({ queryKey: ["resources"], queryFn: resourcesApi.getAll });

  // Use useSettingsQuery for standard settings entities
  const { data: services } = useSettingsQuery("services", servicesApi);
  const { data: bases } = useSettingsQuery("bases", basesApi);
  const { data: environments } = useSettingsQuery("environments", environmentsApi);
  const { data: networks } = useSettingsQuery("networks", networksApi);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "") {
        delete next[key as keyof DemandFilters];
      } else {
        (next as any)[key] = value;
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleEdit = (demand: Demand) => {
    setSelectedDemand(demand);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (demand: Demand) => {
    setSelectedDemand(demand);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDemand(null);
  };

  const handleExport = () => {
    if (!demands) return;

    const dataToExport = demands.map(d => ({
      ID: d.id,
      Project: d.projectName,
      Service: d.serviceName,
      Resource: d.resourceName,
      Unit: d.resource?.unit,
      Location: d.location ? `${d.location.baseName}/${d.location.environmentName}` : "",
      RequestedQty: d.value,
      ApprovedQty: d.approvedValue,
      Status: d.status,
      ApprovedDate: d.approvedDate ? new Date(d.approvedDate).toLocaleDateString() : "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Demands");
    XLSX.writeFile(wb, "demands_export.xlsx");
  };

  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      key: "projectName",
      label: "פרויקט",
      options: projects.map((p) => ({ value: p.name, label: p.name })),
      value: filters.projectName || "",
    },
    {
      key: "serviceName",
      label: "שירות",
      options: services.map((s) => ({ value: s.name, label: s.displayName || s.name })),
      value: filters.serviceName || "",
    },
    {
      key: "resourceName",
      label: "משאב",
      options: resources.map((r) => ({ value: r.name, label: r.displayName || r.name })),
      value: filters.resourceName || "",
    },
    {
      key: "baseName",
      label: "מרכז נתונים",
      options: bases.map((b) => ({ value: b.name, label: b.displayName || b.name })),
      value: filters.baseName || "",
    },
    {
      key: "environmentName",
      label: "סביבה",
      options: environments.map((e) => ({ value: e.name, label: e.displayName || e.name })),
      value: filters.environmentName || "",
    },
    {
      key: "networkName",
      label: "רשת",
      options: networks.map((n) => ({ value: n.name, label: n.displayName || n.name })),
      value: filters.networkName || "",
    },
    {
      key: "status",
      label: "סטטוס",
      options: [
        { value: "Pending", label: "ממתין" },
        { value: "Approved", label: "אושר" },
        { value: "PartiallyApproved", label: "אושר חלקית" },
        { value: "Rejected", label: "נדחה" },
      ],
      value: filters.status || "",
    },
  ], [projects, services, resources, bases, environments, networks, filters]);

  const columns = useMemo<ColumnDef<Demand>[]>(() => [
    {
      accessorKey: "projectName",
      header: "פרויקט",
    },
    {
      accessorKey: "serviceName",
      header: "שירות",
      cell: ({ row }) => (
        <Box>
          <Typography variant="body2">{row.original.serviceName}</Typography>
          <Typography variant="caption" color="text.secondary">{row.original.location?.baseName}</Typography>
        </Box>
      )
    },
    {
      accessorKey: "resourceName",
      header: "משאב",
    },
    {
      accessorKey: "value",
      header: "כמות מבוקשת",
      cell: ({ row }) => formatValue(row.original.value, row.original.resource?.unit),
    },
    {
      accessorKey: "approvedValue",
      header: "כמות מאושרת",
      cell: ({ row }) => formatValue(row.original.approvedValue, row.original.resource?.unit),
    },
    {
      accessorKey: "status",
      header: "סטטוס",
      cell: ({ getValue }) => <StatusBadge status={getValue() as DemandStatus} />,
    },
    {
      accessorKey: "approvedDate",
      header: "תאריך אישור",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      id: "actions",
      header: "פעולות",
      cell: ({ row }) => (
        <Box sx={{ display: "flex" }}>
          <IconButton size="small" onClick={() => handleEdit(row.original)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleView(row.original)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ], []);

  return (
    <>
      <PageHeader
        title="ניהול דרישות"
        subtitle="תצוגה פנימית - ניהול כל הדרישות והאישורים"
        icon={<ListAltIcon sx={{ fontSize: 32 }} />}
        actions={
          <>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => navigate("/import")}>
              ייבוא מאקסל
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
              ייצוא
            </Button>
          </>
        }
      />

      <FilterBar
        filters={filterConfigs}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <DataTable
        data={demands}
        columns={columns}
        isLoading={isLoading}
        enableSelection
        onSelectionChange={(ids) => console.log("Selected:", ids)}
      />

      <DemandDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        demand={selectedDemand}
        mode={dialogMode}
      />
    </>
  );
}
