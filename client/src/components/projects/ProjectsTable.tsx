import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Project } from '../../types/domain';

interface ProjectsTableProps {
  projects: Project[];
  isLoading?: boolean;
}

export default function ProjectsTable({ projects, isLoading }: ProjectsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    { key: 'name', label: t('projectsTable.columns.name') },
    { key: 'purpose', label: t('projectsTable.columns.purpose') },
    { key: 'demandCount', label: t('projectsTable.columns.demandCount') },
    { key: 'createdBy', label: t('projects.columns.createdBy') },
    { key: 'type', label: t('projects.columns.type') },
    { key: 'kind', label: t('projectsTable.columns.kind') },
    { key: 'relatedTo', label: t('projectsTable.columns.relatedTo') },
    { key: 'year', label: t('projectsTable.columns.year') },
    { key: 'median', label: t('projectsTable.columns.median') },
    { key: 'base', label: t('projects.columns.base') },
    { key: 'environment', label: t('projects.columns.environment') },
    { key: 'network', label: t('projects.columns.network') },
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
              onClick={() => navigate(`/demands?project=${encodeURIComponent(project.name)}`)}
              className="border-b border-divider last:border-b-0 hover:bg-primary-light/30 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-primary">{project.name}</td>
              <td className="px-4 py-3 max-w-[200px] truncate" title={project.purpose}>{project.purpose}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.demandCount ?? 0}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.createdByName}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                  {t(`projects.type.${project.type}`)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{t(`projects.kind.${project.kind}`)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.relatedTo ?? '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.year ?? '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.median ?? '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.location.base}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.location.environment}</td>
              <td className="px-4 py-3 whitespace-nowrap">{project.location.network}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
