import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function GalleryManager() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Upload the image file first
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadRes.data.data.url;

      // Create gallery entry
      await api.post('/gallery', {
        imageUrl,
        caption: caption || '',
        altText: altText || file.name.replace(/\.[^/.]+$/, ''),
      });

      toast.success('Image added to gallery');
      setCaption('');
      setAltText('');
      fetchImages();
    } catch (err) {
      toast.error('Failed to add image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

      {/* Upload Form */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Image</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="label">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Brief description..."
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="label">Alt Text (optional)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="For accessibility..."
              className="input-field w-full"
            />
          </div>
          <div className="flex items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary w-full justify-center"
            >
              {uploading ? (
                <><Loader2 size={18} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={18} /> Upload Image</>
              )}
            </button>
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img._id} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <div className="aspect-square">
                <img
                  src={img.imageUrl}
                  alt={img.altText || img.caption || 'Gallery image'}
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
              {(img.caption || img.altText) && (
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{img.caption || img.altText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
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
