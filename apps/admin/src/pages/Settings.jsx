import { useState } from 'react';
import { Settings as SettingsIcon, Save, Globe, Mail, Phone, MapPin, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Ravivar Vichar',
    tagline: 'Amplifying Women\'s Voices, Empowering Communities',
    email: 'ravivar.vichar@ravivarvichar.in',
    phone: '+91-7470527279',
    address: '2nd Floor, Corporate House, 210 B-Block, 169, RNT Marg, Indore, Madhya Pradesh 452001',
    socialFacebook: 'https://www.facebook.com/ravivarvichar',
    socialTwitter: 'https://twitter.com/RavivarVichar',
    socialInstagram: 'https://www.instagram.com/ravivarvichar',
    socialLinkedin: 'https://www.linkedin.com/company/94272369',
    socialYoutube: 'https://www.youtube.com/@ravivarvichar',
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success('Settings saved');
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <SettingsIcon size={20} className="text-gray-600" />
          </div>
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">General site configuration</p>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save size={16} />
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="card p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
            <Globe size={20} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">General</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Site Name</label>
              <input value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input value={settings.tagline} onChange={(e) => handleChange('tagline', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
            <Mail size={20} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Email</label>
              <input value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Address</label>
              <input value={settings.address} onChange={(e) => handleChange('address', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
            <Globe size={20} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Social Media Links</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Facebook</label>
              <input value={settings.socialFacebook} onChange={(e) => handleChange('socialFacebook', e.target.value)} className="input-field" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="label">Twitter</label>
              <input value={settings.socialTwitter} onChange={(e) => handleChange('socialTwitter', e.target.value)} className="input-field" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="label">Instagram</label>
              <input value={settings.socialInstagram} onChange={(e) => handleChange('socialInstagram', e.target.value)} className="input-field" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input value={settings.socialLinkedin} onChange={(e) => handleChange('socialLinkedin', e.target.value)} className="input-field" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <label className="label">YouTube</label>
              <input value={settings.socialYoutube} onChange={(e) => handleChange('socialYoutube', e.target.value)} className="input-field" placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
