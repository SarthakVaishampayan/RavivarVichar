import { useState } from 'react';
import EditorForm from './EditorForm';
import RichTextEditor from '../../components/ui/RichTextEditor';
import ImageUpload from '../../components/ui/ImageUpload';
import MultiImageUpload from '../../components/ui/MultiImageUpload';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  ARTICLE_CATEGORIES, PARTNER_CATEGORIES, MEDIA_TYPES,
  PROJECT_STATUSES, PROGRAM_STATUSES, EVENT_TYPES,
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

// ─── PROGRAM EDITOR ───
export function ProgramEditor() {
  return (
    <EditorForm
      resourceKey="programs"
      resourceLabel="Programs"
      apiPath="/programs"
      fields={({ formData, handleChange }) => (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Program title" required />
              <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Program description" rows={4} />
              <TagsInput label="Objectives" name="objectives" value={formData.objectives} onChange={handleChange} placeholder="Type objective and press Enter" />
              <ArrayFields label="FAQs" name="faqs" value={formData.faqs} onChange={handleChange} fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer' }]} />
            </div>
            <div className="space-y-4">
              <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={PROGRAM_STATUSES} />
              <ImageUpload label="Banner Image" value={formData.banner} onChange={(url) => handleChange('banner', url)} />
            </div>
          </div>
        </>
      )}
    />
  );
}

// ─── PROJECT EDITOR ───
export function ProjectEditor() {
  return (
    <EditorForm
      resourceKey="projects"
      resourceLabel="Projects"
      apiPath="/projects"
      fields={({ formData, handleChange }) => (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Project title" required />
              <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Project description" rows={4} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="District" name="location.district" value={formData.location?.district} onChange={(n, v) => handleChange('location', { ...formData.location, district: v })} placeholder="District" />
                <Input label="State" name="location.state" value={formData.location?.state} onChange={(n, v) => handleChange('location', { ...formData.location, state: v })} placeholder="State" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Budget (₹)" name="budget" value={formData.budget} onChange={handleChange} type="number" />
                <Input label="Start Date" name="startDate" value={formData.startDate ? formData.startDate.slice(0, 10) : ''} onChange={handleChange} type="date" />
              </div>
              <ArrayFields label="Impact Numbers" name="impactNumbers" value={formData.impactNumbers} onChange={handleChange} fields={[{ key: 'label', label: 'Label' }, { key: 'value', label: 'Value' }]} />
            </div>
            <div className="space-y-4">
              <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={PROJECT_STATUSES} />
              <ImageUpload label="Cover Image" value={formData.coverImage} onChange={(url) => handleChange('coverImage', url)} />
            </div>
          </div>
        </>
      )}
    />
  );
}

// ─── REPORT EDITOR ───
export function ReportEditor() {
  return (
    <EditorForm
      resourceKey="reports"
      resourceLabel="Reports"
      apiPath="/reports"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Report title" required />
            <Input label="Author" name="author" value={formData.author} onChange={handleChange} placeholder="Author name" />
            <Input label="Summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Brief summary" rows={3} />
            <Input label="Citation" name="citation" value={formData.citation} onChange={handleChange} placeholder="Citation text" rows={2} />
            <Input label="PDF URL" name="pdfUrl" value={formData.pdfUrl} onChange={handleChange} placeholder="https://..." />
            <Input label="DOI" name="doi" value={formData.doi} onChange={handleChange} placeholder="DOI identifier" />
            <TagsInput label="Tags" name="tags" value={formData.tags} onChange={handleChange} />
          </div>
          <div className="space-y-4">
            <Input label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Research, Policy Brief" />
            <Input label="Year" name="year" value={formData.year} onChange={handleChange} type="number" placeholder="2025" />
            <ImageUpload label="Thumbnail" value={formData.thumbnail} onChange={(url) => handleChange('thumbnail', url)} />
          </div>
        </div>
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

// ─── DIRECTORY EDITOR (Entrepreneurs / SHGs / Mentors) ───
export function DirectoryEditor({ type }) {
  const configs = {
    entrepreneurs: {
      resourceKey: 'entrepreneurs', resourceLabel: 'Entrepreneurs', apiPath: '/directory/entrepreneurs',
      fields: ({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
            <Input label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Brief bio" rows={3} />
            <Input label="Contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone or email" />
          </div>
          <div className="space-y-4">
            <Input label="District" name="district" value={formData.district} onChange={handleChange} placeholder="District" />
            <Input label="Sector" name="sector" value={formData.sector} onChange={handleChange} placeholder="e.g. Handicrafts" />
            <ImageUpload label="Photo" value={formData.photo} onChange={(url) => handleChange('photo', url)} />
          </div>
        </div>
      ),
    },
    shgs: {
      resourceKey: 'shgs', resourceLabel: 'SHGs', apiPath: '/directory/shgs',
      fields: ({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Group Name" name="groupName" value={formData.groupName} onChange={handleChange} placeholder="Group name" required />
            <TagsInput label="Achievements" name="achievements" value={formData.achievements} onChange={handleChange} />
            <Input label="Contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone or email" />
          </div>
          <div className="space-y-4">
            <Input label="District" name="district" value={formData.district} onChange={handleChange} placeholder="District" />
            <Input label="Members" name="members" value={formData.members} onChange={handleChange} type="number" placeholder="Number of members" />
            <ImageUpload label="Photo" value={formData.photo} onChange={(url) => handleChange('photo', url)} />
          </div>
        </div>
      ),
    },
    mentors: {
      resourceKey: 'mentors', resourceLabel: 'Mentors', apiPath: '/directory/mentors',
      fields: ({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
            <Input label="Experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 12 years in retail" rows={2} />
            <Input label="Contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone or email" />
          </div>
          <div className="space-y-4">
            <TagsInput label="Skills" name="skills" value={formData.skills} onChange={handleChange} />
            <Input label="Availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g. Weekends" />
            <ImageUpload label="Photo" value={formData.photo} onChange={(url) => handleChange('photo', url)} />
          </div>
        </div>
      ),
    },
  };

  const config = configs[type];
  if (!config) return <div>Invalid directory type</div>;

  return <EditorForm {...config} />;
}

// ─── MEDIA EDITOR ───
export function MediaEditor() {
  return (
    <EditorForm
      resourceKey="media"
      resourceLabel="Media"
      apiPath="/media"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Media title" required />
            <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description" rows={3} />
            <Input label="URL" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." />
            <Input label="Date" name="date" value={formData.date ? formData.date.slice(0, 10) : ''} onChange={handleChange} type="date" />
          </div>
          <div className="space-y-4">
            <Select label="Type" name="type" value={formData.type} onChange={handleChange} options={MEDIA_TYPES} />
            <ImageUpload label="Thumbnail" value={formData.thumbnail} onChange={(url) => handleChange('thumbnail', url)} />
          </div>
        </div>
      )}
    />
  );
}

// ─── DONATION EDITOR ───
export function DonationEditor() {
  return (
    <EditorForm
      resourceKey="donations"
      resourceLabel="Donations"
      apiPath="/donations"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input label="Donor Name" name="donorName" value={formData.donorName} onChange={handleChange} placeholder="Donor name" required />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <Input label="Amount (₹)" name="amount" value={formData.amount} onChange={handleChange} type="number" placeholder="Amount" />
          </div>
          <div className="space-y-4">
            <Input label="Currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="INR" />
            <Input label="Purpose" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose" />
            <Select label="Status" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} options={['pending', 'completed', 'failed']} />
          </div>
        </div>
      )}
    />
  );
}

// ─── MEMBERSHIP EDITOR ───
export function MembershipEditor() {
  return (
    <EditorForm
      resourceKey="memberships"
      resourceLabel="Memberships"
      apiPath="/membership"
      fields={({ formData, handleChange }) => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          </div>
          <div className="space-y-4">
            <Input label="Membership Type" name="membershipType" value={formData.membershipType} onChange={handleChange} placeholder="Type" />
            <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['active', 'inactive']} />
          </div>
        </div>
      )}
    />
  );
}

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
