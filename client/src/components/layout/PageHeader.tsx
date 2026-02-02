import type { IconType } from 'react-icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
}

export default function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {Icon && <Icon size={36} className="text-primary" />}
      <div>
        <h2 className="text-xl font-bold text-text-primary m-0">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary m-0">{subtitle}</p>}
      </div>
    </div>
  );
}
