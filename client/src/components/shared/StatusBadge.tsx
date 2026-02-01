import Chip from "@mui/material/Chip";
import type { DemandStatus } from "../../api/types";

const statusConfig: Record<DemandStatus, { label: string; color: "warning" | "success" | "error" | "info" }> = {
  Pending: { label: "ממתין", color: "warning" },
  Approved: { label: "אושר", color: "success" },
  Rejected: { label: "נדחה", color: "error" },
  PartiallyApproved: { label: "אושר חלקית", color: "info" },
};

interface StatusBadgeProps {
  status: DemandStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
