import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MdFilterList } from 'react-icons/md';
import DemandsTable from '../components/projects/DemandsTable';
import PageHeader from '../components/layout/PageHeader';
import { useDemands } from '../hooks/useDemands';
import { useReferenceData } from '../hooks/useReferenceData';
import Select from '../components/common/Select';
import SearchableSelect, { type SearchableSelectOption } from '../components/common/SearchableSelect';
import Pagination from '../components/common/Pagination';

// Helper component for labeled filters
const FilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary">{label}</label>
        {children}
    </div>
);

export default function DemandsPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter State
    const [filters, setFilters] = useState({
        projectName: searchParams.get('project') || '',
        serviceName: '',
        resourceName: '',
        resourceService: '',
        base: '',
        environment: '',
        network: '',
        type: '',
        status: '',
    });

    const { demands, total, totalPages, isLoading, error } = useDemands({
        ...filters,
        baseName: filters.base,
        environmentName: filters.environment,
        networkName: filters.network,
        type: filters.type as any,
        status: filters.status as any
    }, { page: currentPage, limit: itemsPerPage });
    const { bases, environments, networks, services, resources } = useReferenceData();
    const [allProjects, setAllProjects] = useState<any[]>([]);

    // Fetch all projects for the filter dropdown
    useMemo(() => {
        // Simple fire-and-forget fetch for projects dropdown
        import('../api/apiService').then(({ fetchProjects }) => {
            fetchProjects({ limit: 1000 }).then((res) => setAllProjects(res.data));
        });
    }, []);

    // Derive Options from Reference Data
    const projectOptions: SearchableSelectOption[] = useMemo(() =>
        allProjects.map(p => ({ value: p.name, label: p.name })).sort((a, b) => a.label.localeCompare(b.label))
        , [allProjects]);

    const serviceOptions: SearchableSelectOption[] = useMemo(() =>
        services.map(s => ({ value: s.name, label: s.displayName || s.name })).sort((a, b) => a.label.localeCompare(b.label))
        , [services]);

    const resourceOptions = useMemo(() =>
        resources.map(r => ({ value: r.name, label: r.name })).filter((v, i, a) => a.findIndex(t => t.value === v.value) === i).sort((a, b) => a.label.localeCompare(b.label))
        , [resources]);

    const resourceServiceOptions = useMemo(() =>
        resources.map(r => ({ value: r.serviceName, label: r.serviceName })).filter((v, i, a) => a.findIndex(t => t.value === v.value) === i).sort((a, b) => a.label.localeCompare(b.label))
        , [resources]);

    const baseOptions = useMemo(() => bases.map(b => ({ value: b.name, label: b.displayName || b.name })), [bases]);
    const environmentOptions = useMemo(() => environments.map(e => ({ value: e.name, label: e.displayName || e.name })), [environments]);
    const networkOptions = useMemo(() => networks.map(n => ({ value: n.name, label: n.displayName || n.name })), [networks]);

    // Static options
    const typeOptions = useMemo(() => [
        { value: 'New', label: 'New' },
        { value: 'Extension', label: 'Extension' }
    ], []);

    const statusOptions = useMemo(() => [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'PartiallyApproved', label: 'Partially Approved' },
        { value: 'Rejected', label: 'Rejected' }
    ], []);


    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };



    return (
        <div className="p-6 space-y-6">
            <PageHeader title={t('nav.demands')} />

            {/* Filters Card */}
            <div className="bg-bg-paper rounded-2xl border border-divider shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4 text-text-secondary">
                    <MdFilterList size={20} />
                    <span className="font-semibold">{t('common.filters', 'Filters')}</span>
                    {Object.values(filters).some(Boolean) && (
                        <button
                            onClick={() => {
                                setFilters({
                                    projectName: '',
                                    serviceName: '',
                                    resourceName: '',
                                    resourceService: '',
                                    base: '',
                                    environment: '',
                                    network: '',
                                    type: '',
                                    status: '',
                                });
                                setCurrentPage(1);
                            }}
                            className="text-xs text-primary font-medium hover:underline bg-transparent border-none cursor-pointer ms-auto"
                        >
                            {t('common.clearFilters')}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <FilterField label={t('projects.columns.project')}>
                        <SearchableSelect
                            options={projectOptions}
                            value={filters.projectName}
                            onChange={(val) => handleFilterChange('projectName', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.service')}>
                        <SearchableSelect
                            options={serviceOptions}
                            value={filters.serviceName}
                            onChange={(val) => handleFilterChange('serviceName', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.resource')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...resourceOptions]}
                            value={filters.resourceName}
                            onChange={(val) => handleFilterChange('resourceName', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.resourceService')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...resourceServiceOptions]}
                            value={filters.resourceService}
                            onChange={(val) => handleFilterChange('resourceService', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.base')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...baseOptions]}
                            value={filters.base}
                            onChange={(val) => handleFilterChange('base', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.environment')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...environmentOptions]}
                            value={filters.environment}
                            onChange={(val) => handleFilterChange('environment', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.network')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...networkOptions]}
                            value={filters.network}
                            onChange={(val) => handleFilterChange('network', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.type')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...typeOptions]}
                            value={filters.type}
                            onChange={(val) => handleFilterChange('type', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>

                    <FilterField label={t('projects.columns.status')}>
                        <Select
                            options={[{ value: '', label: t('common.all') }, ...statusOptions]}
                            value={filters.status}
                            onChange={(val) => handleFilterChange('status', val)}
                            placeholder={t('common.all')}
                        />
                    </FilterField>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-bg-paper rounded-2xl border border-divider shadow-sm overflow-hidden">
                {error ? (
                    <div className="p-12 text-center text-danger">{error}</div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <DemandsTable demands={demands} isLoading={isLoading} />
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
        </div>
    );
}
