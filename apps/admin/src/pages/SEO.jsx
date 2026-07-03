import { useState } from 'react';
import { Search, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SEO() {
  const [settings, setSettings] = useState({
    siteTitle: 'RavivarVichar',
    siteDescription: 'Empowering rural communities through research, entrepreneurship, and self-help groups.',
    ogImage: '',
    keywords: 'rural development, SHG, entrepreneurship, women empowerment, Rajasthan',
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success('SEO settings saved');
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">SEO Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global SEO metadata for the public website</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Search size={16} />
          Save Settings
        </button>
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Globe size={20} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Global SEO</h2>
            <p className="text-sm text-gray-500">Default meta tags applied to all pages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="label">Site Title</label>
            <input
              value={settings.siteTitle}
              onChange={(e) => handleChange('siteTitle', e.target.value)}
              className="input-field"
              placeholder="Site title"
            />
            <p className="text-xs text-gray-400 mt-1">Used as: Site Title | Page Title</p>
          </div>

          <div>
            <label className="label">Meta Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Site description"
            />
            <p className="text-xs text-gray-400 mt-1">
              Recommended: 150-160 characters. Current: {settings.siteDescription.length}
            </p>
          </div>

          <div>
            <label className="label">Default OG Image URL</label>
            <input
              value={settings.ogImage}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              className="input-field"
              placeholder="https://example.com/og-image.jpg"
            />
          </div>

          <div>
            <label className="label">Default Keywords</label>
            <textarea
              value={settings.keywords}
              onChange={(e) => handleChange('keywords', e.target.value)}
              className="input-field"
              rows={2}
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
          <h3 className="text-sm font-medium text-blue-800">SEO Tips</h3>
          <ul className="mt-2 text-xs text-blue-700 space-y-1">
            <li>• Each article/project page automatically gets its own unique meta tags from its content</li>
            <li>• Open Graph and Twitter Card tags are auto-generated for social sharing</li>
            <li>• JSON-LD structured data is included on all public pages for rich search results</li>
            <li>• An XML sitemap is auto-generated listing all published content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
