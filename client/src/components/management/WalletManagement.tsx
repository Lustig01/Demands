import { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useWallets } from '../../hooks/useWallets';
import type { Wallet } from '../../api/types';
import WalletTable from './WalletTable';
import WalletModal from './WalletModal';
import { useToast } from '../common/Toast';

export default function WalletManagement() {
    const { t } = useTranslation();
    const {
        wallets,
        isLoading,
        error,
        fetchWallets,
        createWallet,
        updateWallet,
        deleteWallet
    } = useWallets();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const handleCreate = () => {
        setSelectedWallet(null);
        setIsModalOpen(true);
    };

    const handleEdit = (wallet: Wallet) => {
        setSelectedWallet(wallet);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('management.wallet.confirmDelete'))) {
            try {
                await deleteWallet(id);
                showToast(t('management.wallet.deleteSuccess'), 'success');
            } catch (err) {
                showToast(t('management.wallet.deleteFailed'), 'error');
            }
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedWallet) {
                await updateWallet({ id: selectedWallet.id, value: data.value });
                showToast(t('management.wallet.updateSuccess'), 'success');
            } else {
                await createWallet(data);
                showToast(t('management.wallet.createSuccess'), 'success');
            }
            setIsModalOpen(false);
        } catch (err: any) {
            showToast(err.response?.data?.error || t('management.wallet.operationFailed'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary m-0">
                    {t('management.tabs.wallet')}
                </h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-paper rounded-xl hover:bg-black transition-colors border-none cursor-pointer font-medium"
                >
                    <MdAdd size={20} />
                    {t('management.wallet.add')}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <WalletTable
                wallets={wallets}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading && !isSubmitting}
            />

            {isModalOpen && (
                <WalletModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    wallet={selectedWallet}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
}
