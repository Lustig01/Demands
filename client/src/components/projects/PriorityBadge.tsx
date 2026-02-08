import { useTranslation } from 'react-i18next';
import type { Priority } from '../../types/domain';

const priorityStyles: Record<Priority, string> = {
  P1: 'bg-red-100 text-red-800',
  P2: 'bg-yellow-100 text-yellow-800',
  P3: 'bg-green-100 text-green-800',
};

interface PriorityBadgeProps {
  priority?: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation();

  if (!priority) return <span>-</span>;

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[priority]}`}
    >
      {t(`projects.priority.${priority}`)}
    </span>
  );
}
