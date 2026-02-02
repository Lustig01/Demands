import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdArrowBack, MdArrowForward, MdFolder } from 'react-icons/md';
import PageHeader from '../components/layout/PageHeader';
import DemandsFilterBar from '../components/projects/DemandsFilterBar';
import DemandsTable from '../components/projects/DemandsTable';
import { getProjectByName, getDemandsByProject } from '../data/mockProjects';

export default function ProjectDetailPage() {
  const { name } = useParams<{ name: string }>();
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRemoved, setShowRemoved] = useState(false);

  const decodedName = name ? decodeURIComponent(name) : '';
  const project = getProjectByName(decodedName);
  const allDemands = getDemandsByProject(decodedName);

  const filteredDemands = useMemo(() => {
    let result = allDemands;

    if (!showRemoved) {
      result = result.filter((d) => d.status !== 'Rejected');
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.serviceName.toLowerCase().includes(term) ||
          d.resourceName.toLowerCase().includes(term) ||
          d.status.toLowerCase().includes(term) ||
          d.createdByName.toLowerCase().includes(term) ||
          (d.decisionReasonName?.toLowerCase().includes(term) ?? false)
      );
    }

    return result;
  }, [allDemands, searchTerm, showRemoved]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const ArrowIcon = i18n.dir() === 'rtl' ? MdArrowForward : MdArrowBack;

  return (
    <div className="min-w-0">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors no-underline mb-4"
      >
        <ArrowIcon size={18} />
        {t('projects.backToProjects')}
      </Link>

      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
          <MdFolder size={22} className="text-primary" />
        </div>
        <PageHeader title={project.name} subtitle={project.purpose} />
      </div>

      <div className="flex items-center gap-3 mb-6 text-sm text-text-secondary">
        <span className="px-2 py-0.5 rounded-full bg-gray-100">
          {t(`projects.type.${project.type}`)}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-gray-100">
          {t(`projects.kind.${project.kind}`)}
        </span>
        {project.year && (
          <span className="px-2 py-0.5 rounded-full bg-gray-100">
            {project.year} {project.median}
          </span>
        )}
        <span>{project.createdByName}</span>
      </div>

      <div className="bg-bg-paper border border-divider rounded-2xl p-5 min-w-0">
        <DemandsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showRemoved={showRemoved}
          onShowRemovedChange={setShowRemoved}
        />

        <div className="overflow-x-auto">
          <DemandsTable demands={filteredDemands} />
        </div>

        <div className="mt-3 text-sm text-text-secondary text-end">
          {t('projects.recordCount', {
            shown: filteredDemands.length,
            total: allDemands.length,
          })}
        </div>
      </div>
    </div>
  );
}
