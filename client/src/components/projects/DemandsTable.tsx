import { useTranslation } from 'react-i18next';
import type { Demand } from '../../types/domain';
import StatusBadge from './StatusBadge';

interface DemandsTableProps {
  demands: Demand[];
  isLoading?: boolean;
}

function formatDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default function DemandsTable({ demands, isLoading }: DemandsTableProps) {
  const { t, i18n } = useTranslation();

  const columns = [
    { key: 'id', label: t('projects.columns.id') },
    { key: 'project', label: t('projects.columns.project') },
    { key: 'service', label: t('projects.columns.service') },
    { key: 'resource', label: t('projects.columns.resource') },
    { key: 'value', label: t('projects.columns.value') },
    { key: 'unit', label: t('projects.columns.unit') },
    { key: 'type', label: t('projects.columns.type') },
    { key: 'base', label: t('projects.columns.base') },
    { key: 'environment', label: t('projects.columns.environment') },
    { key: 'network', label: t('projects.columns.network') },
    { key: 'center', label: t('projects.columns.center') },
    { key: 'branch', label: t('projects.columns.branch') },
    { key: 'section', label: t('projects.columns.section') },
    { key: 'status', label: t('projects.columns.status') },
    { key: 'approvedValue', label: t('projects.columns.approvedValue') },
    { key: 'approvedDate', label: t('projects.columns.approvedDate') },
    { key: 'decisionReason', label: t('projects.columns.decisionReason') },
    { key: 'createdAt', label: t('projects.columns.createdAt') },
    { key: 'createdBy', label: t('projects.columns.createdBy') },
  ];

  if (isLoading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (demands.length === 0) {
    return (
      <div className="p-12 text-center text-text-secondary">
        {t('projects.noDemands')}
      </div>
    );
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-divider">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-start font-semibold text-text-secondary whitespace-nowrap bg-bg-default"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {demands.map((demand) => (
            <tr
              key={demand.id}
              className="border-b border-divider last:border-b-0 hover:bg-primary-light/30 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap text-text-secondary">{demand.id}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.projectName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.serviceName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.resourceName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.value}</td>
              <td className="px-4 py-3 whitespace-nowrap text-text-secondary">{demand.unit}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {t(`projects.demandType.${demand.type}`)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.location.base}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.location.environment}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.location.network}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.centerName ?? '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.branchName ?? '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.sectionName ?? '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={demand.status} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {demand.approvedValue ?? '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDate(demand.approvedDate, i18n.language)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {demand.decisionReasonName ?? '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDate(demand.createdAt, i18n.language)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{demand.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
