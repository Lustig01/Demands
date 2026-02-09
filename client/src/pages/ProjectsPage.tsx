import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdSearch } from 'react-icons/md';
import PageHeader from '../components/layout/PageHeader';
import ProjectsTable, { projectColumnConfig, type ProjectColumnKey } from '../components/projects/ProjectsTable';
import ProjectDetailSidebar from '../components/projects/ProjectDetailSidebar';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import ColumnSettingsDropdown from '../components/common/ColumnSettingsDropdown';
import { useProjects } from '../hooks/useProjects';
import { useDebounce } from '../hooks/useDebounce';
import { useTableColumns } from '../hooks/useTableColumns';
import { useToast } from '../components/common/Toast';
import type { CreateProjectPayload, UpdateProjectPayload } from '../api/types';
import type { Project } from '../types/domain';
import Pagination from '../components/common/Pagination';

export default function ProjectsPage() {
  const { t } = useTranslation();

  // Column settings
  const {
    orderedVisibleColumns,
    allColumns,
    toggleColumn,
    reorderColumns,
    resetToDefaults,
  } = useTableColumns<ProjectColumnKey>({
    tableId: 'projects',
    columns: projectColumnConfig,
  });

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchName, setSearchName] = useState('');
  const debouncedSearchName = useDebounce(searchName, 500);

  const { projects, total, totalPages, isLoading, error, createProject, updateProject, deleteProject } = useProjects(
    { name: debouncedSearchName },
    { page: currentPage, limit: itemsPerPage }
  );

  const isFiltersPending = useMemo(() =>
    searchName !== debouncedSearchName,
    [searchName, debouncedSearchName]
  );

  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  async function handleSubmitProject(payload: CreateProjectPayload | UpdateProjectPayload, projectName?: string) {
    if (projectName) {
      await updateProject(projectName, payload as UpdateProjectPayload);
    } else {
      await createProject(payload as CreateProjectPayload);
      setSearchName((payload as CreateProjectPayload).name);
    }
    setCurrentPage(1);
  }

  function handleEditProject(project: Project) {
    setEditingProject(project);
    setIsModalOpen(true);
    setSelectedProject(null);
  }

  async function handleDeleteProject(project: Project) {
    if (window.confirm(t('projects.confirmDelete'))) {
      try {
        await deleteProject(project.name);
        showToast(t('projects.deleteSuccess'), 'success');
        setSelectedProject(null);
      } catch (err: any) {
        showToast(err?.response?.data?.error || t('projects.deleteFailed'), 'error');
      }
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingProject(null);
  }

  function handleOpenCreateModal() {
    setEditingProject(null);
    setIsModalOpen(true);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-danger text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center justify-between w-full md:w-auto">
          <PageHeader
            title={t('projects.title')}
            subtitle={t('projects.subtitle')}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={searchName}
              onChange={handleSearchChange}
              placeholder={t('projects.searchPlaceholder', 'Search projects...')}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-divider rounded-xl focus:outline-none focus:border-primary text-text-primary bg-bg-default"
            />
          </div>

          <div className="flex gap-3">
            <ColumnSettingsDropdown
              columns={allColumns}
              visibleColumns={orderedVisibleColumns.map((c) => c.key)}
              onToggleColumn={toggleColumn}
              onReorder={reorderColumns}
              onReset={resetToDefaults}
            />
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-text-primary text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer border-none whitespace-nowrap"
            >
              <MdAdd size={18} />
              {t('projects.newProject')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-bg-paper rounded-2xl border border-divider shadow-sm overflow-hidden mb-6">
        <div className={`overflow-x-auto transition-opacity duration-200 ${isFiltersPending ? 'opacity-50' : 'opacity-100'}`}>
          <ProjectsTable
            projects={projects}
            isLoading={isLoading}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            visibleColumns={orderedVisibleColumns}
          />
        </div>

        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {isModalOpen && (
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProject}
          editingProject={editingProject}
        />
      )}

      <ProjectDetailSidebar
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}
