import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Layers, Briefcase, Users, Calendar,
  BarChart3, Plus, ArrowRight, Clock,
} from 'lucide-react';
import api from '../lib/axios';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ContentPieChart from '../components/charts/ContentPieChart';
import MonthlyPostChart from '../components/charts/MonthlyPostChart';

const contentTypes = [
  { key: 'articles', label: 'Articles', icon: FileText, color: 'text-primary-500', bg: 'bg-primary-50', path: '/content/articles' },
  { key: 'programs', label: 'Programs', icon: Layers, color: 'text-secondary-500', bg: 'bg-secondary-50', path: '/content/programs' },
  { key: 'projects', label: 'Projects', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', path: '/content/projects' },
  { key: 'events', label: 'Events', icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50', path: '/content/events' },
  { key: 'partners', label: 'Partners', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', path: '/content/partners' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/analytics/summary');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;

  const breakdown = data?.contentBreakdown
    ? Object.values(data.contentBreakdown).filter((item) => item.count > 0)
    : [];

  const stats = data?.stats || {};
  const recentActivity = data?.recentActivity || [];

  // Generate monthly data from activity log
  const monthlyMap = {};
  recentActivity.forEach((a) => {
    if (a.createdAt) {
      const d = new Date(a.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + 1;
    }
  });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const totalContent = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your content management system</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {contentTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => navigate(type.path)}
            className="text-left transition-transform hover:scale-[1.02]"
          >
            <StatCard
              icon={type.icon}
              label={type.label}
              value={data?.contentBreakdown?.[type.key]?.count || 0}
              colorClass={type.color}
              bgClass={type.bg}
            />
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Content Distribution</h2>
          </div>
          <div className="card-body">
            {totalContent > 0 ? (
              <ContentPieChart data={breakdown} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No content yet. Start adding content to see distribution.
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="card-body max-h-80 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No recent activity
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity._id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Clock size={14} className="text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="font-medium capitalize">{activity.action}</span>{' '}
                        <span className="text-gray-500">{activity.resource}</span>
                      </p>
                      {activity.details && (
                        <p className="text-xs text-gray-400 truncate">{activity.details}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(activity.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Monthly Activity</h2>
          </div>
          <div className="card-body">
            {monthlyData.length > 0 ? (
              <MonthlyPostChart data={monthlyData} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No activity data yet
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Quick Stats</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Published</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{stats.publishedArticles || 0}</p>
                <p className="text-xs text-blue-500 mt-0.5">Articles</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Drafts</p>
                <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.draftArticles || 0}</p>
                <p className="text-xs text-yellow-500 mt-0.5">Articles</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Ongoing</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{stats.ongoingProjects || 0}</p>
                <p className="text-xs text-green-500 mt-0.5">Projects</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Upcoming</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{stats.upcomingEvents || 0}</p>
                <p className="text-xs text-purple-500 mt-0.5">Events</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <button
                onClick={() => navigate('/content/articles?action=new')}
                className="btn-ghost w-full justify-start text-sm"
              >
                <Plus size={16} />
                Add New Article
              </button>
              <button
                onClick={() => navigate('/content/projects?action=new')}
                className="btn-ghost w-full justify-start text-sm"
              >
                <Plus size={16} />
                Add New Project
              </button>
              <button
                onClick={() => navigate('/content/events?action=new')}
                className="btn-ghost w-full justify-start text-sm"
              >
                <Plus size={16} />
                Add New Event
              </button>
              <button
                onClick={() => navigate('/content')}
                className="btn-ghost w-full justify-start text-sm text-primary-600"
              >
                <BarChart3 size={16} />
                Manage All Content
                <ArrowRight size={16} className="ml-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
