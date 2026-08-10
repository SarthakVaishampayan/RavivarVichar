import { useState, useEffect, useRef } from 'react';
import EditorForm from './EditorForm';
import RichTextEditor from '../../components/ui/RichTextEditor';
import ImageUpload from '../../components/ui/ImageUpload';
import MultiImageUpload from '../../components/ui/MultiImageUpload';
import VideoUpload from '../../components/ui/VideoUpload';
import SeoAnalyzer from '../../components/ui/SeoAnalyzer';
import ArticlePreview from '../../components/ui/ArticlePreview';
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
// Auto-growing textarea: the writing area expands as you type or paste. Enter
// adds the tag(s); commas and newlines split pasted lists into multiple tags.
const TagsInput = ({ label, name, value = [], onChange, placeholder = 'Type and press Enter' }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-grow the textarea to fit its content (cap at ~160px, then scroll)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const h = Math.min(el.scrollHeight, 160);
    el.style.height = `${h}px`;
    el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden';
  }, [input]);

  const addTag = () => {
    const tags = input
      .split(/[,\n]/)            // split on commas or newlines
      .map((t) => t.trim())
      .filter(Boolean);
    if (!tags.length) return;
    const fresh = [...new Set(tags.filter((t) => !value.includes(t)))]; // dedupe within batch too
    if (fresh.length) onChange(name, [...value, ...fresh]);
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
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
          } else if (e.key === 'Backspace' && !input.trim() && value.length) {
            removeTag(value[value.length - 1]);
          }
        }}
        rows={1}
        placeholder={placeholder}
        className="input-field resize-none min-h-[44px] leading-6"
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

// ─── COUNTER INPUT ───
const CounterInput = ({ label, name, value, onChange, placeholder, maxLength = 250, required, rows }) => {
  const Tag = rows ? 'textarea' : 'input';
  const count = value ? value.length : 0;
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div className="relative">
        <Tag
          name={name}
          value={value || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= maxLength) onChange(name, val);
          }}
          placeholder={placeholder}
          rows={rows}
          className="input-field pr-16"
          required={required}
        />
        <span className="absolute right-3 bottom-3 text-xs text-gray-400 pointer-events-none">
          {count} / {maxLength}
        </span>
      </div>
    </div>
  );
};

// ─── COLLAPSIBLE PANEL ───
const CollapsiblePanel = ({ title, icon: Icon, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
};

// ─── PERMALINK (SLUG) INPUT ───
// Unicode-safe slug generation (keeps Devanagari/Hindi characters) that matches
// the server's generateSlug util. Auto-generates from the title until the author
// edits the slug by hand, then leaves it alone.
const makeSlug = (text = '') =>
  String(text)
    .toLowerCase()
    .trim()
    // \p{L} letters (keeps Hindi/Devanagari), \p{M} matras (े ी ं), \p{N} numbers
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const PermalinkInput = ({ title, slug, onChange }) => {
  const touched = useRef(false);

  // Auto-generate from the title, but only while the author hasn't hand-edited
  // the slug and there isn't already a stored slug (existing articles).
  useEffect(() => {
    if (!touched.current && !slug) {
      onChange(makeSlug(title));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <div className="-mt-3">
      <label className="text-xs text-gray-400 font-medium">Permalink (URL Slug)</label>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-xs text-gray-400 font-mono shrink-0">/</span>
        <input
          type="text"
          value={slug || ''}
          onChange={(e) => { touched.current = true; onChange(e.target.value); }}
          placeholder="auto-generated from title"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-mono text-gray-700 outline-none focus:border-primary-400 focus:bg-white"
        />
        <button
          type="button"
          onClick={() => { touched.current = false; onChange(makeSlug(title)); }}
          className="shrink-0 text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors"
          title="Regenerate from title"
        >
          ↺ Regenerate
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mt-1">
        {slug ? `Final URL: /articles/${slug}` : 'Will be generated from the title'}
      </p>
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
      enableAutoSave
      previewContent={(data, onClose) => (
        <ArticlePreview article={data} onClose={onClose} />
      )}
      transformLoad={(data) => ({
        ...data,
        // Flatten SEO fields for form handling
        seo: data.seo || {},
      })}
      transformSave={(data) => data}
      fields={({ formData, handleChange, setField }) => (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Left Column: Main Content ─── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title with character counter */}
              <CounterInput
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter article title"
                maxLength={250}
                required
              />

              {/* Permalink — editable, auto-generated from title until hand-edited */}
              <PermalinkInput
                title={formData.title}
                slug={formData.slug}
                onChange={(slug) => handleChange('slug', slug)}
              />

              {/* Excerpt / Summary */}
              <CounterInput
                label="Summary"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article"
                rows={2}
                maxLength={500}
              />

              {/* Meta Description */}
              <CounterInput
                label="Meta Description"
                name="seo.metaDescription"
                value={formData.seo?.metaDescription}
                onChange={handleChange}
                placeholder="SEO meta description for search engines"
                rows={2}
                maxLength={320}
              />

              {/* Featured Image */}
              <ImageUpload
                label="Featured Image"
                value={formData.thumbnail}
                onChange={(url) => handleChange('thumbnail', url)}
              />

              {/* Banner Description */}
              <Input
                label="Banner Description"
                name="bannerDescription"
                value={formData.bannerDescription}
                onChange={handleChange}
                placeholder="Description shown on the banner"
                rows={2}
              />

              {/* Content / Rich Text Editor */}
              <div>
                <label className="label">Post Content</label>
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={(html) => handleChange('content', html)}
                />
              </div>
            </div>

            {/* ─── Right Column: Post Properties ─── */}
            <div className="space-y-5">
              {/* Post Properties section */}
              <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
                  <h3 className="text-sm font-semibold text-gray-700">Post Properties</h3>
                </div>

                <div className="p-4 space-y-4">
                  {/* Primary Category */}
                  <Select
                    label="Primary Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={ARTICLE_CATEGORIES}
                    placeholder="Select Primary Category"
                  />

                  {/* Additional Category (multi-select using TagsInput style) */}
                  <TagsInput
                    label="Additional Category (Optional)"
                    name="additionalCategories"
                    value={formData.additionalCategories || []}
                    onChange={handleChange}
                    placeholder="Type category and press Enter"
                  />

                  {/* Tags */}
                  <TagsInput
                    label="Tags"
                    name="tags"
                    value={formData.tags || []}
                    onChange={handleChange}
                    placeholder="Select Tags"
                  />

                  {/* Author Name — shown as the author on the public article page */}
                  <Input
                    label="Author Name"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="e.g. Riya Sharma"
                  />

                  {/* Credits */}
                  <Input
                    label="Credits"
                    name="credit"
                    value={formData.credit}
                    onChange={handleChange}
                    placeholder="Photo/author credits"
                  />

                  {/* Focus Keyphrase */}
                  <Input
                    label="Focus Keyphrase"
                    name="focusKeyphrase"
                    value={formData.focusKeyphrase}
                    onChange={handleChange}
                    placeholder="Main SEO keyphrase"
                  />

                  {/* Live SEO Score Analyzer */}
                  <SeoAnalyzer formData={formData} />

                  {/* Status */}
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={['draft', 'published']}
                  />

                  {/* Featured toggle */}
                  <Toggle
                    label="Featured"
                    name="featured"
                    value={formData.featured}
                    onChange={handleChange}
                  />

                  {/* Date Override */}
                  <Input
                    label="Date Override"
                    name="publishedAt"
                    value={formData.publishedAt ? formData.publishedAt.slice(0, 10) : ''}
                    onChange={handleChange}
                    type="date"
                  />
                </div>
              </div>

              {/* Gallery */}
              <MultiImageUpload
                label="Gallery"
                value={formData.gallery || []}
                onChange={(urls) => handleChange('gallery', urls)}
              />

              {/* Direct video/audio upload (for podcasts/interviews) */}
              <VideoUpload
                label="Upload Video/Audio"
                value={formData.videoUrl}
                onChange={(url) => handleChange('videoUrl', url)}
              />

              {/* Or paste a YouTube/embed URL */}
              <Input
                label="Or Paste Video URL"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />

              {/* ─── SEO Properties (Collapsible) ─── */}
              <CollapsiblePanel title="SEO Properties" defaultOpen={false}>
                <Select
                  label="Select Schema"
                  name="seo.schemaType"
                  value={formData.seo?.schemaType || 'NewsArticle'}
                  onChange={handleChange}
                  options={[
                    { value: 'NewsArticle', label: 'Default NewsArticle' },
                    { value: 'BlogPosting', label: 'BlogPosting' },
                    { value: 'Article', label: 'Article' },
                    { value: 'Report', label: 'Report' },
                    { value: 'Interview', label: 'Interview' },
                  ]}
                />

                <Input
                  label="Canonical URL"
                  name="seo.canonicalUrl"
                  value={formData.seo?.canonicalUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <CounterInput
                  label="Meta Title"
                  name="seo.metaTitle"
                  value={formData.seo?.metaTitle}
                  onChange={handleChange}
                  placeholder="Custom meta title"
                  maxLength={120}
                />

                <CounterInput
                  label="OG Title"
                  name="seo.ogTitle"
                  value={formData.seo?.ogTitle}
                  onChange={handleChange}
                  placeholder="Open Graph title"
                  maxLength={120}
                />

                <CounterInput
                  label="OG Description"
                  name="seo.ogDescription"
                  value={formData.seo?.ogDescription}
                  onChange={handleChange}
                  placeholder="Open Graph description"
                  rows={2}
                  maxLength={320}
                />

                <ImageUpload
                  label="OG Image"
                  value={formData.seo?.ogImage}
                  onChange={(url) => handleChange('seo.ogImage', url)}
                />

                <CounterInput
                  label="Twitter Title"
                  name="seo.twitterTitle"
                  value={formData.seo?.twitterTitle}
                  onChange={handleChange}
                  placeholder="Twitter card title"
                  maxLength={120}
                />

                <CounterInput
                  label="Twitter Description"
                  name="seo.twitterDescription"
                  value={formData.seo?.twitterDescription}
                  onChange={handleChange}
                  placeholder="Twitter card description"
                  rows={2}
                  maxLength={320}
                />

                <ImageUpload
                  label="Twitter Image"
                  value={formData.seo?.twitterImage}
                  onChange={(url) => handleChange('seo.twitterImage', url)}
                />

                <TagsInput
                  label="Meta Keywords"
                  name="seo.keywords"
                  value={formData.seo?.keywords || []}
                  onChange={handleChange}
                  placeholder="Add keyword and press Enter"
                />

                <TagsInput
                  label="Meta News Keywords"
                  name="seo.metaNewsKeywords"
                  value={formData.seo?.metaNewsKeywords || []}
                  onChange={handleChange}
                  placeholder="Add news keyword and press Enter"
                />

                <Toggle
                  label="Exclude from search engines"
                  name="seo.excludeFromSearch"
                  value={formData.seo?.excludeFromSearch}
                  onChange={handleChange}
                />
              </CollapsiblePanel>
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

// ─── RECOGNITIONS EDITOR ───
export function RecognitionEditor() {
  return (
    <EditorForm
      resourceKey="recognitions"
      resourceLabel="Recognitions"
      apiPath="/recognitions"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Recognition title" required />
            <Input label="Source" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. The Times of India, Dainik Bhaskar" required />
            <Input label="URL (Optional)" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." />
            <Input label="Summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Brief description of the recognition" rows={3} />
          </div>
          <div className="space-y-4">
            <Input label="Date" name="date" value={formData.date ? formData.date.slice(0, 10) : ''} onChange={handleChange} type="date" />
            <ImageUpload label="Main Image" value={formData.imageUrl} onChange={(url) => handleChange('imageUrl', url)} />
            <MultiImageUpload
              label="Additional Photos"
              value={formData.gallery || []}
              onChange={(urls) => handleChange('gallery', urls)}
            />
          </div>
        </div>
      )}
    />
  );
}

// ─── HOMEPAGE RESEARCH CATEGORY EDITOR (Success Stories) ───
function makeCategoryEditor(category, label, singularName, apiPath, resourceKey, extraDefaults = {}) {
  return function CategoryEditor() {
    return (
      <EditorForm
        resourceKey={resourceKey}
        resourceLabel={label}
        singularLabel={singularName}
        apiPath={apiPath}
        defaultValues={{ category, ...extraDefaults }}
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
                <Input
                  label="Author Name"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  placeholder="e.g. Riya Sharma"
                />
                <Input
                  label="Credits"
                  name="credit"
                  value={formData.credit}
                  onChange={handleChange}
                  placeholder="Photo/author credits"
                />
                <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['draft', 'published']} />
                <ImageUpload label="Thumbnail" value={formData.thumbnail} onChange={(url) => handleChange('thumbnail', url)} />
                <MultiImageUpload label="Gallery" value={formData.gallery} onChange={(urls) => handleChange('gallery', urls)} />
                <VideoUpload label="Upload Video/Audio" value={formData.videoUrl} onChange={(url) => handleChange('videoUrl', url)} />
                <Input label="Or Paste Video URL" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." />
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
export const PodcastEditor = makeCategoryEditor('Podcast', 'Podcasts', 'Podcast', '/articles', 'podcasts', { status: 'published' });

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
