import { useTranslation } from 'react-i18next';
import { MdEdit, MdCancel } from 'react-icons/md';
import type { Demand, Project } from '../../types/domain';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface DemandsTableProps {
  demands: Demand[];
  projectMap: Map<string, Project>;
  isLoading?: boolean;
  selectedDemand?: Demand | null;
  onSelectDemand: (demand: Demand) => void;
  onEdit: (demand: Demand) => void;
  onCancel: (demand: Demand) => void;
}

export default function DemandsTable({
  demands,
  projectMap,
  isLoading,
  selectedDemand,
  onSelectDemand,
  onEdit,
  onCancel,
}: DemandsTableProps) {
  const { t } = useTranslation();

  const columns = [
    { key: 'project', label: t('projects.columns.project') },
    { key: 'service', label: t('projects.columns.service') },
    { key: 'resource', label: t('projects.columns.resource') },
    { key: 'status', label: t('projects.columns.status') },
    { key: 'value', label: t('projects.columns.value') },
    { key: 'approvedValue', label: t('projects.columns.approvedValue') },
    { key: 'location', label: t('projectsTable.columns.location') },
    { key: 'organization', label: t('projectsTable.columns.organization') },
    { key: 'priority', label: t('projects.createProject.priority') },
    { key: 'projectType', label: t('projects.columns.projectType') },
    { key: 'actions', label: t('common.actions') },
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
          {demands.map((demand) => {
            const project = projectMap.get(demand.projectName);
            return (
              <tr
                key={demand.id}
                onClick={() => onSelectDemand(demand)}
                className={`border-b border-divider last:border-b-0 hover:bg-primary-light/30 transition-colors cursor-pointer ${
                  selectedDemand?.id === demand.id ? 'bg-primary-light' : ''
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap font-medium text-primary">
                  {demand.projectName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{demand.serviceName}</td>
                <td className="px-4 py-3 whitespace-nowrap">{demand.resourceName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={demand.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {demand.value} {demand.unit}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {demand.approvedValue ?? '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {[demand.location.base, demand.location.environment, demand.location.network]
                    .filter(Boolean)
                    .join(' / ')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {[demand.centerName, demand.branchName, demand.sectionName]
                    .filter(Boolean)
                    .join(' / ') || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PriorityBadge priority={project?.priority} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {project?.type ? t(`projects.type.${project.type}`) : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {demand.status === 'Pending' && (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(demand); }}
                        className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                        title={t('common.edit')}
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onCancel(demand); }}
                        className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-transparent border-none cursor-pointer"
                        title={t('demands.actions.cancel')}
                      >
                        <MdCancel size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
