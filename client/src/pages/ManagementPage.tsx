import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CapacityManagement from '../components/management/CapacityManagement';

export default function ManagementPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: t('management.tabs.capacity'), component: <CapacityManagement /> },
        { label: 'Placeholder', component: <div className="p-8 text-center text-text-secondary">Future Content</div> }
    ];

    return (
        <div className="max-w-[1600px] mx-auto p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary mb-2">{t('nav.moderator')}</h1>
            </div>

            {/* Tabs Header */}
            <div className="flex items-center gap-1 border-b border-divider mb-8">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 font-medium text-sm transition-all relative cursor-pointer border-none bg-transparent outline-none
              ${activeTab === index
                                ? 'text-primary'
                                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-t-lg'
                            }`}
                    >
                        {tab.label}
                        {activeTab === index && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-slide-in">
                {tabs[activeTab].component}
            </div>
        </div>
    );
}
