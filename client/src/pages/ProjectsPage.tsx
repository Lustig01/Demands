import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdFileDownload } from 'react-icons/md';
import PageHeader from '../components/layout/PageHeader';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { mockProjects, mockDemands } from '../data/mockProjects';
import type { Project } from '../types/domain';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function handleCreateProject(project: Project) {
    setProjects((prev) => [project, ...prev]);
    setIsCreateOpen(false);
  }

  return (
    <div>
      <PageHeader
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
      />

      <div className="flex items-center gap-3 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            demandCount={
              mockDemands.filter((d) => d.projectName === project.name).length
            }
          />
        ))}
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
