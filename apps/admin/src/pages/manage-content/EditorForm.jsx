import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, RotateCcw } from 'lucide-react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const AUTOSAVE_DEBOUNCE_MS = 2500; // save 2.5s after the author stops typing
const AUTOSAVE_INTERVAL_MS = 30000; // plus flush every 30s while there are unsaved changes

export default function EditorForm({
  resourceKey,
  resourceLabel,
  singularLabel,
  apiPath,
  fields,
  transformSave = (data) => data,
  transformLoad = (data) => data,
  defaultValues = {},
  enableAutoSave = false,
  previewContent = null,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [formData, setFormData] = useState(isNew ? { ...defaultValues } : {});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ state: 'idle', time: null }); // idle | saving | saved | error
  const [restoredDraftAt, setRestoredDraftAt] = useState(null);

  // Stable refs so callbacks never go stale
  const transformLoadRef = useRef(transformLoad);
  transformLoadRef.current = transformLoad;
  const transformSaveRef = useRef(transformSave);
  transformSaveRef.current = transformSave;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const formDataRef = useRef(formData);
  formDataRef.current = formData;
  const apiPathRef = useRef(apiPath);
  apiPathRef.current = apiPath;
  const resourceKeyRef = useRef(resourceKey);
  resourceKeyRef.current = resourceKey;
  const resourceLabelRef = useRef(resourceLabel);
  resourceLabelRef.current = resourceLabel;

  // Autosave bookkeeping
  const autoSaveTimer = useRef(null);
  const localTimer = useRef(null);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const savingPromiseRef = useRef(null); // in-flight autosave so manual save can await it
  const draftIdRef = useRef(null); // server _id once the first autosave creates the record
  const skipFetchRef = useRef(false); // don't re-fetch right after autosave navigates /new → /id
  const loadedStatusRef = useRef(null); // article's status as loaded from the server

  const draftStorageKey = `rv_autosave_${resourceKey}_new`;

  useEffect(() => {
    if (!isNew && id) {
      // After autosave creates a draft it navigates /new → /:id; the data we just
      // saved is already in formData, so skip the fetch to avoid clobbering edits.
      if (skipFetchRef.current) {
        skipFetchRef.current = false;
        return;
      }
      const fetchItem = async () => {
        try {
          const { data } = await api.get(`${apiPath}/${id}`);
          const loaded = data.data || data;
          loadedStatusRef.current = loaded.status || null;
          setFormData(transformLoadRef.current(loaded));
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

  // Restore an unsaved local draft for brand-new articles (crash recovery)
  useEffect(() => {
    if (!enableAutoSave || !isNew) return;
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.data && Object.keys(saved.data).length > 0) {
          setFormData({ ...defaultValues, ...saved.data });
          setRestoredDraftAt(saved.savedAt ? new Date(saved.savedAt) : null);
        }
      }
    } catch {
      /* corrupt draft — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);

  // ─── Auto save draft ───
  const saveDraft = useCallback(async () => {
    if (!enableAutoSave || savingRef.current) return;
    const data = formDataRef.current;
    const title = (data.title || '').trim();
    if (title.length < 5) {
      // Not valid to save yet (Zod requires ≥5 chars) — wait silently
      setSaveStatus({ state: 'idle', time: null });
      return;
    }
    savingRef.current = true;
    setSaveStatus({ state: 'saving', time: null });
    const run = (async () => {
      try {
        // Autosave never changes the publish state by itself: new articles are
        // always created as drafts, and existing articles keep whatever status
        // they were loaded with (a live article stays live, a draft stays draft).
        const payload = {
          ...transformSaveRef.current(data),
          status: loadedStatusRef.current || 'draft',
        };
        const existingId = draftIdRef.current || (isNew ? null : id);
        let response;
        if (existingId) {
          response = await api.put(`${apiPathRef.current}/${existingId}`, payload);
        } else {
          response = await api.post(apiPathRef.current, payload);
          const createdId = response.data?.data?._id;
          if (createdId) {
            draftIdRef.current = createdId;
            loadedStatusRef.current = 'draft';
            // Switch from /new to the real record so the manual Save becomes an
            // update and a refresh keeps loading this same draft. The trailing
            // /edit is required — there is NO route for /content/:key/:id, so
            // navigating there would hit the catch-all and kick the user back
            // to the Dashboard mid-typing.
            if (isNew) {
              skipFetchRef.current = true;
              navigateRef.current(`/content/${resourceKeyRef.current}/${createdId}/edit`, { replace: true });
            }
            localStorage.removeItem(`rv_autosave_${resourceKeyRef.current}_new`);
          }
        }
        // Keep the form's slug in sync with the server (e.g. duplicate-slug de-dupe)
        const serverArticle = response?.data?.data;
        if (serverArticle?.slug && serverArticle.slug !== formDataRef.current.slug) {
          setFormData((prev) => ({ ...prev, slug: serverArticle.slug }));
        }
        dirtyRef.current = false;
        const now = new Date();
        setSaveStatus({ state: 'saved', time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      } catch {
        setSaveStatus({ state: 'error', time: null });
      } finally {
        savingRef.current = false;
      }
    })();
    savingPromiseRef.current = run;
    await run;
    savingPromiseRef.current = null;
  }, [enableAutoSave, isNew, id]);

  const scheduleAutoSave = useCallback(() => {
    if (!enableAutoSave) return;
    dirtyRef.current = true;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => saveDraft(), AUTOSAVE_DEBOUNCE_MS);
    // Local backup so a crash between debounce ticks still has a recoverable draft
    if (localTimer.current) clearTimeout(localTimer.current);
    localTimer.current = setTimeout(() => {
      if (isNew) {
        try {
          localStorage.setItem(
            `rv_autosave_${resourceKeyRef.current}_new`,
            JSON.stringify({ data: formDataRef.current, savedAt: Date.now() })
          );
        } catch {
          /* storage full — ignore */
        }
      }
    }, 1000);
  }, [enableAutoSave, saveDraft, isNew]);

  // Every 30s flush any unsaved changes
  useEffect(() => {
    if (!enableAutoSave) return;
    const interval = setInterval(() => {
      if (dirtyRef.current && !savingRef.current) saveDraft();
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [enableAutoSave, saveDraft]);

  // Clean up pending timers when leaving the editor so a queued save can't fire
  // (and navigate the user back) after unmount.
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      if (localTimer.current) clearTimeout(localTimer.current);
    };
  }, []);

  // ─── Manual save ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Let any in-flight autosave finish first so we never double-create a record
    if (savingPromiseRef.current) await savingPromiseRef.current;
    setSaving(true);
    try {
      const payload = transformSaveRef.current(formDataRef.current);
      // If autosave already created the draft, treat this as an update
      const existingId = draftIdRef.current || (isNew ? null : id);
      if (existingId) {
        await api.put(`${apiPathRef.current}/${existingId}`, payload);
        toast.success(`${resourceLabelRef.current} updated`);
      } else {
        await api.post(apiPathRef.current, payload);
        toast.success(`${resourceLabelRef.current} created`);
      }
      dirtyRef.current = false;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      if (isNew) localStorage.removeItem(`rv_autosave_${resourceKeyRef.current}_new`);
      navigate(`/content/${resourceKeyRef.current}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

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
    scheduleAutoSave();
  };

  const setField = (name) => ({
    value: formData[name] ?? '',
    onChange: (e) => handleChange(name, e?.target?.value !== undefined ? e.target.value : e),
  });

  const discardDraft = () => {
    try {
      localStorage.removeItem(draftStorageKey);
    } catch {
      /* ignore */
    }
    setFormData({ ...defaultValues });
    setRestoredDraftAt(null);
  };

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;

  return (
    <div className="page-container max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button onClick={() => navigate(`/content/${resourceKey}`)} className="btn-ghost">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="flex-1 min-w-[200px]">
          <h1 className="page-title">{isNew ? `New ${singularLabel || resourceLabel.slice(0, -1)}` : `Edit ${singularLabel || resourceLabel.slice(0, -1)}`}</h1>
        </div>
        {previewContent && (
          <button type="button" onClick={() => setShowPreview(true)} className="btn-secondary shrink-0">
            <Eye size={16} />
            Preview
          </button>
        )}
        <button type="button" onClick={() => navigate(`/content/${resourceKey}`)} className="btn-secondary shrink-0">
          Cancel
        </button>
        <button type="submit" form="content-editor-form" disabled={saving} className="btn-primary shrink-0">
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

      {isNew && restoredDraftAt && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Restored unsaved draft from {restoredDraftAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
          </p>
          <button type="button" onClick={discardDraft} className="flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900">
            <RotateCcw size={12} /> Discard draft
          </button>
        </div>
      )}

      <form id="content-editor-form" onSubmit={handleSubmit} className="space-y-6">
        {fields({
          formData,
          handleChange: (key, value) => handleChange(key, value),
          setField,
          isNew,
        })}

        {enableAutoSave && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs">
              {saveStatus.state === 'saving' && (
                <span className="flex items-center gap-1.5 text-gray-500">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                  Saving...
                </span>
              )}
              {saveStatus.state === 'saved' && <span className="text-green-600">Draft saved at {saveStatus.time}</span>}
              {saveStatus.state === 'error' && <span className="text-red-500">Draft save failed — will retry</span>}
              {saveStatus.state === 'idle' && <span className="text-gray-400">Draft autosave enabled</span>}
            </div>
          </div>
        )}
      </form>

      {showPreview && previewContent && previewContent(formData, () => setShowPreview(false))}
    </div>
  );
}
