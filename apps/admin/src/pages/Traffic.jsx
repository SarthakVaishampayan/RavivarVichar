import { useState, useEffect, useCallback } from 'react';
import {
  Users, Eye, Activity, TrendingUp, Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../lib/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';

const DATE_RANGES = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
  { label: 'Year', value: 365 },
];

export default function Traffic() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchTraffic = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/analytics/traffic?days=${days}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load traffic data:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchTraffic();
  }, [fetchTraffic]);

  if (loading && !data) return <LoadingSpinner className="min-h-[60vh]" />;

  const summary = data?.summary || {};
  const topPages = data?.topPages || [];
  const topReferrers = data?.topReferrers || [];
  const visitorTrend = data?.visitorTrend || [];

  return (
    <div className="page-container">
      <div className="page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Traffic Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visitor statistics and pageview data
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDays(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                days === range.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Active Now"
          value={summary.activeNow ?? '—'}
          colorClass="text-green-500"
          bgClass="bg-green-50"
        />
        <StatCard
          icon={Activity}
          label="Visitors Today"
          value={summary.visitorsToday ?? '—'}
          colorClass="text-blue-500"
          bgClass="bg-blue-50"
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={summary.visitorsThisWeek ?? '—'}
          colorClass="text-primary-500"
          bgClass="bg-primary-50"
        />
        <StatCard
          icon={Users}
          label="This Period"
          value={summary.visitorsThisMonth ?? '—'}
          colorClass="text-purple-500"
          bgClass="bg-purple-50"
        />
        <StatCard
          icon={Eye}
          label="Pageviews"
          value={summary.totalPageviews ?? '—'}
          colorClass="text-amber-500"
          bgClass="bg-amber-50"
        />
        <StatCard
          icon={Clock}
          label="Sessions"
          value={summary.totalSessions ?? '—'}
          colorClass="text-rose-500"
          bgClass="bg-rose-50"
        />
      </div>

      {/* Visitor Trend Chart */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-base font-semibold text-gray-900">Visitor Trend</h2>
        </div>
        <div className="card-body">
          {visitorTrend.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      });
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Pageviews"
                    fill="#F4A43B"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No visitor data yet. Data will appear once visitors start browsing the site.
            </div>
          )}
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Top Pages</h2>
          </div>
          <div className="card-body p-0">
            {topPages.length > 0 ? (
              <div className="overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                        Page
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                        Views
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topPages.map((page, i) => (
                      <tr key={page.path} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                            <span className="text-sm text-gray-700 truncate max-w-[250px]" title={page.path}>
                              {page.path || '/'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium text-right">
                          {page.count}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-right">
                          {summary.totalPageviews > 0
                            ? ((page.count / summary.totalPageviews) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No page data yet
              </div>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Top Referrers</h2>
          </div>
          <div className="card-body p-0">
            {topReferrers.length > 0 ? (
              <div className="overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                        Source
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                        Visits
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topReferrers.map((ref) => (
                      <tr key={ref.referrer} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700 truncate max-w-[250px] block" title={ref.referrer}>
                            {ref.referrer || 'Direct'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium text-right">
                          {ref.count}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-right">
                          {summary.totalPageviews > 0
                            ? ((ref.count / summary.totalPageviews) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No referrer data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchTraffic}
          disabled={loading}
          className="btn-ghost text-sm flex items-center gap-2"
        >
          <Clock size={14} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}
