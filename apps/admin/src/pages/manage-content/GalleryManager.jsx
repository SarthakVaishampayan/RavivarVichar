import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Trash2, Loader2, Calendar, Edit2, Check, RefreshCw } from 'lucide-react';
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
  const [editingImage, setEditingImage] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Post Details
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Date Override
  const [customDate, setCustomDate] = useState('');

  // Alt text for accessibility
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
    if (!editingImage || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const resetForm = () => {
    setEditingImage(null);
    setTitle('');
    setCaption('');
    setSlug('');
    setSummary('');
    setMetaDescription('');
    setCustomDate('');
    setAltText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEdit = (img) => {
    setEditingImage(img);
    setTitle(img.title || '');
    setCaption(img.caption || '');
    setSlug(img.slug || '');
    setSummary(img.summary || '');
    setMetaDescription(img.metaDescription || '');
    setAltText(img.altText || '');
    setCustomDate(img.customDate ? new Date(img.customDate).toISOString().split('T')[0] : '');
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Scroll smoothly to form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    // If creating a new image, file is mandatory
    if (!editingImage && !file) {
      toast.error('Please select an image to upload');
      return;
    }

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error('Image must be less than 50MB');
        return;
      }
    }

    setUploading(true);
    try {
      let imageUrl = editingImage ? editingImage.imageUrl : '';

      // Upload the image file if selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.data.url;
      }

      const payload = {
        imageUrl,
        caption: caption || '',
        altText: altText || (file ? file.name.replace(/\.[^/.]+$/, '') : (title || caption || 'Gallery image')),
        title: title || '',
        slug: slug || (title ? generateSlug(title) : ''),
        summary: summary || '',
        metaDescription: metaDescription || '',
        customDate: customDate || null,
      };

      if (editingImage) {
        // Update existing gallery entry
        await api.put(`/gallery/${editingImage._id}`, payload);
        toast.success('Gallery photo updated successfully');
      } else {
        // Create new gallery entry
        await api.post('/gallery', payload);
        toast.success('Image added to gallery');
      }

      resetForm();
      fetchImages();
    } catch (err) {
      toast.error(editingImage ? 'Failed to update image' : 'Failed to add image');
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
      if (editingImage?._id === deleteTarget._id) {
        resetForm();
      }
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

      {/* Add / Edit Image Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="mb-8 space-y-6">
        {/* Section 1: Post Details */}
        <div className={`card p-6 transition-all ${editingImage ? 'ring-2 ring-primary-500 bg-primary-50/10' : ''}`}>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingImage ? 'Edit Gallery Photo' : 'Post Details'}
              </h3>
              {editingImage && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Editing Mode
                </span>
              )}
            </div>
            {editingImage && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-ghost text-xs flex items-center gap-1.5 text-gray-500 hover:text-gray-800"
              >
                <X size={14} /> Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="label">Title / Heading</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Village Craft Exhibition"
                  className="input-field w-full"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="label">Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Short one-line caption..."
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

              {/* Summary / Supporting Information */}
              <div>
                <label className="label">Supporting Information / Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Detailed context, story, or background information displayed when photo is clicked..."
                  rows={4}
                  className="input-field w-full resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This supporting context will be shown to users when they click on the photo in the gallery.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Meta Description */}
              <div>
                <label className="label">Meta Description (SEO)</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO meta description..."
                  rows={2}
                  className="input-field w-full resize-none"
                />
              </div>

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

              {/* Section: Date Override */}
              <div>
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
                <p className="text-xs text-gray-400 mt-1">Override the default photo date</p>
              </div>

              {/* Current Image Preview in Edit Mode */}
              {editingImage && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
                  <img
                    src={editingImage.imageUrl}
                    alt={editingImage.title || 'Current'}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300 shrink-0"
                  />
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold text-gray-800">Current Image</p>
                    <p className="text-gray-500 mt-0.5">Upload a new file below if you want to replace it, or leave it blank to keep this photo.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload & Submit Action */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <label className="label">
                {editingImage ? 'Replace Image File (Optional)' : 'Select Image *'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="input-field w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {editingImage && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary w-full sm:w-auto justify-center shrink-0"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary w-full sm:w-auto justify-center shrink-0"
              >
                {uploading ? (
                  <><Loader2 size={18} className="animate-spin" /> {editingImage ? 'Saving...' : 'Uploading...'}</>
                ) : editingImage ? (
                  <><Check size={18} /> Update Photo Details</>
                ) : (
                  <><Upload size={18} /> Add to Gallery</>
                )}
              </button>
            </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gallery Images ({images.length})</h3>
            <button
              onClick={fetchImages}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => {
              const isSelected = editingImage?._id === img._id;
              return (
                <div
                  key={img._id}
                  className={`group relative rounded-lg overflow-hidden border bg-gray-50 transition-all ${
                    isSelected ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-square">
                    <img
                      src={img.imageUrl}
                      alt={img.altText || img.title || img.caption || 'Gallery image'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Error'; }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleStartEdit(img)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 hover:bg-primary-500 hover:text-white transition-colors shadow-lg"
                      title="Edit photo details"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(img)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {img.title || img.caption || img.altText || 'Untitled'}
                    </p>
                    {img.summary && (
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{img.summary}</p>
                    )}
                    {img.customDate && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(img.customDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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

