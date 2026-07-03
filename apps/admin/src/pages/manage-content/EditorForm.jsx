import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Send } from 'lucide-react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditorForm({
  resourceKey,
  resourceLabel,
  apiPath,
  fields,
  transformSave = (data) => data,
  transformLoad = (data) => data,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const fetchItem = async () => {
        try {
          const { data } = await api.get(`${apiPath}/${id}`);
          setFormData(transformLoad(data.data || data));
        } catch (err) {
          toast.error('Failed to load item');
          navigate(`/content/${resourceKey}`);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [id, isNew, apiPath, resourceKey, navigate, transformLoad]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = transformSave(formData);
      if (isNew) {
        await api.post(apiPath, payload);
        toast.success(`${resourceLabel} created`);
      } else {
        await api.put(`${apiPath}/${id}`, payload);
        toast.success(`${resourceLabel} updated`);
      }
      navigate(`/content/${resourceKey}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const setField = (name) => ({
    value: formData[name] ?? '',
    onChange: (e) => handleChange(name, e?.target?.value !== undefined ? e.target.value : e),
  });

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/content/${resourceKey}`)} className="btn-ghost">
          <ArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 className="page-title">{isNew ? `New ${resourceLabel.slice(0, -1)}` : `Edit ${resourceLabel.slice(0, -1)}`}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields({
          formData,
          handleChange: (key, value) => handleChange(key, value),
          setField,
          isNew,
        })}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={() => navigate(`/content/${resourceKey}`)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isNew ? 'Create' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
