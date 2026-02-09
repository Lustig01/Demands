import { useTranslation } from 'react-i18next';
import { MdEdit, MdDelete } from 'react-icons/md';
import type { Project } from '../../types/domain';
import PriorityBadge from './PriorityBadge';

interface ProjectsTableProps {
  projects: Project[];
  isLoading?: boolean;
  selectedProject?: Project | null;
  onSelectProject: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectsTable({
  projects,
  isLoading,
  selectedProject,
  onSelectProject,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const { t } = useTranslation();

  const columns = [
    { key: 'name', label: t('projectsTable.columns.name') },
    { key: 'type', label: t('projects.columns.type') },
    { key: 'relatedTo', label: t('projectsTable.columns.relatedTo') },
    { key: 'location', label: t('projectsTable.columns.location') },
    { key: 'organization', label: t('projectsTable.columns.organization') },
    { key: 'priority', label: t('projects.createProject.priority') },
    { key: 'actions', label: t('common.actions') },
  ];

  if (isLoading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center text-text-secondary">
        {t('projectsTable.noProjects')}
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
          {projects.map((project) => (
            <tr
              key={project.name}
              onClick={() => onSelectProject(project)}
              className={`border-b border-divider last:border-b-0 hover:bg-primary-light/30 transition-colors cursor-pointer ${
                selectedProject?.name === project.name ? 'bg-primary-light' : ''
              }`}
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-primary">
                {project.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                  {t(`projects.type.${project.type}`)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {project.relatedTo ?? '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {[
                  project.location.base,
                  project.location.environment,
                  project.location.network,
                ]
                  .filter(Boolean)
                  .join(' / ')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {[project.centerName, project.branchName, project.sectionName]
                  .filter(Boolean)
                  .join(' / ')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <PriorityBadge priority={project.priority} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                    className="p-1.5 text-text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                    title={t('common.edit')}
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                    className="p-1.5 text-text-secondary hover:text-danger transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title={(project.demandCount ?? 0) > 0 ? t('projects.actions.cannotDeleteWithDemands') : t('common.delete')}
                    disabled={(project.demandCount ?? 0) > 0}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
