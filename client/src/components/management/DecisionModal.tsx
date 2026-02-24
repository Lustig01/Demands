import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import type { Demand } from '../../types/domain';
import type { ApprovalStatus, ApproveDemandPayload, RejectDemandPayload } from '../../api/types';

type DecisionType = ApprovalStatus | 'Rejected';

interface DecisionModalProps {
    open: boolean;
    onClose: () => void;
    onApprove: (payload: ApproveDemandPayload) => Promise<void>;
    onReject: (payload: RejectDemandPayload) => Promise<void>;
    demand: Demand | null;
    isLoading?: boolean;
}

export default function DecisionModal({ open, onClose, onApprove, onReject, demand, isLoading }: DecisionModalProps) {
    const { t } = useTranslation();

    const [decisionType, setDecisionType] = useState<DecisionType>('Approved');
    const [approvedValue, setApprovedValue] = useState<number>(0);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const requiresValue = decisionType === 'PartiallyApproved' || decisionType === 'ApprovedWithCondition';
    const requiresReason = decisionType !== 'Approved';

    useEffect(() => {
        if (demand && open) {
            setDecisionType('Approved');
            setApprovedValue(demand.value);
            setReason('');
        }
        setIsSubmitting(false);
    }, [demand, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!demand) return;

        setIsSubmitting(true);
        try {
            if (decisionType === 'Rejected') {
                await onReject({ reason: reason.trim() });
            } else {
                const payload: ApproveDemandPayload = {
                    status: decisionType,
                    ...(requiresValue && { approvedValue }),
                    ...(requiresReason && { reason: reason.trim() }),
                };
                await onApprove(payload);
            }
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = () => {
        if (requiresValue && (approvedValue === undefined || approvedValue <= 0)) return false;
        if (requiresReason && (!reason || reason.trim() === '')) return false;
        return true;
    };

    if (!demand) return null;

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={t('management.decisionModal.title')}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Demand Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-text-secondary">{t('projects.columns.service')}:</span>{' '}
                            <span className="font-medium">{demand.serviceName}</span>
                        </div>
                        <div>
                            <span className="text-text-secondary">{t('projects.columns.resource')}:</span>{' '}
                            <span className="font-medium">{demand.resourceName}</span>
                        </div>
                        <div>
                            <span className="text-text-secondary">{t('projects.columns.value')}:</span>{' '}
                            <span className="font-medium">{demand.value} {demand.unit}</span>
                        </div>
                        <div>
                            <span className="text-text-secondary">{t('projects.columns.project')}:</span>{' '}
                            <span className="font-medium">{demand.projectName}</span>
                        </div>
                    </div>
                </div>

                {/* Decision Type Radio Buttons */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-text-primary">
                        {t('management.decisionModal.decisionType')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {(['Approved', 'PartiallyApproved', 'ApprovedWithCondition', 'Rejected'] as DecisionType[]).map((type) => (
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
                                    name="decisionType"
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

                {/* Approved Value (conditional) */}
                {requiresValue && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary">
                            {t('management.decisionModal.approvedValue')} <span className="text-danger">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-divider bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                value={approvedValue}
                                onChange={(e) => setApprovedValue(Number(e.target.value))}
                                min="0"
                                max={demand.value}
                                required
                            />
                            <span className="text-sm text-text-secondary">{demand.unit}</span>
                        </div>
                        <span className="text-xs text-text-secondary">
                            {t('management.decisionModal.requestedValue')}: {demand.value} {demand.unit}
                        </span>
                    </div>
                )}

                {/* Reason (conditional) */}
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
                        {t('management.decisionModal.submit')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
