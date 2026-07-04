import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Mail, Phone, MapPin, Briefcase, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const statusColors = {
  'under-consideration': 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  posted: 'bg-blue-100 text-blue-800',
  denied: 'bg-red-100 text-red-800',
};

const resourceConfigs = {
  contacts: {
    label: 'Contact Message',
    apiPath: '/contact',
    fields: [
      { key: 'name', label: 'Name', icon: User },
      { key: 'email', label: 'Email', icon: Mail },
      { key: 'subject', label: 'Subject' },
      { key: 'message', label: 'Message', fullWidth: true },
    ],
  },
  newsletters: {
    label: 'Newsletter Subscriber',
    apiPath: '/newsletter',
    fields: [
      { key: 'email', label: 'Email', icon: Mail },
    ],
  },
  joinInitiative: {
    label: 'Join Initiative',
    apiPath: '/join-initiative',
    fields: [
      { key: 'name', label: 'Name', icon: User },
      { key: 'phoneNo', label: 'Phone No.', icon: Phone },
      { key: 'city', label: 'City', icon: MapPin },
      { key: 'state', label: 'State' },
      { key: 'reasonToJoin', label: 'Reason to Join', fullWidth: true },
      { key: 'briefAboutWork', label: 'Brief About Work', fullWidth: true },
    ],
  },
  featureRequests: {
    label: 'Feature Request',
    apiPath: '/feature-requests',
    fields: [
      { key: 'name', label: 'Name', icon: User },
      { key: 'placeOfWork', label: 'Place of Work' },
      { key: 'typeOfWork', label: 'Type of Work' },
      { key: 'phoneNo', label: 'Phone No.', icon: Phone },
    ],
  },
  partnerApplications: {
    label: 'Partner Application',
    apiPath: '/partner-applications',
    fields: [
      { key: 'name', label: 'Name', icon: User },
      { key: 'organization', label: 'Organization', icon: Briefcase },
      { key: 'email', label: 'Email', icon: Mail },
      { key: 'phoneNo', label: 'Phone No.', icon: Phone },
      { key: 'message', label: 'Message', fullWidth: true },
    ],
  },
};

export default function SubmissionDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract resourceKey from the URL path (e.g., /content/joinInitiative/abc/edit → joinInitiative)
  const pathParts = location.pathname.split('/');
  const resourceKey = pathParts[pathParts.length - 3]; // /content/{resourceKey}/:id/edit

  const config = resourceConfigs[resourceKey];
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!config) {
      navigate('/content', { replace: true });
      return;
    }
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`${config.apiPath}/${id}`);
        setItem(data.data);
      } catch (err) {
        toast.error('Failed to load submission');
        navigate(`/content/${resourceKey}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, config, resourceKey, navigate]);

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      await api.put(`${config.apiPath}/${id}/status`, { status });
      toast.success(`${config.label} marked as ${status.replace('-', ' ')}`);
      const { data } = await api.get(`${config.apiPath}/${id}`);
      setItem(data.data);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!item) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentStatus = item.status || 'under-consideration';

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/content/${resourceKey}`)}
            className="btn-ghost text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>
            <h1 className="page-title">{config.label}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Review submission details</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[currentStatus] || statusColors['under-consideration']}`}>
          {currentStatus === 'approved' && <CheckCircle size={14} />}
          {currentStatus === 'posted' && <CheckCircle size={14} />}
          {currentStatus === 'under-consideration' && <Clock size={14} />}
          {currentStatus === 'denied' && <XCircle size={14} />}
          {currentStatus.replace('-', ' ')}
        </span>
      </div>

      {/* Timestamps */}
      <div className="card mb-6">
        <div className="card-body flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            Submitted: {formatDate(item.createdAt)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} />
            Updated: {formatDate(item.updatedAt)}
          </span>
        </div>
      </div>

      {/* Review Actions */}
      <div className="card mb-6">
        <div className="card-body">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Review Action</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleStatus('approved')}
              disabled={updating || currentStatus === 'approved'}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                currentStatus === 'approved'
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
              }`}
            >
              <CheckCircle size={18} />
              {currentStatus === 'approved' ? 'Approved' : 'Mark as Approved'}
            </button>
            <button
              onClick={() => handleStatus('under-consideration')}
              disabled={updating || currentStatus === 'under-consideration'}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                currentStatus === 'under-consideration'
                  ? 'bg-yellow-100 text-yellow-700 cursor-default'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50'
              }`}
            >
              <Clock size={18} />
              {currentStatus === 'under-consideration' ? 'Under Consideration' : 'Mark Under Consideration'}
            </button>
            <button
              onClick={() => handleStatus('posted')}
              disabled={updating || currentStatus === 'posted'}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                currentStatus === 'posted'
                  ? 'bg-blue-100 text-blue-700 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
              }`}
            >
              <CheckCircle size={18} />
              {currentStatus === 'posted' ? 'Posted' : 'Mark as Posted'}
            </button>
            <button
              onClick={() => handleStatus('denied')}
              disabled={updating || currentStatus === 'denied'}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                currentStatus === 'denied'
                  ? 'bg-red-100 text-red-700 cursor-default'
                  : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
              }`}
            >
              <XCircle size={18} />
              {currentStatus === 'denied' ? 'Denied' : 'Deny'}
            </button>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.fields.map((field) => {
              const value = item[field.key];
              const Icon = field.icon;
              return (
                <div
                  key={field.key}
                  className={field.fullWidth ? 'md:col-span-2' : ''}
                >
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {Icon && <Icon size={13} />}
                    {field.label}
                  </label>
                  <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {field.key === 'email' && value ? (
                      <a href={`mailto:${value}`} className="text-primary-600 hover:underline inline-flex items-center gap-1">
                        {value}
                        <ExternalLink size={12} />
                      </a>
                    ) : field.key === 'url' && value ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline inline-flex items-center gap-1">
                        {value}
                        <ExternalLink size={12} />
                      </a>
                    ) : value ? (
                      value
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
