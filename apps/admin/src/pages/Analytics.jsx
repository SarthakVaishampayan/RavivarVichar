import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, FileText, Users, Calendar } from 'lucide-react';
import api from '../lib/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';
import ContentPieChart from '../components/charts/ContentPieChart';
import MonthlyPostChart from '../components/charts/MonthlyPostChart';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: res } = await api.get('/analytics/summary');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!data) return <div className="page-container"><p className="text-gray-500">Failed to load analytics data.</p></div>;

  const breakdown = data.contentBreakdown
    ? Object.values(data.contentBreakdown).filter((item) => item.count > 0)
    : [];

  const stats = data.stats || {};

  // Generate monthly data
  const monthlyMap = {};
  (data.recentActivity || []).forEach((a) => {
    if (a.createdAt) {
      const d = new Date(a.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + 1;
    }
  });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed content analytics and statistics</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BarChart3} label="Total Content Items" value={data.total} colorClass="text-primary-500" bgClass="bg-primary-50" />
        <StatCard icon={FileText} label="Published Articles" value={stats.publishedArticles || 0} colorClass="text-green-500" bgClass="bg-green-50" />
        <StatCard icon={TrendingUp} label="Ongoing Projects" value={stats.ongoingProjects || 0} colorClass="text-blue-500" bgClass="bg-blue-50" />
        <StatCard icon={Calendar} label="Upcoming Events" value={stats.upcomingEvents || 0} colorClass="text-purple-500" bgClass="bg-purple-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Content Distribution</h2>
          </div>
          <div className="card-body">
            {breakdown.length > 0 ? <ContentPieChart data={breakdown} /> : <p className="text-gray-400 text-sm py-12 text-center">No data</p>}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Activity Timeline</h2>
          </div>
          <div className="card-body">
            {monthlyData.length > 0 ? <MonthlyPostChart data={monthlyData} /> : <p className="text-gray-400 text-sm py-12 text-center">No activity data</p>}
          </div>
        </div>
      </div>

      {/* Content Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-base font-semibold text-gray-900">Content Breakdown</h2>
        </div>
        <div className="card-body">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Count</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {breakdown.map((item) => (
                  <tr key={item.label} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.count}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {data.total > 0 ? ((item.count / data.total) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
