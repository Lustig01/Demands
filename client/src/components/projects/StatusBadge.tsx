import { useTranslation } from 'react-i18next';
import type { DemandStatus } from '../../types/domain';

const statusStyles: Record<DemandStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  PartiallyApproved: 'bg-blue-100 text-blue-800',
};

interface StatusBadgeProps {
  status: DemandStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {t(`projects.status.${status}`)}
    </span>
  );
}
