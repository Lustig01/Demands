import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import DemandsTable, { demandColumnConfig, type DemandColumnKey } from '../components/projects/DemandsTable';
import CreateDemandModal from '../components/projects/CreateDemandModal';
import DemandDetailSidebar from '../components/demands/DemandDetailSidebar';
import PageHeader from '../components/layout/PageHeader';
import ColumnSettingsDropdown from '../components/common/ColumnSettingsDropdown';
import { FilterSort } from '../components/common/filters';
import { useDemands } from '../hooks/useDemands';
import { useCachedProjects } from '../hooks/useCachedProjects';
import { useReferenceData } from '../hooks/useReferenceData';
import { useDebounce } from '../hooks/useDebounce';
import { useTableColumns } from '../hooks/useTableColumns';
import type { CreateDemandPayload, UpdateDemandPayload } from '../api/types';
import type { Demand, Project } from '../types/domain';
import { useToast } from '../components/common/Toast';
import Pagination from '../components/common/Pagination';
import {
  demandFilterGroups,
  demandSortOptions,
  initialDemandFilters,
  type DemandFilterKey,
  type DemandSortKey,
} from '../configs/demandFilters';
import type { FilterGroupConfig, SortState, SortDirection } from '../types/filter';

export default function DemandsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  // Get current user info for comments
  const currentUser = auth.user?.profile.preferred_username || auth.user?.profile.email || '';
  const userRole = ((auth.user?.profile.groups as string[]) || [])[0]?.toLowerCase() || 'user';
  const isPrivileged = userRole === 'admin' || userRole === 'moderator';

  // Column settings
  const {
    orderedVisibleColumns,
    allColumns,
    toggleColumn,
    reorderColumns,
    resetToDefaults,
  } = useTableColumns<DemandColumnKey>({
    tableId: 'demands',
    columns: demandColumnConfig,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter State
  const [filters, setFilters] = useState<Record<DemandFilterKey, string>>(() => ({
    ...initialDemandFilters,
    projectName: searchParams.get('project') || '',
  }));

  // Sort State
  const [sortState, setSortState] = useState<SortState<DemandSortKey>>({
    field: null,
    direction: 'asc',
  });

  const debouncedFilters = useDebounce(filters, 300);

  const isFiltersPending = useMemo(
    () => JSON.stringify(filters) !== JSON.stringify(debouncedFilters),
    [filters, debouncedFilters]
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);

  // Sidebar State
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

  const { showToast } = useToast();

  const { demands, total, totalPages, isLoading, error, createDemand, updateDemand, cancelDemand } = useDemands(
    {
      ...debouncedFilters,
      baseName: debouncedFilters.base,
      environmentName: debouncedFilters.environment,
      networkName: debouncedFilters.network,
      type: debouncedFilters.type as any,
      status: debouncedFilters.status as any,
      projectType: (debouncedFilters.projectType as any) || undefined,
      median: (debouncedFilters.median as any) || undefined,
      year: debouncedFilters.year ? Number(debouncedFilters.year) : undefined,
      relatedTo: debouncedFilters.relatedTo || undefined,
      emergencyOption: debouncedFilters.emergencyOption || undefined,
      centerName: debouncedFilters.center || undefined,
      branchName: debouncedFilters.branch || undefined,
      sectionName: debouncedFilters.section || undefined,
      projectPriority: (debouncedFilters.priority as any) || undefined,
    },
    {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: sortState.field || undefined,
      sortDir: sortState.direction,
    }
  );

  const { bases, environments, networks, services, resources, emergencyOptions, centers, branches, sections } =
    useReferenceData();
  const { projects: allProjects } = useCachedProjects();

  // Project map for table lookups
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    allProjects.forEach((p) => map.set(p.name, p));
    return map;
  }, [allProjects]);

  // Get full project for selected demand (for sidebar)
  const selectedProject = useMemo(() => {
    if (!selectedDemand) return null;
    return allProjects.find((p) => p.name === selectedDemand.projectName) || null;
  }, [selectedDemand, allProjects]);

  // Build filter groups with dynamic options
  const filterGroupsWithOptions = useMemo((): FilterGroupConfig<DemandFilterKey>[] => {
    const projectOptions = allProjects
      .map((p) => ({ value: p.name, label: p.name }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const serviceOptions = services
      .map((s) => ({ value: s.name, label: s.displayName || s.name }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const resourceOptionsSet = new Set<string>();
    const resourceOptions = resources
      .filter((r) => {
        if (resourceOptionsSet.has(r.name)) return false;
        resourceOptionsSet.add(r.name);
        return true;
      })
      .map((r) => ({ value: r.name, label: r.name }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const baseOptions = bases.map((b) => ({ value: b.name, label: b.displayName || b.name }));
    const environmentOptions = environments.map((e) => ({ value: e.name, label: e.displayName || e.name }));
    const networkOptions = networks.map((n) => ({ value: n.name, label: n.displayName || n.name }));
    const centerOptions = centers.map((c) => ({ value: c.name, label: c.displayName || c.name }));
    const branchOptions = branches.map((b) => ({ value: b.name, label: b.displayName || b.name }));
    const sectionOptions = sections.map((s) => ({ value: s.name, label: s.displayName || s.name }));
    const emergencyOptionOptions = emergencyOptions.map((eo) => ({ value: eo.name, label: eo.name }));

    const typeOptions = [
      { value: 'New', label: 'New' },
      { value: 'Extension', label: 'Extension' },
    ];

    const statusOptions = [
      { value: 'Pending', label: 'Pending' },
      { value: 'Approved', label: 'Approved' },
      { value: 'PartiallyApproved', label: 'Partially Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ];

    const projectTypeOptions = [
      { value: 'Emergency', label: 'Emergency' },
      { value: 'Semiannual', label: 'Semiannual' },
    ];

    const medianOptions = [
      { value: 'H1', label: 'H1' },
      { value: 'H2', label: 'H2' },
    ];

    const priorityOptions = [
      { value: 'P1', label: 'P1' },
      { value: 'P2', label: 'P2' },
      { value: 'P3', label: 'P3' },
    ];

    const optionsMap: Record<DemandFilterKey, { value: string; label: string }[]> = {
      projectName: projectOptions,
      serviceName: serviceOptions,
      resourceName: resourceOptions,
      base: baseOptions,
      environment: environmentOptions,
      network: networkOptions,
      type: typeOptions,
      status: statusOptions,
      projectType: projectTypeOptions,
      median: medianOptions,
      year: [],
      relatedTo: [],
      emergencyOption: emergencyOptionOptions,
      center: centerOptions,
      branch: branchOptions,
      section: sectionOptions,
      priority: priorityOptions,
    };

    return demandFilterGroups.map((group) => ({
      ...group,
      fields: group.fields.map((field) => ({
        ...field,
        options: optionsMap[field.key],
      })),
    }));
  }, [allProjects, services, resources, bases, environments, networks, centers, branches, sections, emergencyOptions]);

  async function handleSubmitDemand(payload: CreateDemandPayload | UpdateDemandPayload, demandId?: number) {
    if (demandId) {
      await updateDemand(demandId, payload as UpdateDemandPayload);
    } else {
      await createDemand(payload as CreateDemandPayload);
      setFilters((prev) => ({ ...prev, projectName: (payload as CreateDemandPayload).projectName }));
    }
    setCurrentPage(1);
  }

  function handleEditDemand(demand: Demand) {
    setEditingDemand(demand);
    setIsModalOpen(true);
    setSelectedDemand(null);
  }

  async function handleCancelDemand(demand: Demand) {
    if (window.confirm(t('demands.confirmCancel'))) {
      try {
        await cancelDemand(demand.id);
        showToast(t('demands.cancelSuccess'), 'success');
        setSelectedDemand(null);
      } catch (err: any) {
        showToast(err?.response?.data?.error || t('demands.cancelFailed'), 'error');
      }
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingDemand(null);
  }

  function handleOpenCreateModal() {
    setEditingDemand(null);
    setIsModalOpen(true);
  }

  const handleFilterChange = useCallback((key: DemandFilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(initialDemandFilters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((field: DemandSortKey | null, direction: SortDirection) => {
    setSortState({ field, direction });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={t('nav.demands')} />
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
            {t('projects.createDemand.newDemand')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterSort
        filterGroups={filterGroupsWithOptions}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        sortOptions={demandSortOptions}
        sortState={sortState}
        onSortChange={handleSortChange}
      />

      {/* Table Card */}
      <div className="bg-bg-paper rounded-2xl border border-divider shadow-sm overflow-hidden">
        {error ? (
          <div className="p-12 text-center text-danger">{error}</div>
        ) : (
          <>
            {/* Table */}
            <div
              className={`overflow-x-auto transition-opacity duration-200 ${isFiltersPending ? 'opacity-50' : 'opacity-100'}`}
            >
              <DemandsTable
                demands={demands}
                projectMap={projectMap}
                isLoading={isLoading}
                selectedDemand={selectedDemand}
                onSelectDemand={setSelectedDemand}
                onEdit={handleEditDemand}
                onCancel={handleCancelDemand}
                visibleColumns={orderedVisibleColumns}
              />
            </div>

            {/* Pagination */}
            {!isLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <CreateDemandModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitDemand}
          editingDemand={editingDemand}
        />
      )}

      <DemandDetailSidebar
        demand={selectedDemand}
        project={selectedProject}
        isOpen={selectedDemand !== null}
        onClose={() => setSelectedDemand(null)}
        onEdit={handleEditDemand}
        onCancel={handleCancelDemand}
        currentUser={currentUser}
        isPrivileged={isPrivileged}
      />
    </div>
  );
}
