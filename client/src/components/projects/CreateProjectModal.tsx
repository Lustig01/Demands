import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import Modal from '../common/Modal';
import Select from '../common/Select';
import type { ProjectType, ProjectKind } from '../../types/domain';
import type { CreateProjectPayload, ReferenceItem, BranchItem, LocationItem } from '../../api/types';

interface ReferenceData {
  bases: ReferenceItem[];
  environments: ReferenceItem[];
  networks: ReferenceItem[];
  centers: ReferenceItem[];
  branches: BranchItem[];
  locations: LocationItem[];
  isLoading: boolean;
  error: string | null;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProjectPayload) => void;
  referenceData: ReferenceData;
}

const initialForm = {
  name: '',
  trackOrApp: '',
  center: '',
  branch: '',
  requestType: '',
  priority: 'P2',
  projectKind: '',
  environment: '',
  network: '',
  base: '',
  purpose: '',
};

const inputClass =
  'w-full px-4 py-2.5 border border-divider rounded-xl text-sm bg-bg-paper text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors';

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  referenceData,
}: CreateProjectModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [centerLocked, setCenterLocked] = useState(true);
  const [branchLocked, setBranchLocked] = useState(true);

  function setField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setField(e.target.name, e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const location = referenceData.locations.find(
      (l) =>
        l.baseName === form.base &&
        l.environmentName === form.environment &&
        l.networkName === form.network
    );

    const payload: CreateProjectPayload = {
      name: form.name.trim(),
      purpose: form.purpose.trim(),
      type: (form.requestType as ProjectType) || 'Semiannual',
      kind: (form.projectKind as ProjectKind) || 'App',
      locationId: location?.id ?? 0,
    };

    onSubmit(payload);
    setForm(initialForm);
    setCenterLocked(true);
    setBranchLocked(true);
  }

  function handleClose() {
    onClose();
    setForm(initialForm);
    setCenterLocked(true);
    setBranchLocked(true);
  }

  const requestTypeOptions = (['Semiannual', 'Emergency'] as ProjectType[]).map(
    (v) => ({ value: v, label: t(`projects.type.${v}`) })
  );

  const priorityOptions = (['P1', 'P2', 'P3'] as const).map((p) => ({
    value: p,
    label: t(`projects.createProject.priorityOptions.${p}`),
  }));

  const projectKindOptions = (['App', 'Track'] as ProjectKind[]).map((v) => ({
    value: v,
    label: t(`projects.kind.${v}`),
  }));

  const environmentOptions = referenceData.environments.map((v) => ({
    value: v.name,
    label: v.displayName || v.name,
  }));

  const networkOptions = referenceData.networks.map((v) => ({
    value: v.name,
    label: v.displayName || v.name,
  }));

  const baseOptions = referenceData.bases.map((v) => ({
    value: v.name,
    label: v.displayName || v.name,
  }));

  const centerOptions = referenceData.centers.map((v) => ({
    value: v.name,
    label: v.displayName || v.name,
  }));

  const branchOptions = referenceData.branches.map((v) => ({
    value: v.name,
    label: v.displayName || v.name,
  }));

  const placeholder = t('projects.createProject.selectOption');

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

          {/* Center (auto-identified) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-text-primary">
                {t('projects.createProject.center')}
              </label>
              <div className="flex items-center gap-2">
                {centerLocked && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <MdCheck size={14} />
                    {t('projects.createProject.autoIdentified')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setCenterLocked((v) => !v)}
                  className="text-xs text-text-secondary border border-divider rounded-lg px-2.5 py-1 bg-bg-paper hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {t('projects.createProject.change')}
                </button>
              </div>
            </div>
            <Select
              options={centerOptions}
              value={form.center}
              onChange={(v) => setField('center', v)}
              disabled={centerLocked}
            />
          </div>

          {/* Branch (auto-identified) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-text-primary">
                {t('projects.createProject.branch')}
              </label>
              <div className="flex items-center gap-2">
                {branchLocked && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <MdCheck size={14} />
                    {t('projects.createProject.autoIdentified')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setBranchLocked((v) => !v)}
                  className="text-xs text-text-secondary border border-divider rounded-lg px-2.5 py-1 bg-bg-paper hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {t('projects.createProject.change')}
                </button>
              </div>
            </div>
            <Select
              options={branchOptions}
              value={form.branch}
              onChange={(v) => setField('branch', v)}
              disabled={branchLocked}
            />
          </div>

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
              {t('projects.createProject.priority')}
            </label>
            <Select
              options={priorityOptions}
              value={form.priority}
              onChange={(v) => setField('priority', v)}
            />
          </div>

          {/* Project Type */}
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

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.environment')}
            </label>
            <Select
              options={environmentOptions}
              value={form.environment}
              onChange={(v) => setField('environment', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('projects.createProject.network')}
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
              {t('projects.createProject.base')}
            </label>
            <Select
              options={baseOptions}
              value={form.base}
              onChange={(v) => setField('base', v)}
              placeholder={placeholder}
            />
          </div>

          {/* Purpose (full width) */}
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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2.5 bg-text-primary text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer border-none"
          >
            {t('projects.createProject.submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
