import { useState, useRef, useCallback } from 'react';
import { Upload, X, Film, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec === 0) return '--';
  return `${formatSize(bytesPerSec)}/s`;
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function VideoUpload({ value = '', onChange, label = 'Video', className = '' }) {
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | done | error
  const [progress, setProgress] = useState(0); // 0–100
  const [speed, setSpeed] = useState(0); // bytes/sec
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [videoPreview, setVideoPreview] = useState(value || '');
  const inputRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastLoadedRef = useRef(0);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    // Reset state
    setUploadState('uploading');
    setProgress(0);
    setSpeed(0);
    setErrorMsg('');
    setFileName(file.name);
    setFileSize(file.size);
    startTimeRef.current = Date.now();
    lastLoadedRef.current = 0;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const now = Date.now();
          const elapsed = (now - startTimeRef.current) / 1000; // seconds

          // Calculate percentage
          const pct = total ? Math.round((loaded / total) * 100) : 0;
          setProgress(pct);

          // Calculate speed (average over time)
          if (elapsed > 0) {
            const bytesPerSec = loaded / elapsed;
            setSpeed(bytesPerSec);
          }

          lastLoadedRef.current = loaded;
        },
      });

      const url = data.data.url;
      setVideoPreview(url);
      onChange(url);
      setUploadState('done');
      toast.success('Video uploaded successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. The file may be too large or in an unsupported format.';
      setErrorMsg(msg);
      setUploadState('error');
      toast.error('Video upload failed');
    }
  }, [onChange]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    handleUpload(file);
  };

  const handleRemove = () => {
    setVideoPreview('');
    setUploadState('idle');
    setProgress(0);
    setSpeed(0);
    setFileName('');
    setFileSize(0);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRetry = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <label className="label">{label}</label>

      {/* Already uploaded video preview */}
      {videoPreview && uploadState !== 'uploading' && (
        <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-900">
          {videoPreview.match(/\.(mp4|webm|ogg|mov|avi)$/i) || videoPreview.includes('cloudinary') ? (
            <video
              src={videoPreview}
              controls
              className="w-full max-h-64 object-contain"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex items-center justify-center h-48">
              <Film size={48} className="text-gray-400" />
              <span className="ml-3 text-gray-400">Video URL set</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Drop zone when idle */}
      {uploadState === 'idle' && !videoPreview && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary-400 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Film size={36} className="text-gray-400 mb-2" />
          <Upload size={20} className="text-gray-400 mb-1" />
          <span className="text-sm text-gray-500 font-medium">Click or drag to upload video</span>
          <span className="text-xs text-gray-400 mt-1">MP4, WebM, MOV, AVI & more • No size limit</span>
        </div>
      )}

      {/* Upload progress UI */}
      {uploadState === 'uploading' && (
        <div className="rounded-lg border border-gray-200 p-5 bg-white">
          {/* File info */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
              <Film size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
              <p className="text-xs text-gray-400">{formatSize(fileSize)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Upload size={12} className="text-primary-400" />
              {progress}%
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatSpeed(speed)}
            </span>
            <span>
              {formatSize(lastLoadedRef.current || 0)} / {formatSize(fileSize)}
            </span>
          </div>

          {/* Indeterminate spinner for very large files */}
          {progress === 100 && (
            <div className="flex items-center gap-2 mt-3 text-xs text-amber-600">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              Processing on server... This may take a moment for large files.
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {uploadState === 'error' && (
        <div className="rounded-lg border border-red-200 p-4 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Upload failed</p>
              <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition-colors"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                >
                  Choose Different File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {uploadState === 'done' && (
        <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
          <CheckCircle size={14} />
          Upload complete — {formatSize(fileSize)}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
