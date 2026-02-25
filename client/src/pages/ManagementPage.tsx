import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DemandsTable, { demandColumnConfig, type DemandColumnKey } from '../components/projects/DemandsTable';
import DemandDetailSidebar from '../components/demands/DemandDetailSidebar';
import DecisionModal from '../components/management/DecisionModal';
import PageHeader from '../components/layout/PageHeader';
import ColumnSettingsDropdown from '../components/common/ColumnSettingsDropdown';
import { FilterSort } from '../components/common/filters';
import { useDemands } from '../hooks/useDemands';
import { useCachedProjects } from '../hooks/useCachedProjects';
import { useReferenceData } from '../hooks/useReferenceData';
import { useDebounce } from '../hooks/useDebounce';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import { useTableColumns } from '../hooks/useTableColumns';
import type { ApproveDemandPayload, RejectDemandPayload } from '../api/types';
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

export default function ManagementPage() {
  const { t } = useTranslation();

  // Column settings
  const {
    orderedVisibleColumns,
    allColumns,
    toggleColumn,
    reorderColumns,
    resetToDefaults,
  } = useTableColumns<DemandColumnKey>({
    tableId: 'management-demands',
    columns: demandColumnConfig,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter State
  const [filters, setFilters] = useState<Record<DemandFilterKey, string>>(initialDemandFilters);

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

  // Sidebar State
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

  // Decision Modal State
  const [decisionDemand, setDecisionDemand] = useState<Demand | null>(null);
  const [isDecisionModalLoading, setIsDecisionModalLoading] = useState(false);

  const { showToast } = useToast();

  const { demands, total, totalPages, totalValue, totalApprovedValue, isLoading, error, approveDemand, rejectDemand } = useDemands(
    {
      ...debouncedFilters,
      baseName: debouncedFilters.base,
      environmentName: debouncedFilters.environment,
      networkName: debouncedFilters.network,
      clusterName: debouncedFilters.cluster || undefined,
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

  const showLoading = useDelayedLoading(isLoading);

  const { bases, environments, networks, clusters, services, resources, emergencyOptions, centers, branches, sections } =
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
    const clusterOptions = clusters.map((c) => ({ value: c.name, label: c.displayName || c.name }));
    const centerOptions = centers.map((c) => ({ value: c.name, label: c.displayName || c.name }));
    const branchOptions = branches.map((b) => ({ value: b.name, label: b.displayName || b.name }));
    const sectionOptions = sections.map((s) => ({ value: s.name, label: s.displayName || s.name }));
    const emergencyOptionOptions = emergencyOptions.map((eo) => ({ value: eo.name, label: eo.name }));

    const typeOptions = [
      { value: 'New', label: 'New' },
      { value: 'Extension', label: 'Extension' },
    ];

    const statusOptions = [
      { value: 'Pending', label: t('projects.status.Pending') },
      { value: 'Approved', label: t('projects.status.Approved') },
      { value: 'PartiallyApproved', label: t('projects.status.PartiallyApproved') },
      { value: 'ApprovedWithCondition', label: t('projects.status.ApprovedWithCondition') },
      { value: 'Rejected', label: t('projects.status.Rejected') },
      { value: 'Cancelled', label: t('projects.status.Cancelled') },
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
      cluster: clusterOptions,
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
  }, [allProjects, services, resources, bases, environments, networks, clusters, centers, branches, sections, emergencyOptions]);

  function handleMakeDecision(demand: Demand) {
    setDecisionDemand(demand);
    setSelectedDemand(null);
  }

  async function handleApprove(payload: ApproveDemandPayload) {
    if (!decisionDemand) return;
    setIsDecisionModalLoading(true);
    try {
      await approveDemand(decisionDemand.id, payload);
      showToast(t('management.success.approved'), 'success');
      setDecisionDemand(null);
    } catch (err: any) {
      showToast(err?.response?.data?.error || t('management.error.approveFailed'), 'error');
    } finally {
      setIsDecisionModalLoading(false);
    }
  }

  async function handleReject(payload: RejectDemandPayload) {
    if (!decisionDemand) return;
    setIsDecisionModalLoading(true);
    try {
      await rejectDemand(decisionDemand.id, payload);
      showToast(t('management.success.rejected'), 'success');
      setDecisionDemand(null);
    } catch (err: any) {
      showToast(err?.response?.data?.error || t('management.error.rejectFailed'), 'error');
    } finally {
      setIsDecisionModalLoading(false);
    }
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
        <PageHeader title={t('management.demandsTitle')} />
        <div className="flex gap-3">
          <ColumnSettingsDropdown
            columns={allColumns}
            visibleColumns={orderedVisibleColumns.map((c) => c.key)}
            onToggleColumn={toggleColumn}
            onReorder={reorderColumns}
            onReset={resetToDefaults}
          />
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
              className={`overflow-x-auto transition-opacity duration-200 ${isFiltersPending || showLoading ? 'opacity-50' : 'opacity-100'}`}
            >
              <DemandsTable
                demands={demands}
                projectMap={projectMap}
                isLoading={false}
                selectedDemand={selectedDemand}
                onSelectDemand={setSelectedDemand}
                visibleColumns={orderedVisibleColumns}
                isModerator
                onMakeDecision={handleMakeDecision}
                totalValue={totalValue}
                totalApprovedValue={totalApprovedValue}
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

      <DemandDetailSidebar
        demand={selectedDemand}
        project={selectedProject}
        isOpen={selectedDemand !== null}
        onClose={() => setSelectedDemand(null)}
        isModerator
        onMakeDecision={handleMakeDecision}
      />

      <DecisionModal
        open={decisionDemand !== null}
        onClose={() => setDecisionDemand(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        demand={decisionDemand}
        isLoading={isDecisionModalLoading}
      />
    </div>
  );
}
