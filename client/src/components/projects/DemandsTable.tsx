import { useTranslation } from 'react-i18next';
import { MdEdit, MdCancel } from 'react-icons/md';
import type { Demand, Project } from '../../types/domain';
import type { ColumnConfig } from '../../types/table';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export type DemandColumnKey =
  | 'project'
  | 'service'
  | 'resource'
  | 'status'
  | 'value'
  | 'approvedValue'
  | 'location'
  | 'organization'
  | 'priority'
  | 'projectType'
  | 'id'
  | 'resourceService'
  | 'unit'
  | 'demandType'
  | 'clusterName'
  | 'approvedDate'
  | 'decisionReason'
  | 'createdBy'
  | 'createdAt'
  | 'actions';

export const demandColumnConfig: ColumnConfig<DemandColumnKey>[] = [
  { key: 'project', label: 'projects.columns.project', canHide: false },
  { key: 'service', label: 'projects.columns.service', defaultVisible: true },
  { key: 'resource', label: 'projects.columns.resource', defaultVisible: true },
  { key: 'status', label: 'projects.columns.status', defaultVisible: true },
  { key: 'value', label: 'projects.columns.value', defaultVisible: true },
  { key: 'approvedValue', label: 'projects.columns.approvedValue', defaultVisible: true },
  { key: 'location', label: 'projectsTable.columns.location', defaultVisible: true },
  { key: 'organization', label: 'projectsTable.columns.organization', defaultVisible: true },
  { key: 'priority', label: 'projects.createProject.priority', defaultVisible: true },
  { key: 'projectType', label: 'projects.columns.projectType', defaultVisible: true },
  { key: 'id', label: 'projects.columns.id', defaultVisible: false },
  { key: 'resourceService', label: 'projects.columns.resourceService', defaultVisible: false },
  { key: 'unit', label: 'projects.columns.unit', defaultVisible: false },
  { key: 'demandType', label: 'projects.columns.type', defaultVisible: false },
  { key: 'clusterName', label: 'demandSidebar.clusterName', defaultVisible: false },
  { key: 'approvedDate', label: 'projects.columns.approvedDate', defaultVisible: false },
  { key: 'decisionReason', label: 'projects.columns.decisionReason', defaultVisible: false },
  { key: 'createdBy', label: 'projects.columns.createdBy', defaultVisible: false },
  { key: 'createdAt', label: 'projects.columns.createdAt', defaultVisible: false },
  { key: 'actions', label: 'common.actions', canHide: false },
];

interface DemandsTableProps {
  demands: Demand[];
  projectMap: Map<string, Project>;
  isLoading?: boolean;
  selectedDemand?: Demand | null;
  onSelectDemand: (demand: Demand) => void;
  onEdit: (demand: Demand) => void;
  onCancel: (demand: Demand) => void;
  visibleColumns: ColumnConfig<DemandColumnKey>[];
}

export default function DemandsTable({
  demands,
  projectMap,
  isLoading,
  selectedDemand,
  onSelectDemand,
  onEdit,
  onCancel,
  visibleColumns,
}: DemandsTableProps) {
  const { t } = useTranslation();

  const renderCell = (demand: Demand, columnKey: DemandColumnKey) => {
    const project = projectMap.get(demand.projectName);

    switch (columnKey) {
      case 'project':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap font-medium text-primary">
            {demand.projectName}
          </td>
        );
      case 'service':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.serviceName}
          </td>
        );
      case 'resource':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.resourceName}
          </td>
        );
      case 'status':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            <StatusBadge status={demand.status} />
          </td>
        );
      case 'value':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.value} {demand.unit}
          </td>
        );
      case 'approvedValue':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.approvedValue ?? '-'}
          </td>
        );
      case 'location':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {[demand.location.base, demand.location.environment, demand.location.network, demand.location.cluster]
              .filter(Boolean)
              .join(' / ')}
          </td>
        );
      case 'organization':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {[demand.centerName, demand.branchName, demand.sectionName]
              .filter(Boolean)
              .join(' / ') || '-'}
          </td>
        );
      case 'priority':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            <PriorityBadge priority={project?.priority} />
          </td>
        );
      case 'projectType':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {project?.type ? t(`projects.type.${project.type}`) : '-'}
          </td>
        );
      case 'id':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap text-text-secondary">
            {demand.id}
          </td>
        );
      case 'resourceService':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.resourceService}
          </td>
        );
      case 'unit':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.unit}
          </td>
        );
      case 'demandType':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {t(`projects.demandType.${demand.type}`)}
          </td>
        );
      case 'clusterName':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.clusterName ?? '-'}
          </td>
        );
      case 'approvedDate':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.approvedDate ? new Date(demand.approvedDate).toLocaleDateString() : '-'}
          </td>
        );
      case 'decisionReason':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.decisionReasonName ?? '-'}
          </td>
        );
      case 'createdBy':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {demand.createdByName || demand.createdBy}
          </td>
        );
      case 'createdAt':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
            {new Date(demand.createdAt).toLocaleDateString()}
          </td>
        );
      case 'actions':
        return (
          <td key={columnKey} className="px-4 py-3 whitespace-nowrap">
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
        );
      default:
        return null;
    }
  };

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
            {visibleColumns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-start font-semibold text-text-secondary whitespace-nowrap bg-bg-default"
              >
                {t(col.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {demands.map((demand) => (
            <tr
              key={demand.id}
              onClick={() => onSelectDemand(demand)}
              className={`border-b border-divider last:border-b-0 hover:bg-primary-light/30 transition-colors cursor-pointer ${
                selectedDemand?.id === demand.id ? 'bg-primary-light' : ''
              }`}
            >
              {visibleColumns.map((col) => renderCell(demand, col.key))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
