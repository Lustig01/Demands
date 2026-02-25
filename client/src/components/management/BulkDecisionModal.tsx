import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import type { ApproveDemandPayload, RejectDemandPayload } from '../../api/types';

type BulkDecisionType = 'Approved' | 'Rejected';

interface BulkDecisionModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: (payload: ApproveDemandPayload) => Promise<void>;
  onReject: (payload: RejectDemandPayload) => Promise<void>;
  selectedCount: number;
  isLoading?: boolean;
}

export default function BulkDecisionModal({
  open,
  onClose,
  onApprove,
  onReject,
  selectedCount,
  isLoading,
}: BulkDecisionModalProps) {
  const { t } = useTranslation();

  const [decisionType, setDecisionType] = useState<BulkDecisionType>('Approved');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDecisionType('Approved');
      setReason('');
    }
    setIsSubmitting(false);
  }, [open]);

  const requiresReason = decisionType === 'Rejected';

  const isValid = () => {
    if (requiresReason && (!reason || reason.trim() === '')) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (decisionType === 'Rejected') {
        await onReject({ reason: reason.trim() });
      } else {
        await onApprove({ status: decisionType });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={t('management.bulkDecision.title')}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-text-secondary">
          {t('management.bulkDecision.summary', { count: selectedCount })}
        </div>

        {/* Decision Type */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-text-primary">
            {t('management.decisionModal.decisionType')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['Approved', 'Rejected'] as BulkDecisionType[]).map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  decisionType === type
                    ? type === 'Rejected'
                      ? 'border-danger bg-danger/5'
                      : 'border-primary bg-primary/5'
                    : 'border-divider hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="bulkDecisionType"
                  value={type}
                  checked={decisionType === type}
                  onChange={() => setDecisionType(type)}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">
                  {t(`management.decisionModal.${type}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reason (for Rejected) */}
        {requiresReason && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">
              {t('management.decisionModal.reason')} <span className="text-danger">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-divider bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('management.decisionModal.reasonPlaceholder')}
              rows={3}
              required
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-text-primary rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border-none"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading || isSubmitting || !isValid()}
            className={`px-6 py-2.5 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed ${
              decisionType === 'Rejected'
                ? 'bg-danger hover:bg-red-700'
                : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {(isLoading || isSubmitting) && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block me-2"></div>
            )}
            {t('management.bulkDecision.submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
