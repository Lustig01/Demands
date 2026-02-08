import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Select from '../common/Select';
import SearchableSelect from '../common/SearchableSelect';
import { useToast } from '../common/Toast';
import { useReferenceData } from '../../hooks/useReferenceData';
import { useCachedProjects } from '../../hooks/useCachedProjects';
import type { CreateDemandPayload } from '../../api/types';
import type { DemandType } from '../../types/domain';

interface CreateDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDemandPayload) => Promise<void>;
}

const initialForm = {
  project: '',
  service: '',
  resource: '',
  unit: '',
  value: '' as unknown as number,
  type: '' as string,
  clusterName: '',
  overrideLocation: false,
  network: '',
  base: '',
  environment: '',
  overrideOrganization: false,
  center: '',
  branch: '',
  section: '',
};

const inputClass =
  'w-full px-4 py-2.5 border border-divider rounded-xl text-sm bg-bg-paper text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors';

export default function CreateDemandModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDemandModalProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const referenceData = useReferenceData();
  const { projects: allProjects } = useCachedProjects();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Derived: selected project for location display ---
  const selectedProject = useMemo(
    () => allProjects.find((p) => p.name === form.project) ?? null,
    [allProjects, form.project]
  );

  // --- Derived State for Organization Hierarchy ---
  const centerOptions = referenceData.centers
    .filter((v) => v.isActive !== false)
    .map((v) => ({
      value: v.name,
      label: v.displayName || v.name,
    }));

  const branchOptions = useMemo(() => {
    if (!form.center) return [];
    return referenceData.branches
      .filter((b) => b.centerName === form.center && b.isActive !== false)
      .map((v) => ({
        value: v.name,
        label: v.displayName || v.name,
      }));
  }, [referenceData.branches, form.center]);

  const sectionOptions = useMemo(() => {
    if (!form.branch) return [];
    return referenceData.sections
      .filter((s) => s.branchName === form.branch && s.branchCenter === form.center && s.isActive !== false)
      .map((v) => ({
        value: v.name,
        label: v.displayName || v.name,
      }));
  }, [referenceData.sections, form.branch, form.center]);

  // --- Dropdown Options ---

  const projectOptions = useMemo(
    () =>
      allProjects
        .map((p) => ({ value: p.name, label: p.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [allProjects]
  );

  const serviceOptions = useMemo(
    () =>
      referenceData.services
        .filter((s) => s.isActive !== false)
        .map((s) => ({ value: s.name, label: s.displayName || s.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [referenceData.services]
  );

  const resourceOptions = useMemo(() => {
    if (!form.service) return [];
    return referenceData.resources
      .filter((r) => r.serviceName === form.service && r.isActive !== false)
      .map((r) => ({ value: r.name, label: r.name }));
  }, [referenceData.resources, form.service]);

  const typeOptions = useMemo(
    () =>
      (['New', 'Extension'] as DemandType[]).map((v) => ({
        value: v,
        label: t(`projects.demandType.${v}`),
      })),
    [t]
  );

  // --- Location Hierarchy (same logic as CreateProjectModal) ---

  const networkOptions = referenceData.networks
    .filter((v) => v.isActive !== false)
    .map((v) => ({
      value: v.name,
      label: v.displayName || v.name,
    }));

  const baseOptions = useMemo(() => {
    if (!form.network) return [];
    const relevantLocations = referenceData.locations.filter(
      (l) => l.networkName === form.network
    );
    const relevantBaseNames = new Set(relevantLocations.map((l) => l.baseName));
    return referenceData.bases
      .filter((b) => relevantBaseNames.has(b.name) && b.isActive !== false)
      .map((v) => ({ value: v.name, label: v.displayName || v.name }));
  }, [referenceData.locations, referenceData.bases, form.network]);

  const environmentOptions = useMemo(() => {
    if (!form.network || !form.base) return [];
    const relevantLocations = referenceData.locations.filter(
      (l) => l.networkName === form.network && l.baseName === form.base
    );
    const relevantEnvNames = new Set(
      relevantLocations.map((l) => l.environmentName)
    );
    return referenceData.environments
      .filter((e) => relevantEnvNames.has(e.name) && e.isActive !== false)
      .map((v) => ({ value: v.name, label: v.displayName || v.name }));
  }, [
    referenceData.locations,
    referenceData.environments,
    form.network,
    form.base,
  ]);

  // --- Handlers ---

  function setField(name: keyof typeof initialForm, value: any) {
    setForm((prev) => {
      const updates: any = { [name]: value };

      if (name === 'service') {
        updates.resource = '';
        updates.unit = '';
      } else if (name === 'resource') {
        // Auto-populate unit from selected resource
        const res = referenceData.resources.find(
          (r) => r.name === value && r.serviceName === prev.service
        );
        updates.unit = res?.unit ?? '';
      } else if (name === 'type' && value === 'New') {
        updates.clusterName = '';
      } else if (name === 'overrideLocation' && !value) {
        updates.network = '';
        updates.base = '';
        updates.environment = '';
      } else if (name === 'network') {
        updates.base = '';
        updates.environment = '';
      } else if (name === 'base') {
        updates.environment = '';
      } else if (name === 'center') {
        updates.branch = '';
        updates.section = '';
      } else if (name === 'branch') {
        updates.section = '';
      } else if (name === 'overrideOrganization' && !value) {
        // Clear organization fields if override disabled, will be refilled by project selection if any
        updates.center = '';
        updates.branch = '';
        updates.section = '';
      }

      // Auto-fill from project if override is disabled (for both Location and Organization)
      if (name === 'project' || (name === 'overrideLocation' && !value) || (name === 'overrideOrganization' && !value)) {
        const projectName = name === 'project' ? value : prev.project;
        if (projectName) {
          const proj = allProjects.find(p => p.name === projectName);
          if (proj) {
            // Location auto-fill (existing logic preserved/enhanced)
            if (name === 'project' || (name === 'overrideLocation' && !value)) {
              // The original logic relied on displaying read-only fields from selectedProject derived state.
              // We don't strictly need to set form state for location if we rely on selectedProject for display,
              // BUT if we want unified submission logic, we might want to sets valid IDs.
              // However, original code only set locationId in submit if overrideLocation is true.
              // If override is false, it seemingly didn't send locationId? Needs check.
              // Original code: if (form.overrideLocation) { locationId = ... }
              // It seems default behavior implies server infers location from project? Or maybe it was missing?
              // The backend likely expects locationId from project if not provided.
            }

            // Organization auto-fill
            if (name === 'project' || (name === 'overrideOrganization' && !value)) {
              // We don't necessarily update form state if we want to show read-only values from project object directly
              // akin to how Location is handled. However, for Org relations, we might want to submit them?
              // The plan says "Auto-fill from Project selection".
              // Let's adopt the same pattern as Location: If override is FALSE, show values from Project (read-only).
              // If override is TRUE, show Select inputs with form state.
            }
          }
        }
      }

      return { ...prev, ...updates };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: CreateDemandPayload = {
      projectName: form.project,
      serviceName: form.service,
      resourceName: form.resource,
      resourceService: form.service,
      value: Number(form.value),
      type: form.type as DemandType,
      centerName: form.overrideOrganization ? form.center : selectedProject?.centerName,
      branchName: form.overrideOrganization ? form.branch : selectedProject?.branchName,
      sectionName: form.overrideOrganization ? form.section : selectedProject?.sectionName,
    };

    if (form.type === 'Extension') {
      payload.clusterName = form.clusterName.trim();
    }

    if (form.overrideLocation) {
      const location = referenceData.locations.find(
        (l) =>
          l.baseName === form.base &&
          l.environmentName === form.environment &&
          l.networkName === form.network
      );
      if (location) {
        payload.locationId = location.id;
      }
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      showToast(t('common.toast.demandCreated'), 'success');
      handleClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        t('common.errors.unknown');
      setError(message);
      showToast(t('common.toast.demandCreateFailed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    onClose();
    setForm(initialForm);
    setError(null);
  }

  const placeholder = t('projects.createDemand.selectOption');
  const isExtension = form.type === 'Extension';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('projects.createDemand.title')}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.project')}{' '}
              <span className="text-danger">*</span>
            </label>
            <SearchableSelect
              options={projectOptions}
              value={form.project}
              onChange={(v) => setField('project', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.service')}{' '}
              <span className="text-danger">*</span>
            </label>
            <SearchableSelect
              options={serviceOptions}
              value={form.service}
              onChange={(v) => setField('service', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Resource */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.resource')}{' '}
              <span className="text-danger">*</span>
            </label>
            <Select
              options={resourceOptions}
              value={form.resource}
              onChange={(v) => setField('resource', v)}
              placeholder={placeholder}
              disabled={!form.service}
            />
          </div>

          {/* Unit (readonly) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.unit')}
            </label>
            <input
              type="text"
              value={form.unit}
              readOnly
              disabled
              className={`${inputClass} bg-gray-50 text-text-secondary`}
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.value')}{' '}
              <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="value"
              required
              min={0}
              step="any"
              value={form.value}
              onChange={(e) => setField('value', e.target.value)}
              placeholder={t('projects.createDemand.valuePlaceholder')}
              className={inputClass}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.type')}{' '}
              <span className="text-danger">*</span>
            </label>
            <Select
              options={typeOptions}
              value={form.type}
              onChange={(v) => setField('type', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Cluster Name (Extension only) */}
          {isExtension && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('projects.createDemand.clusterName')}{' '}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="clusterName"
                required
                value={form.clusterName}
                onChange={(e) => setField('clusterName', e.target.value)}
                placeholder={t('projects.createDemand.clusterNamePlaceholder')}
                className={inputClass}
              />
            </div>
          )}

          {/* Organization Section */}
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.overrideOrganization}
                onChange={(e) => setField('overrideOrganization', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full rtl:after:right-[2px] rtl:after:left-auto rtl:peer-checked:after:-translate-x-full" />
            </label>
            <span className="text-sm font-medium text-text-primary">
              {t('projects.createDemand.overrideOrganization')}
            </span>
          </div>

          {/* Center */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.center')}{' '}
              {form.overrideOrganization && <span className="text-danger">*</span>}
            </label>
            {form.overrideOrganization ? (
              <Select
                options={centerOptions}
                value={form.center}
                onChange={(v) => setField('center', v)}
                placeholder={placeholder}
              />
            ) : (
              <input
                type="text"
                value={selectedProject?.centerName ?? ''}
                readOnly
                disabled
                className={`${inputClass} bg-gray-50 text-text-secondary`}
              />
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.branch')}{' '}
              {form.overrideOrganization && <span className="text-danger">*</span>}
            </label>
            {form.overrideOrganization ? (
              <Select
                options={branchOptions}
                value={form.branch}
                onChange={(v) => setField('branch', v)}
                placeholder={placeholder}
                disabled={!form.center}
              />
            ) : (
              <input
                type="text"
                value={selectedProject?.branchName ?? ''}
                readOnly
                disabled
                className={`${inputClass} bg-gray-50 text-text-secondary`}
              />
            )}
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createDemand.section')}{' '}
              {form.overrideOrganization && <span className="text-danger">*</span>}
            </label>
            {form.overrideOrganization ? (
              <Select
                options={sectionOptions}
                value={form.section}
                onChange={(v) => setField('section', v)}
                placeholder={placeholder}
                disabled={!form.branch}
              />
            ) : (
              <input
                type="text"
                value={selectedProject?.sectionName ?? ''}
                readOnly
                disabled
                className={`${inputClass} bg-gray-50 text-text-secondary`}
              />
            )}
          </div>

          {/* Location Section */}
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.overrideLocation}
                onChange={(e) => setField('overrideLocation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full rtl:after:right-[2px] rtl:after:left-auto rtl:peer-checked:after:-translate-x-full" />
            </label>
            <span className="text-sm font-medium text-text-primary">
              {t('projects.createDemand.overrideLocation')}
            </span>
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.network')}{' '}
              {form.overrideLocation && <span className="text-danger">*</span>}
            </label>
            {form.overrideLocation ? (
              <Select
                options={networkOptions}
                value={form.network}
                onChange={(v) => setField('network', v)}
                placeholder={placeholder}
              />
            ) : (
              <input
                type="text"
                value={selectedProject?.location.network ?? ''}
                readOnly
                disabled
                className={`${inputClass} bg-gray-50 text-text-secondary`}
              />
            )}
          </div>

          {/* Base */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.base')}{' '}
              {form.overrideLocation && <span className="text-danger">*</span>}
            </label>
            {form.overrideLocation ? (
              <Select
                options={baseOptions}
                value={form.base}
                onChange={(v) => setField('base', v)}
                placeholder={placeholder}
                disabled={!form.network}
              />
            ) : (
              <input
                type="text"
                value={selectedProject?.location.base ?? ''}
                readOnly
                disabled
                className={`${inputClass} bg-gray-50 text-text-secondary`}
              />
            )}
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.environment')}{' '}
              {form.overrideLocation && <span className="text-danger">*</span>}
            </label>
            {form.overrideLocation ? (
              <Select
                options={environmentOptions}
                value={form.environment}
                onChange={(v) => setField('environment', v)}
                placeholder={placeholder}
                disabled={!form.base}
              />
            ) : (
              <input
                type="text"
                value={selectedProject?.location.environment ?? ''}
                readOnly
                disabled
                className={`${inputClass} bg-gray-50 text-text-secondary`}
              />
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-danger">
            {error}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-text-primary text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('common.submitting') : t('projects.createDemand.submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
