import { useTranslation } from 'react-i18next';
import { MdSearch } from 'react-icons/md';

interface DemandsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showRemoved: boolean;
  onShowRemovedChange: (value: boolean) => void;
}

export default function DemandsFilterBar({
  searchTerm,
  onSearchChange,
  showRemoved,
  onShowRemovedChange,
}: DemandsFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 mb-4 flex-wrap">
      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showRemoved}
          onChange={(e) => onShowRemovedChange(e.target.checked)}
          className="accent-primary"
        />
        {t('projects.showRemoved')}
      </label>

      <div className="relative flex-1 min-w-[200px]">
        <MdSearch
          size={18}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          placeholder={t('projects.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full ps-9 pe-4 py-2 border border-divider rounded-xl text-sm bg-bg-paper text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
