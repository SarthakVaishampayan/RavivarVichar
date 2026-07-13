import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Send } from 'lucide-react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditorForm({
  resourceKey,
  resourceLabel,
  singularLabel,
  apiPath,
  fields,
  transformSave = (data) => data,
  transformLoad = (data) => data,
  defaultValues = {},
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [formData, setFormData] = useState(isNew ? { ...defaultValues } : {});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Stable refs so transformLoad/transformSave don't trigger re-fetch on every render
  const transformLoadRef = useRef(transformLoad);
  transformLoadRef.current = transformLoad;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (!isNew && id) {
      const fetchItem = async () => {
        try {
          const { data } = await api.get(`${apiPath}/${id}`);
          setFormData(transformLoadRef.current(data.data || data));
        } catch (err) {
          toast.error('Failed to load item');
          navigateRef.current(`/content/${resourceKey}`);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
    // Only re-fetch when the id actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle nested key changes like 'seo.metaTitle'
  const handleChange = (key, value) => {
    if (key.includes('.')) {
      const parts = key.split('.');
      setFormData((prev) => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]] || typeof obj[parts[i]] !== 'object') {
            obj[parts[i]] = {};
          }
          obj[parts[i]] = { ...obj[parts[i]] };
          obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
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
    <div className="page-container max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/content/${resourceKey}`)} className="btn-ghost">
          <ArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 className="page-title">{isNew ? `New ${singularLabel || resourceLabel.slice(0, -1)}` : `Edit ${singularLabel || resourceLabel.slice(0, -1)}`}</h1>
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
