import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Trash2, Loader2, Calendar } from 'lucide-react';
import api from '../../lib/axios';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function GalleryManager() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Post Details
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Date Override
  const [customDate, setCustomDate] = useState('');

  // Alt text for accessibility (existing field)
  const [altText, setAltText] = useState('');

  const fetchImages = async () => {
    try {
      const { data } = await api.get('/gallery');
      setImages(data.data || []);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (value) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSummary('');
    setMetaDescription('');
    setCustomDate('');
    setAltText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileInputRef.current?.files?.[0]) {
      toast.error('Please select an image to upload');
      return;
    }

    const file = fileInputRef.current.files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Image must be less than 50MB');
      return;
    }

    setUploading(true);
    try {
      // Upload the image file
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadRes.data.data.url;

      // Create gallery entry with all fields
      await api.post('/gallery', {
        imageUrl,
        altText: altText || file.name.replace(/\.[^/.]+$/, ''),
        title: title || '',
        slug: slug || '',
        summary: summary || '',
        metaDescription: metaDescription || '',
        customDate: customDate || null,
      });

      toast.success('Image added to gallery');
      resetForm();
      fetchImages();
    } catch (err) {
      toast.error('Failed to add image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteTarget._id}`);
      toast.success('Image removed');
      setDeleteTarget(null);
      fetchImages();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/content')} className="btn-ghost text-sm">
            ← Back
          </button>
          <div>
            <h1 className="page-title">Gallery Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Upload and manage gallery images</p>
          </div>
        </div>
      </div>

      {/* Add New Image Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-6">
        {/* Section 1: Post Details */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Post Details</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Image title..."
                  className="input-field w-full"
                />
              </div>

              {/* English Title / Permalink */}
              <div>
                <label className="label">English Title (Permalink)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-slug"
                    className="input-field w-full pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {slug.length} / 250
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="label">Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description of the image..."
                  rows={3}
                  className="input-field w-full resize-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="label">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO meta description..."
                  rows={2}
                  className="input-field w-full resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Alt Text */}
              <div>
                <label className="label">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for screen readers..."
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Date Override */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Date Override</h3>

          <div className="max-w-md">
            <label className="label">Custom Date</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Override the default upload date</p>
          </div>
        </div>

        {/* Image Upload & Submit */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <label className="label">Select Image *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="input-field w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary w-full sm:w-auto justify-center shrink-0"
            >
              {uploading ? (
                <><Loader2 size={18} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={18} /> Add to Gallery</>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-500" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No images in gallery yet. Upload your first image above.</p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img._id} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <div className="aspect-square">
                  <img
                    src={img.imageUrl}
                    alt={img.altText || img.title || img.caption || 'Gallery image'}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Error'; }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setDeleteTarget(img)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{img.title || img.caption || img.altText || 'Untitled'}</p>
                  {img.customDate && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(img.customDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove image?"
        message="Are you sure you want to remove this image from the gallery?"
        loading={deleting}
      />
    </div>
  );
}
