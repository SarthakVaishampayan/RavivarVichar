import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function MultiImageUpload({ value = [], onChange, label = 'Gallery Images', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalid = files.find((f) => !f.type.startsWith('image/'));
    if (invalid) {
      toast.error('Please select only image files');
      return;
    }

    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const urls = data.data.map((item) => item.url);
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...value];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    onChange(updated);
  };

  const handleMoveDown = (idx) => {
    if (idx === value.length - 1) return;
    const updated = [...value];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    onChange(updated);
  };

  return (
    <div className={className}>
      <label className="label">{label}</label>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {value.map((url, idx) => (
            <div key={idx} className="relative group rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={url}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-28 object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=Invalid+Image';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === value.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500 transition-colors"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
              <span className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary-400 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {value.length > 0 ? 'Add more images' : 'Upload gallery images'}
            </span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        multiple
        className="hidden"
      />
    </div>
  );
}
