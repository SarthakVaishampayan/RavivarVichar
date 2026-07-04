import { useState } from 'react';
import EditorForm from './EditorForm';
import RichTextEditor from '../../components/ui/RichTextEditor';
import ImageUpload from '../../components/ui/ImageUpload';
import MultiImageUpload from '../../components/ui/MultiImageUpload';
import {
  ARTICLE_CATEGORIES, PARTNER_CATEGORIES,
  EVENT_TYPES,
} from '../../lib/constants';

// ─── TEXT INPUT ───
const Input = ({ label, name, value, onChange, placeholder, type = 'text', required, rows }) => {
  const Tag = rows ? 'textarea' : 'input';
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <Tag
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        type={type}
        rows={rows}
        className="input-field"
        required={required}
      />
    </div>
  );
};

// ─── SELECT ───
const Select = ({ label, name, value, onChange, options, placeholder = 'Select...' }) => (
  <div>
    <label className="label">{label}</label>
    <select
      name={name}
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      className="input-field"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return <option key={val} value={val}>{lbl}</option>;
      })}
    </select>
  </div>
);

// ─── TOGGLE ───
const Toggle = ({ label, name, value, onChange, trueLabel = 'Yes', falseLabel = 'No' }) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(name, !value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

// ─── TAGS ───
const TagsInput = ({ label, name, value = [], onChange, placeholder = 'Type and press Enter' }) => {
  const [input, setInput] = useState('');
  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange(name, [...value, tag]);
    }
    setInput('');
  };
  const removeTag = (tag) => onChange(name, value.filter((t) => t !== tag));
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">&times;</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

// ─── ARRAY OF OBJECTS ───
const ArrayFields = ({ label, name, value = [], onChange, fields }) => {
  const addItem = () => onChange(name, [...value, {}]);
  const removeItem = (idx) => onChange(name, value.filter((_, i) => i !== idx));
  const updateItem = (idx, key, val) => {
    const updated = value.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange(name, updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="label mb-0">{label}</label>
        <button type="button" onClick={addItem} className="btn-ghost text-xs">+ Add</button>
      </div>
      {value.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2 mb-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex-1 grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <div key={field.key}>
                <input
                  placeholder={field.label}
                  value={item[field.key] || ''}
                  onChange={(e) => updateItem(idx, field.key, e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 mt-1">&times;</button>
        </div>
      ))}
    </div>
  );
};

// ─── ARTICLE EDITOR ───
export function ArticleEditor() {
  return (
    <EditorForm
      resourceKey="articles"
      resourceLabel="Articles"
      apiPath="/articles"
      fields={({ formData, handleChange, setField }) => (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter article title" required />
              <Input label="Excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Brief summary" rows={2} />

              <div>
                <label className="label">Content</label>
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={(html) => handleChange('content', html)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={ARTICLE_CATEGORIES} />
              <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['draft', 'published']} />
              <Toggle label="Featured" name="featured" value={formData.featured} onChange={handleChange} />
              <ImageUpload label="Thumbnail" value={formData.thumbnail} onChange={(url) => handleChange('thumbnail', url)} />
              <MultiImageUpload label="Gallery" value={formData.gallery} onChange={(urls) => handleChange('gallery', urls)} />
              <Input label="Video URL" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." />
              <TagsInput label="Tags" name="tags" value={formData.tags} onChange={handleChange} />
            </div>
          </div>
        </>
      )}
    />
  );
}

// ─── EVENT EDITOR ───
export function EventEditor() {
  return (
    <EditorForm
      resourceKey="events"
      resourceLabel="Events"
      apiPath="/events"
      fields={({ formData, handleChange }) => (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Event title" required />
              <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Event description" rows={3} />
              <Input label="Location Address" name="location.address" value={formData.location?.address} onChange={(n, v) => handleChange('location', { ...formData.location, address: v })} placeholder="Venue address" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ticket URL" name="ticketUrl" value={formData.ticketUrl} onChange={handleChange} placeholder="https://..." />
                <Input label="Registration Deadline" name="registrationDeadline" value={formData.registrationDeadline ? formData.registrationDeadline.slice(0, 10) : ''} onChange={handleChange} type="date" />
              </div>
              <ArrayFields label="Speakers" name="speakers" value={formData.speakers} onChange={handleChange} fields={[{ key: 'name', label: 'Name' }, { key: 'bio', label: 'Bio' }]} />
              <ArrayFields label="Agenda" name="agenda" value={formData.agenda} onChange={handleChange} fields={[{ key: 'time', label: 'Time' }, { key: 'title', label: 'Title' }]} />
            </div>
            <div className="space-y-4">
              <Select label="Type" name="type" value={formData.type} onChange={handleChange} options={EVENT_TYPES} />
            </div>
          </div>
        </>
      )}
    />
  );
}

// ─── PARTNER EDITOR ───
export function PartnerEditor() {
  return (
    <EditorForm
      resourceKey="partners"
      resourceLabel="Partners"
      apiPath="/partners"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Organization name" required />
            <Input label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
            <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description" rows={3} />
          </div>
          <div className="space-y-4">
            <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={PARTNER_CATEGORIES} />
            <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['active', 'inactive']} />
            <ImageUpload label="Logo" value={formData.logo} onChange={(url) => handleChange('logo', url)} />
          </div>
        </div>
      )}
    />
  );
}

// ─── MEDIA MENTION EDITOR ───
export function MediaMentionEditor() {
  return (
    <EditorForm
      resourceKey="mediaMentions"
      resourceLabel="Media Mentions"
      apiPath="/media-mentions"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Article or mention title" required />
            <Input label="Source" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. The Times of India, Dainik Bhaskar" required />
            <Input label="URL" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." required />
            <Input label="Summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Brief description of the mention" rows={3} />
          </div>
          <div className="space-y-4">
            <Input label="Date" name="date" value={formData.date ? formData.date.slice(0, 10) : ''} onChange={handleChange} type="date" />
            <ImageUpload label="Main Image" value={formData.imageUrl} onChange={(url) => handleChange('imageUrl', url)} />
          </div>
        </div>
      )}
    />
  );
}

// ─── HOMEPAGE RESEARCH CATEGORY EDITOR (Success Stories) ───
function makeCategoryEditor(category, label, singularName, apiPath, resourceKey) {
  return function CategoryEditor() {
    return (
      <EditorForm
        resourceKey={resourceKey}
        resourceLabel={label}
        singularLabel={singularName}
        apiPath={apiPath}
        defaultValues={{ category }}
        fields={({ formData, handleChange, setField }) => (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter title" required />
                <Input label="Excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Brief summary" rows={2} />
                <div>
                  <label className="label">Content</label>
                  <RichTextEditor
                    value={formData.content || ''}
                    onChange={(html) => handleChange('content', html)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Category</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{category}</p>
                </div>
                <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['draft', 'published']} />
                <ImageUpload label="Thumbnail" value={formData.thumbnail} onChange={(url) => handleChange('thumbnail', url)} />
                <MultiImageUpload label="Gallery" value={formData.gallery} onChange={(urls) => handleChange('gallery', urls)} />
                <Input label="Video URL" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
          </>
        )}
      />
    );
  };
}

export const ResearchReportEditor = makeCategoryEditor('Research', 'Research & Reports', 'Research Report', '/articles', 'researchReports');
export const SuccessStoryEditor = makeCategoryEditor('Success Stories', 'Success Stories', 'Success Story', '/articles', 'successStories');
export const InterviewEditor = makeCategoryEditor('Interview', 'Interviews', 'Interview', '/articles', 'interviews');

// ─── TESTIMONIAL EDITOR ───
export function TestimonialEditor() {
  return (
    <EditorForm
      resourceKey="testimonials"
      resourceLabel="Testimonials"
      apiPath="/testimonials"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Person's name" required />
            <Input label="Role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. SHG Member, Jodhpur" />
            <Input label="Quote" name="quote" value={formData.quote} onChange={handleChange} placeholder="Testimonial quote" rows={4} required />
          </div>
          <div className="space-y-4">
            <Toggle label="Featured" name="featured" value={formData.featured} onChange={handleChange} />
            <ImageUpload label="Photo" value={formData.photo} onChange={(url) => handleChange('photo', url)} />
          </div>
        </div>
      )}
    />
  );
}
