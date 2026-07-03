import { clsx } from 'clsx';

const statusStyles = {
  published: 'bg-green-50 text-green-700 ring-green-600/20',
  draft: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  active: 'bg-green-50 text-green-700 ring-green-600/20',
  inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  ongoing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  completed: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  upcoming: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  past: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  true: 'bg-green-50 text-green-700 ring-green-600/20',
  false: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  government: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  corporate: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  ngo: 'bg-teal-50 text-teal-700 ring-teal-600/20',
  educational: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  news: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'press-release': 'bg-purple-50 text-purple-700 ring-purple-600/20',
  podcast: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  video: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export default function StatusBadge({ status, className = '' }) {
  const value = status?.toString().toLowerCase() || 'draft';
  const style = statusStyles[value] || 'bg-gray-50 text-gray-600 ring-gray-500/20';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize',
        style,
        className
      )}
    >
      {status || 'Unknown'}
    </span>
  );
}
