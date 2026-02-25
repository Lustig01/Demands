import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DemandsTable, { demandColumnConfig, type DemandColumnKey } from '../components/projects/DemandsTable';
import DemandDetailSidebar from '../components/demands/DemandDetailSidebar';
import DecisionModal from '../components/management/DecisionModal';
import BulkDecisionModal from '../components/management/BulkDecisionModal';
import PageHeader from '../components/layout/PageHeader';
import ColumnSettingsDropdown from '../components/common/ColumnSettingsDropdown';
import { FilterSort } from '../components/common/filters';
import { useDemands } from '../hooks/useDemands';
import { useCachedProjects } from '../hooks/useCachedProjects';
import { useReferenceData } from '../hooks/useReferenceData';
import { useDebounce } from '../hooks/useDebounce';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import { useTableColumns } from '../hooks/useTableColumns';
import type { ApproveDemandPayload, RejectDemandPayload, BulkDemandFilters } from '../api/types';
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

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set());
  const [isAllAcrossPagesSelected, setIsAllAcrossPagesSelected] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const { showToast } = useToast();

  const { demands, total, totalPending, totalPages, totalValue, totalApprovedValue, isLoading, error, approveDemand, rejectDemand, bulkApproveDemands, bulkRejectDemands } = useDemands(
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
      managed: true,
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

  // Bulk selection derived state — only Pending demands are selectable
  const currentPageIds = useMemo(() => demands.filter((d) => d.status === 'Pending').map((d) => d.id), [demands]);

  const isAllPageSelected = isAllAcrossPagesSelected
    ? currentPageIds.length > 0 && currentPageIds.every((id) => !excludedIds.has(id))
    : currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));
  const isSomePageSelected = isAllAcrossPagesSelected
    ? currentPageIds.some((id) => !excludedIds.has(id))
    : currentPageIds.some((id) => selectedIds.has(id));
  const selectedCount = isAllAcrossPagesSelected ? totalPending - excludedIds.size : selectedIds.size;
  const hasSelection = isAllAcrossPagesSelected || selectedIds.size > 0;

  // When filters/page change, clear "all across pages" flag but keep explicit selections
  // that are still on the current page
  const handleFilterChange = useCallback((key: DemandFilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setIsAllAcrossPagesSelected(false);
    setSelectedIds(new Set());
    setExcludedIds(new Set());
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(initialDemandFilters);
    setCurrentPage(1);
    setIsAllAcrossPagesSelected(false);
    setSelectedIds(new Set());
    setExcludedIds(new Set());
  }, []);

  const handleSortChange = useCallback((field: DemandSortKey | null, direction: SortDirection) => {
    setSortState({ field, direction });
  }, []);

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

  // Bulk selection handlers
  const handleToggleSelect = useCallback((id: number) => {
    if (isAllAcrossPagesSelected) {
      setExcludedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  }, [isAllAcrossPagesSelected]);

  const handleSelectAllPage = useCallback((checked: boolean) => {
    if (isAllAcrossPagesSelected) {
      setExcludedIds((prev) => {
        const next = new Set(prev);
        if (checked) currentPageIds.forEach((id) => next.delete(id));
        else currentPageIds.forEach((id) => next.add(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) currentPageIds.forEach((id) => next.add(id));
        else currentPageIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  }, [isAllAcrossPagesSelected, currentPageIds]);

  const handleSelectAllAcrossPages = useCallback(() => {
    setIsAllAcrossPagesSelected(true);
    setExcludedIds(new Set());
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setExcludedIds(new Set());
    setIsAllAcrossPagesSelected(false);
  }, []);

  // Build filters payload for "select all" bulk operations
  const bulkFilters = useMemo((): BulkDemandFilters => ({
    project: debouncedFilters.projectName || undefined,
    resource: debouncedFilters.resourceName || undefined,
    resourceService: debouncedFilters.serviceName || undefined,
    base: debouncedFilters.base || undefined,
    environment: debouncedFilters.environment || undefined,
    network: debouncedFilters.network || undefined,
    cluster: debouncedFilters.cluster || undefined,
    type: debouncedFilters.type || undefined,
    status: debouncedFilters.status || undefined,
    projectType: debouncedFilters.projectType || undefined,
    median: debouncedFilters.median || undefined,
    year: debouncedFilters.year ? Number(debouncedFilters.year) : undefined,
    relatedTo: debouncedFilters.relatedTo || undefined,
    emergencyOption: debouncedFilters.emergencyOption || undefined,
    priority: debouncedFilters.priority || undefined,
  }), [debouncedFilters]);

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

  async function handleBulkApprove(payload: ApproveDemandPayload) {
    setIsBulkLoading(true);
    try {
      const count = await bulkApproveDemands(
        isAllAcrossPagesSelected
          ? { selectAll: true, filters: bulkFilters, excludedIds: excludedIds.size > 0 ? Array.from(excludedIds) : undefined, ...payload }
          : { ids: Array.from(selectedIds), ...payload }
      );
      showToast(t('management.bulkDecision.successApproved', { count }), 'success');
      handleClearSelection();
    } catch (err: any) {
      showToast(err?.response?.data?.error || t('management.error.approveFailed'), 'error');
    } finally {
      setIsBulkLoading(false);
    }
  }

  async function handleBulkReject(payload: RejectDemandPayload) {
    setIsBulkLoading(true);
    try {
      const count = await bulkRejectDemands(
        isAllAcrossPagesSelected
          ? { selectAll: true, filters: bulkFilters, excludedIds: excludedIds.size > 0 ? Array.from(excludedIds) : undefined, reason: payload.reason }
          : { ids: Array.from(selectedIds), reason: payload.reason }
      );
      showToast(t('management.bulkDecision.successRejected', { count }), 'success');
      handleClearSelection();
    } catch (err: any) {
      showToast(err?.response?.data?.error || t('management.error.rejectFailed'), 'error');
    } finally {
      setIsBulkLoading(false);
    }
  }

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

      {/* Bulk Action Bar */}
      {(hasSelection || totalPending > 0) && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-sm font-medium text-primary flex-1">
            {hasSelection
              ? isAllAcrossPagesSelected && excludedIds.size === 0
                ? t('management.bulk.allSelected', { count: totalPending })
                : t('management.bulk.selected', { count: selectedCount })
              : t('management.bulk.noneSelected')}
          </span>
          {selectedCount < totalPending && totalPending > 0 && (
            <button
              onClick={handleSelectAllAcrossPages}
              className="px-4 py-1.5 bg-transparent text-primary border border-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {t('management.bulk.selectAllAcrossPages', { count: totalPending })}
            </button>
          )}
          {hasSelection && (
            <>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-none"
              >
                {t('management.bulk.changeStatus')}
              </button>
              <button
                onClick={handleClearSelection}
                className="px-4 py-1.5 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border-none"
              >
                {t('management.bulk.clearSelection')}
              </button>
            </>
          )}
        </div>
      )}

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
                showCheckboxes
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                isAllPageSelected={isAllPageSelected}
                isSomePageSelected={isSomePageSelected}
                onSelectAllPage={handleSelectAllPage}
                isAllAcrossPagesSelected={isAllAcrossPagesSelected}
                excludedIds={excludedIds}
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

      <BulkDecisionModal
        open={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onApprove={handleBulkApprove}
        onReject={handleBulkReject}
        selectedCount={selectedCount}
        isLoading={isBulkLoading}
      />
    </div>
  );
}
