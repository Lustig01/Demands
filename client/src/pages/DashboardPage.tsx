import { useTranslation } from 'react-i18next';
import { MdDashboard } from 'react-icons/md';
import PageHeader from '../components/layout/PageHeader';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        icon={MdDashboard}
      />
      <p className="text-text-secondary">{t('dashboard.placeholder')}</p>
    </div>
  );
}
