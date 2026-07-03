import { useNavigate } from 'react-router-dom';
import { RESOURCES } from '../../lib/constants';
import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ContentHub() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await api.get('/analytics/summary');
        if (data.success && data.data?.contentBreakdown) {
          const countsMap = {};
          Object.entries(data.data.contentBreakdown).forEach(([key, val]) => {
            countsMap[key] = val.count;
          });
          setCounts(countsMap);
        }
      } catch {
        // Silently fail - counts will show as 0
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Content</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a content type to manage</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Object.entries(RESOURCES).map(([key, resource]) => {
            const Icon = resource.icon;
            const count = counts[key] || 0;
            return (
              <button
                key={key}
                onClick={() => navigate(`/content/${key}`)}
                className="card p-6 text-left transition-all hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${resource.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className={resource.color} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{resource.label}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {count} {count === 1 ? 'item' : 'items'}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
