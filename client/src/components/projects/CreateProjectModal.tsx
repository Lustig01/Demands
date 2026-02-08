import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Select from '../common/Select';
import { useToast } from '../common/Toast';
import { useReferenceData } from '../../hooks/useReferenceData';
import type { ProjectType } from '../../types/domain';
import type { CreateProjectPayload, Priority } from '../../api/types';
import type { Median } from '../../types/domain';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProjectPayload) => Promise<void>;
}

const initialForm = {
  name: '',
  trackOrApp: '',
  center: '',
  branch: '',
  section: '',
  requestType: '',
  priority: '',
  projectKind: '',
  environment: '',
  network: '',
  base: '',
  purpose: '',
  median: '',
  year: '' as unknown as number,
  emergencyOption: '',
};

const inputClass =
  'w-full px-4 py-2.5 border border-divider rounded-xl text-sm bg-bg-paper text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors';

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectModalProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const referenceData = useReferenceData();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Derived State for Hierarchies ---

  // Organization Hierarchy: Center -> Branch -> Section
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
    // Note: Section also depends on branchCenter, but practically branch names are unique or scoped.
    // Ideally we check both branchName and branchCenter.
    return referenceData.sections
      .filter((s) => s.branchName === form.branch && s.branchCenter === form.center && s.isActive !== false)
      .map((v) => ({
        value: v.name,
        label: v.displayName || v.name,
      }));
  }, [referenceData.sections, form.branch, form.center]);


  // Location Hierarchy: Network -> Base -> Environment
  const networkOptions = referenceData.networks
    .filter((v) => v.isActive !== false)
    .map((v) => ({
      value: v.name,
      label: v.displayName || v.name,
    }));

  const baseOptions = useMemo(() => {
    if (!form.network) return [];
    // Filter available locations by network, then extract unique bases
    const relevantLocations = referenceData.locations.filter(l => l.networkName === form.network);
    const relevantBaseNames = new Set(relevantLocations.map(l => l.baseName));

    return referenceData.bases
      .filter(b => relevantBaseNames.has(b.name) && b.isActive !== false)
      .map((v) => ({
        value: v.name,
        label: v.displayName || v.name,
      }));
  }, [referenceData.locations, referenceData.bases, form.network]);

  const environmentOptions = useMemo(() => {
    if (!form.network || !form.base) return [];
    // Filter available locations by network and base, then extract unique environments
    const relevantLocations = referenceData.locations.filter(
      l => l.networkName === form.network && l.baseName === form.base
    );
    const relevantEnvNames = new Set(relevantLocations.map(l => l.environmentName));

    return referenceData.environments
      .filter(e => relevantEnvNames.has(e.name) && e.isActive !== false)
      .map((v) => ({
        value: v.name,
        label: v.displayName || v.name,
      }));
  }, [referenceData.locations, referenceData.environments, form.network, form.base]);


  // --- Other Options ---

  const requestTypeOptions = (['Semiannual', 'Emergency'] as ProjectType[]).map(
    (v) => ({ value: v, label: t(`projects.type.${v}`) })
  );

  const priorityOptions = (['P1', 'P2', 'P3'] as Priority[]).map((p) => ({
    value: p,
    label: t(`projects.createProject.priorityOptions.${p}`),
  }));

  const projectKindOptions = referenceData.projectKinds
    .filter((v) => v.isActive !== false)
    .map((v) => ({
      value: v.name,
      label: v.displayName || v.name,
    }));

  const medianOptions = (['H1', 'H2'] as Median[]).map((m) => ({
    value: m,
    label: m,
  }));

  const emergencyOptionOptions = referenceData.emergencyOptions
    .filter((v) => v.isActive !== false)
    .map((v) => ({
      value: v.name,
      label: v.name,
    }));

  // --- Handlers ---

  function setField(name: keyof typeof initialForm, value: any) {
    setForm((prev) => {
      const updates: any = { [name]: value };

      // Reset downstream selections when upstream changes
      if (name === 'center') {
        updates.branch = '';
        updates.section = '';
      } else if (name === 'branch') {
        updates.section = '';
      } else if (name === 'network') {
        updates.base = '';
        updates.environment = '';
      } else if (name === 'base') {
        updates.environment = '';
      }

      return { ...prev, ...updates };
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setField(e.target.name as keyof typeof initialForm, e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const location = referenceData.locations.find(
      (l) =>
        l.baseName === form.base &&
        l.environmentName === form.environment &&
        l.networkName === form.network
    );

    if (!location) return;

    const payload: CreateProjectPayload = {
      name: form.name.trim(),
      purpose: form.purpose.trim(),
      relatedTo: form.trackOrApp.trim() || undefined,
      type: (form.requestType as ProjectType) || 'Semiannual',
      kind: form.projectKind || referenceData.projectKinds[0]?.name || '',
      locationId: location.id,
      centerName: form.center,
      branchName: form.branch,
      sectionName: form.section,
      priority: form.priority as Priority,
    };

    if (form.requestType === 'Semiannual') {
      if (form.year) payload.year = Number(form.year);
      if (form.median) payload.median = form.median as Median;
    }

    if (form.requestType === 'Emergency' && form.emergencyOption) {
      payload.emergencyOption = form.emergencyOption;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      showToast(t('common.toast.projectCreated'), 'success');
      handleClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        t('common.errors.unknown');
      setError(message);
      showToast(t('common.toast.projectCreateFailed'), 'error');
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

  const placeholder = t('projects.createProject.selectOption');
  const isSemiannual = form.requestType === 'Semiannual';
  const isEmergency = form.requestType === 'Emergency';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('projects.createProject.title')}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.name')}{' '}
              <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder={t('projects.createProject.namePlaceholder')}
              className={inputClass}
            />
          </div>

          {/* Track / Application */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.trackOrApp')}
            </label>
            <input
              type="text"
              name="trackOrApp"
              value={form.trackOrApp}
              onChange={handleChange}
              placeholder={t('projects.createProject.trackOrAppPlaceholder')}
              className={inputClass}
            />
          </div>

          {/* Center */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.center')} <span className="text-danger">*</span>
            </label>
            <Select
              options={centerOptions}
              value={form.center}
              onChange={(v) => setField('center', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.branch')} <span className="text-danger">*</span>
            </label>
            <Select
              options={branchOptions}
              value={form.branch}
              onChange={(v) => setField('branch', v)}
              placeholder={placeholder}
              disabled={!form.center}
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.section')} <span className="text-danger">*</span>
            </label>
            <Select
              options={sectionOptions}
              value={form.section}
              onChange={(v) => setField('section', v)}
              placeholder={placeholder}
              disabled={!form.branch}
            />
          </div>


          {/* Project Type & Kind Row Breakdown */}

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.requestType')}{' '}
              <span className="text-danger">*</span>
            </label>
            <Select
              options={requestTypeOptions}
              value={form.requestType}
              onChange={(v) => setField('requestType', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.priority')} <span className="text-danger">*</span>
            </label>
            <Select
              options={priorityOptions}
              value={form.priority}
              onChange={(v) => setField('priority', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Kind */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.projectType')}
            </label>
            <Select
              options={projectKindOptions}
              value={form.projectKind}
              onChange={(v) => setField('projectKind', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Semiannual Fields */}
          {isSemiannual && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t('projects.createProject.year')} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="202X"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t('projects.createProject.median')} <span className="text-danger">*</span>
                </label>
                <Select
                  options={medianOptions}
                  value={form.median}
                  onChange={(v) => setField('median', v)}
                  placeholder={placeholder}
                />
              </div>
            </>
          )}

          {/* Emergency Fields */}
          {isEmergency && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('projects.createProject.emergencyOption')} <span className="text-danger">*</span>
              </label>
              <Select
                options={emergencyOptionOptions}
                value={form.emergencyOption}
                onChange={(v) => setField('emergencyOption', v)}
                placeholder={placeholder}
              />
            </div>
          )}

          {/* Location Hierarchy */}

          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.network')} <span className="text-danger">*</span>
            </label>
            <Select
              options={networkOptions}
              value={form.network}
              onChange={(v) => setField('network', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Base */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.base')} <span className="text-danger">*</span>
            </label>
            <Select
              options={baseOptions}
              value={form.base}
              onChange={(v) => setField('base', v)}
              placeholder={placeholder}
              disabled={!form.network}
            />
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.environment')} <span className="text-danger">*</span>
            </label>
            <Select
              options={environmentOptions}
              value={form.environment}
              onChange={(v) => setField('environment', v)}
              placeholder={placeholder}
              disabled={!form.base}
            />
          </div>

          {/* Purpose */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.purpose')}
            </label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder={t('projects.createProject.purposePlaceholder')}
              rows={3}
              className={`${inputClass} resize-y`}
            />
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
            {isSubmitting ? t('common.submitting') : t('projects.createProject.submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
