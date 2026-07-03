import { clsx } from 'clsx';

export default function StatCard({ icon: Icon, label, value, colorClass = 'text-primary-500', bgClass = 'bg-primary-50', subtitle }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className={clsx('flex h-12 w-12 items-center justify-center rounded-xl', bgClass)}>
            <Icon size={24} className={colorClass} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
