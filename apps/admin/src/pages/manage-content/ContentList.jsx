import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import api from '../../lib/axios';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { createColumnHelper } from '@tanstack/react-table';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function ContentList({ resourceKey, resourceConfig, fetchFn }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFn();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load data');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`${resourceConfig.apiPath}/${deleteTarget._id}`);
      toast.success(`${resourceConfig.label} deleted`);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const cols = [];

    // Name/title column
    cols.push(
      columnHelper.accessor((row) => row.title || row.name || row.groupName || 'Untitled', {
        id: 'title',
        header: resourceKey === 'shgs' ? 'Group Name' : resourceKey === 'mentors' ? 'Name' : resourceKey === 'entrepreneurs' ? 'Name' : 'Title',
        cell: (info) => (
          <div className="flex items-center gap-3">
            {info.row.original.thumbnail || info.row.original.photo || info.row.original.logo ? (
              <img
                src={info.row.original.thumbnail || info.row.original.photo || info.row.original.logo}
                alt=""
                className="h-8 w-8 rounded-lg object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : null}
            <span className="font-medium text-gray-900 truncate max-w-[200px] block">
              {info.getValue()}
            </span>
          </div>
        ),
      })
    );

    // Status/type columns based on resource
    if (['articles', 'programs', 'projects', 'partners'].includes(resourceKey)) {
      cols.push(
        columnHelper.accessor('status', {
          header: 'Status',
          cell: (info) => <StatusBadge status={info.getValue()} />,
        })
      );
    }
    if (resourceKey === 'events') {
      cols.push(
        columnHelper.accessor('type', {
          header: 'Type',
          cell: (info) => <StatusBadge status={info.getValue()} />,
        })
      );
    }
    if (resourceKey === 'media') {
      cols.push(
        columnHelper.accessor('type', {
          header: 'Type',
          cell: (info) => <StatusBadge status={info.getValue()} />,
        })
      );
    }
    if (resourceKey === 'articles') {
      cols.push(
        columnHelper.accessor('category', {
          header: 'Category',
          cell: (info) => (
            <span className="text-sm text-gray-500">{info.getValue() || '—'}</span>
          ),
        })
      );
    }
    if (resourceKey === 'partners') {
      cols.push(
        columnHelper.accessor('category', {
          header: 'Category',
          cell: (info) => <StatusBadge status={info.getValue()} />,
        })
      );
    }
    if (resourceKey === 'testimonials') {
      cols.push(
        columnHelper.accessor('featured', {
          header: 'Featured',
          cell: (info) => <StatusBadge status={info.getValue() ? 'true' : 'false'} />,
        })
      );
    }
    if (resourceKey === 'entrepreneurs') {
      cols.push(
        columnHelper.accessor('district', {
          header: 'District',
          cell: (info) => <span className="text-sm text-gray-500">{info.getValue() || '—'}</span>,
        })
      );
    }
    if (resourceKey === 'shgs') {
      cols.push(
        columnHelper.accessor('members', {
          header: 'Members',
          cell: (info) => <span className="text-sm text-gray-500">{info.getValue() || 0}</span>,
        })
      );
    }

    cols.push(
      columnHelper.accessor('updatedAt', {
        header: 'Updated',
        cell: (info) => <span className="text-sm text-gray-500">{formatDate(info.getValue())}</span>,
      })
    );

    cols.push(
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => navigate(`/content/${resourceKey}/${info.row.original._id}/edit`)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Edit"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(info.row.original);
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      })
    );

    return cols;
  }, [resourceKey, resourceConfig, navigate]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/content')}
            className="btn-ghost text-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="page-title">{resourceConfig.label}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all {resourceConfig.label.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        searchPlaceholder={`Search ${resourceConfig.label.toLowerCase()}...`}
        addLabel={`Add ${resourceConfig.label.slice(0, -1)}`}
        onAdd={() => navigate(`/content/${resourceKey}/new`)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${resourceConfig.label.slice(0, -1)}?`}
        message={`Are you sure you want to delete "${deleteTarget?.title || deleteTarget?.name || deleteTarget?.groupName || 'this item'}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
