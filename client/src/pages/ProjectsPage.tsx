import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import ProjectCard from '../components/projects/ProjectCard';
import { mockProjects, mockDemands } from '../data/mockProjects';

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProjects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            demandCount={
              mockDemands.filter((d) => d.projectName === project.name).length
            }
          />
        ))}
      </div>
    </div>
  );
}
