import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdFileDownload } from 'react-icons/md';
import PageHeader from '../components/layout/PageHeader';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { useProjects } from '../hooks/useProjects';
import { useReferenceData } from '../hooks/useReferenceData';
import type { CreateProjectPayload } from '../api/types';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { projects, demandCounts, isLoading, error, createProject } = useProjects();
  const referenceData = useReferenceData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  async function handleCreateProject(payload: CreateProjectPayload) {
    await createProject(payload);
    setIsCreateOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-danger text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <PageHeader
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-text-primary text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer border-none"
          >
            <MdAdd size={18} />
            {t('projects.newProject')}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-paper border border-divider text-text-primary rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <MdFileDownload size={18} />
            {t('projects.export')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            demandCount={demandCounts[project.name] ?? 0}
          />
        ))}
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateProject}
        referenceData={referenceData}
      />
    </div>
  );
}
