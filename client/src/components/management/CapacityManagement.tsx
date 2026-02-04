import { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useCapacities } from '../../hooks/useCapacities';
import type { Capacity } from '../../api/types';
import CapacityTable from './CapacityTable';
import CapacityModal from './CapacityModal';
import { useToast } from '../common/Toast';

export default function CapacityManagement() {
    const { t } = useTranslation();
    const {
        capacities,
        isLoading,
        error,
        fetchCapacities,
        createCapacity,
        updateCapacity,
        deleteCapacity
    } = useCapacities();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCapacity, setSelectedCapacity] = useState<Capacity | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCapacities();
    }, [fetchCapacities]);

    const handleCreate = () => {
        setSelectedCapacity(null);
        setIsModalOpen(true);
    };

    const handleEdit = (capacity: Capacity) => {
        setSelectedCapacity(capacity);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('Are you sure you want to delete this capacity?'))) { // TODO: Add translation
            try {
                await deleteCapacity(id);
                showToast('Capacity deleted successfully', 'success');
            } catch (err) {
                showToast('Failed to delete capacity', 'error');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedCapacity) {
                await updateCapacity({ id: selectedCapacity.id, value: data.value });
                showToast('Capacity updated successfully', 'success');
            } else {
                await createCapacity(data);
                showToast('Capacity created successfully', 'success');
            }
            setIsModalOpen(false);
        } catch (err: any) {
            // Error is already logged in hook, showing toast
            showToast(err.response?.data?.error || 'Operation failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary m-0">
                    {t('management.tabs.capacity')}
                </h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-paper rounded-xl hover:bg-black transition-colors border-none cursor-pointer font-medium"
                >
                    <MdAdd size={20} />
                    {t('management.capacity.add')}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <CapacityTable
                capacities={capacities}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading && !isSubmitting} // Don't show skeleton when submitting modal
            />

            {isModalOpen && (
                <CapacityModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    capacity={selectedCapacity}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
}
