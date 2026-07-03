import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Save, Layout } from 'lucide-react';
import api from '../lib/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { HOMEPAGE_SECTIONS } from '../lib/constants';

function SortableSection({ section, onToggleVisibility }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        !section.visible ? 'opacity-60' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={20} />
      </button>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{section.label}</p>
        <p className="text-xs text-gray-500">Key: {section.key}</p>
      </div>

      <button
        type="button"
        onClick={() => onToggleVisibility(section.key)}
        className={`rounded-lg p-2 transition-colors ${
          section.visible
            ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            : 'text-gray-300 hover:text-gray-600 hover:bg-gray-100'
        }`}
        title={section.visible ? 'Hide section' : 'Show section'}
      >
        {section.visible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
}

export default function HomepageBuilder() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data } = await api.get('/homepage');
        if (data.success && data.data) {
          // Merge server data with full section list
          const serverSections = data.data;
          const merged = HOMEPAGE_SECTIONS.map((def) => {
            const server = serverSections.find((s) => s.key === def.key);
            return {
              ...def,
              order: server?.order ?? def.order ?? 0,
              visible: server?.visible ?? true,
            };
          });
          merged.sort((a, b) => a.order - b.order);
          setSections(merged);
        } else {
          setSections(HOMEPAGE_SECTIONS.map((s, i) => ({ ...s, order: i, visible: true })));
        }
      } catch {
        setSections(HOMEPAGE_SECTIONS.map((s, i) => ({ ...s, order: i, visible: true })));
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((prev) => {
        const oldIndex = prev.findIndex((s) => s.key === active.id);
        const newIndex = prev.findIndex((s) => s.key === over.id);
        return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
      });
    }
  };

  const handleToggleVisibility = (key) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        sections: sections.map((s, i) => ({
          key: s.key,
          order: i,
          visible: s.visible,
        })),
      };
      await api.put('/homepage/sections', payload);
      toast.success('Homepage sections updated');
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <Layout size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="page-title">Homepage Builder</h1>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop to reorder homepage sections
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Order
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sections.map((s) => s.key)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableSection
                key={section.key}
                section={section}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4">
        <p className="text-xs text-gray-500">
          <strong>Tip:</strong> Drag sections to reorder them. Click the eye icon to toggle visibility.
          Hidden sections won't appear on the public website. Changes are saved to the server.
        </p>
      </div>
    </div>
  );
}
