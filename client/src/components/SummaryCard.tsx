import React from 'react';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    color = 'primary'
}) => {
    const getBorderColor = () => {
        switch (color) {
            case 'success': return 'var(--color-success)';
            case 'warning': return 'var(--color-warning)';
            case 'danger': return 'var(--color-danger)';
            case 'info': return 'var(--color-info)';
            default: return 'var(--color-primary)';
        }
    };

    return (
        <div className="card animate-fade-in" style={{ borderLeft: `4px solid ${getBorderColor()}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                        {title}
                    </p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {value}
                    </h3>
                </div>
                {icon && (
                    <div style={{
                        color: getBorderColor(),
                        background: `color-mix(in srgb, ${getBorderColor()} 10%, transparent)`,
                        padding: '0.75rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};
