import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MdFilterList, MdSearch } from 'react-icons/md';
import DemandsTable from '../components/projects/DemandsTable';
import PageHeader from '../components/layout/PageHeader';
import { mockDemands } from '../data/mockDemands';
import Select, { type SelectOption } from '../components/common/Select';
import SearchableSelect, { type SearchableSelectOption } from '../components/common/SearchableSelect';
import Pagination from '../components/common/Pagination';


// Helper to extract unique options from data
function getUniqueOptions(data: any[], key: string, labelKey?: string): SelectOption[] {
    const values = new Set<string>();
    const options: SelectOption[] = [];

    data.forEach(item => {
        const value = String(key.includes('.') ? key.split('.').reduce((o, i) => o[i], item) : item[key]);
        if (!values.has(value)) {
            values.add(value);
            options.push({ value, label: labelKey ? item[labelKey] : value });
        }
    });

    return options.sort((a, b) => a.label.localeCompare(b.label));
}

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

    // Filter States
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

    const [globalSearch, setGlobalSearch] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Derive Options from Data
    const projectOptions: SearchableSelectOption[] = useMemo(() => getUniqueOptions(mockDemands, 'projectName'), []);
    const serviceOptions: SearchableSelectOption[] = useMemo(() => getUniqueOptions(mockDemands, 'serviceName'), []);
    const resourceOptions = useMemo(() => getUniqueOptions(mockDemands, 'resourceName'), []);
    const resourceServiceOptions = useMemo(() => getUniqueOptions(mockDemands, 'resourceService'), []);
    const baseOptions = useMemo(() => getUniqueOptions(mockDemands, 'location.base'), []);
    const environmentOptions = useMemo(() => getUniqueOptions(mockDemands, 'location.environment'), []);
    const networkOptions = useMemo(() => getUniqueOptions(mockDemands, 'location.network'), []);
    const typeOptions = useMemo(() => getUniqueOptions(mockDemands, 'type'), []);
    const statusOptions = useMemo(() => getUniqueOptions(mockDemands, 'status'), []);

    // Filter Data
    const filteredDemands = useMemo(() => {
        return mockDemands.filter((demand) => {
            // Global Search
            if (globalSearch) {
                const searchLower = globalSearch.toLowerCase();
                const matchesGlobal =
                    demand.projectName.toLowerCase().includes(searchLower) ||
                    demand.serviceName.toLowerCase().includes(searchLower) ||
                    demand.resourceName.toLowerCase().includes(searchLower);

                if (!matchesGlobal) return false;
            }

            // Specific Filters
            if (filters.projectName && demand.projectName !== filters.projectName) return false;
            if (filters.serviceName && demand.serviceName !== filters.serviceName) return false;
            if (filters.resourceName && demand.resourceName !== filters.resourceName) return false;
            if (filters.resourceService && demand.resourceService !== filters.resourceService) return false;
            if (filters.base && demand.location.base !== filters.base) return false;
            if (filters.environment && demand.location.environment !== filters.environment) return false;
            if (filters.network && demand.location.network !== filters.network) return false;
            if (filters.type && demand.type !== filters.type) return false;
            if (filters.status && demand.status !== filters.status) return false;
            return true;
        });
    }, [filters, globalSearch]);

    // Paginate Data
    const paginatedDemands = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDemands.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDemands, currentPage]);

    const totalPages = Math.ceil(filteredDemands.length / itemsPerPage);

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
                {/* Toolbar */}
                <div className="p-4 border-b border-divider flex items-center justify-end">
                    <div className="relative w-64">
                        <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            value={globalSearch}
                            onChange={(e) => {
                                setGlobalSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={t('common.search')}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-divider rounded-xl focus:outline-none focus:border-primary text-text-primary bg-bg-default"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <DemandsTable demands={paginatedDemands} />
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredDemands.length}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
}
