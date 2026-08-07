import { useEditor, EditorContent } from '@tiptap/react';
import { Node, mergeAttributes, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  Bold, Italic, Strikethrough, Underline,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  List, ListOrdered, Quote,
  Link, Image, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Indent, CornerDownRight,
  Minus, Code,
  Table as TableIcon,
  Palette, PaintBucket,
  Superscript as SupIcon, Subscript as SubIcon,
  Fullscreen, Minimize, Search, Eraser,
  FileCode, Eye, X, Upload, Loader2, WholeWord,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`rounded p-1.5 transition-colors ${
      active
        ? 'bg-primary-100 text-primary-700'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

// ─── PARAGRAPH STYLE DROPDOWN ───
const ParagraphDropdown = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentStyle = (() => {
    if (editor.isActive('paragraph')) return 'Paragraph';
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return `Heading ${i}`;
    }
    if (editor.isActive('codeBlock')) return 'Preformatted';
    if (editor.isActive('blockquote')) return 'Blockquote';
    return 'Paragraph';
  })();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const items = [
    { label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run() },
    { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Heading 4', action: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
    { label: 'Heading 5', action: () => editor.chain().focus().toggleHeading({ level: 5 }).run() },
    { label: 'Heading 6', action: () => editor.chain().focus().toggleHeading({ level: 6 }).run() },
    { label: 'Preformatted', action: () => editor.chain().focus().toggleCodeBlock().run() },
    { label: 'Blockquote', action: () => editor.chain().focus().toggleBlockquote().run() },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-w-[100px]"
      >
        <span className="truncate">{currentStyle}</span>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
          {items.map((item) => {
            const isActive = item.label === currentStyle;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => { item.action(); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── COLOR PICKER ───
const ColorPickerButton = ({ editor, type = 'text' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const setColor = (color) => {
    if (type === 'text') {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
    setOpen(false);
  };

  const isActive = type === 'text'
    ? false
    : editor.isActive('highlight');

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton
        onClick={() => setOpen(!open)}
        active={isActive}
        title={type === 'text' ? 'Text Color' : 'Background Color'}
      >
        {type === 'text' ? <Palette size={16} /> : <PaintBucket size={16} />}
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 mt-1 p-2 rounded-lg border border-gray-200 bg-white shadow-lg z-20 w-[232px]">
          <div className="grid grid-cols-10 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColor(color)}
                className="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              if (type === 'text') {
                editor.chain().focus().unsetColor().run();
              } else {
                editor.chain().focus().unsetHighlight().run();
              }
              setOpen(false);
            }}
            className="w-full text-xs text-gray-500 hover:text-gray-700 mt-2 pt-2 border-t border-gray-100"
          >
            Clear {type === 'text' ? 'color' : 'highlight'}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── INLINE IMAGES: custom Figure + FigCaption nodes ───
// Figure wraps a block image with an optional editable caption and an alignment
// attribute. Alignments render as classes (align-left/center/right/full) which the
// editor and the public site's .article-content CSS both style.
const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'image figcaption?',
  isolating: true,
  addAttributes() {
    return {
      align: {
        default: 'center',
        parseHTML: (element) => {
          const match = (element.getAttribute('class') || '').match(/align-(left|center|right|full)/);
          return match ? match[1] : 'center';
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'figure' }];
  },
  renderHTML({ HTMLAttributes, node }) {
    return ['figure', mergeAttributes(HTMLAttributes, { class: `article-figure align-${node.attrs.align || 'center'}` }), 0];
  },
  addCommands() {
    return {
      insertFigure:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { align: attrs.align || 'center' },
            content: [
              { type: 'image', attrs: { src: attrs.src, alt: attrs.alt || '' } },
              ...(attrs.caption
                ? [{ type: 'figcaption', content: [{ type: 'text', text: attrs.caption }] }]
                : []),
            ],
          }),
      setFigureAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes('figure', { align }),
    };
  },
});

const FigCaption = Node.create({
  name: 'figcaption',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'figcaption' }];
  },
  renderHTML() {
    return ['figcaption', 0];
  },
});

// ─── SEARCH HIGHLIGHT (ProseMirror decorations) ───
// Highlights every occurrence of the Find & Replace search term directly in the
// editor using inline decorations: all matches get a yellow mark and the
// currently navigated match gets a stronger orange mark.
// ─── Shared match scanner used by BOTH the highlight extension and the panel,
// so the counter, the highlights, and the replacements always agree ───
const WORD_CHAR = /[\p{L}\p{N}_]/u;

const findMatchesInDoc = (doc, term, wholeWord = true) => {
  if (!term || !doc) return [];
  const searchLower = term.toLowerCase();
  const results = [];
  doc.descendants((node, pos) => {
    if (node.isText) {
      const text = node.text;
      let idx = 0;
      while (idx <= text.length) {
        const foundAt = text.toLowerCase().indexOf(searchLower, idx);
        if (foundAt === -1) break;
        const from = pos + foundAt;
        const to = pos + foundAt + term.length;
        if (wholeWord) {
          // Require word boundaries on both sides so e.g. "n" never matches
          // inside "strengthen". textBetween reads the neighbours even when the
          // text is split across marks or sits next to a paragraph/leaf node.
          const before = from > 0 ? doc.textBetween(from - 1, from) : '';
          const after = doc.textBetween(to, to + 1);
          if ((before && WORD_CHAR.test(before)) || (after && WORD_CHAR.test(after))) {
            idx = foundAt + 1;
            continue;
          }
        }
        results.push({ from, to });
        idx = foundAt + 1;
      }
    }
  });
  return results;
};

const searchPluginKey = new PluginKey('searchHighlight');

const SearchHighlight = Extension.create({
  name: 'searchHighlight',

  addOptions() {
    return {
      searchTerm: '',
      activeIndex: -1,
      wholeWord: true,
      matchClass: 'search-match',
      activeClass: 'search-match-active',
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (term) =>
        ({ tr, dispatch }) => {
          this.options.searchTerm = term || '';
          if (dispatch) {
            tr.setMeta(searchPluginKey, { searchTerm: this.options.searchTerm });
            dispatch(tr);
          }
          return true;
        },
      setActiveMatch:
        (index) =>
        ({ tr, dispatch }) => {
          this.options.activeIndex = index;
          if (dispatch) {
            tr.setMeta(searchPluginKey, { activeIndex: index });
            dispatch(tr);
          }
          return true;
        },
      setWholeWord:
        (wholeWord) =>
        ({ tr, dispatch }) => {
          this.options.wholeWord = !!wholeWord;
          if (dispatch) {
            tr.setMeta(searchPluginKey, { wholeWord: !!wholeWord });
            dispatch(tr);
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: searchPluginKey,
        state: {
          init: () => ({ term: '', wholeWord: true, matches: [] }),
          apply: (tr, value, _oldState, newState) => {
            const meta = tr.getMeta(searchPluginKey);
            const term =
              meta && meta.searchTerm !== undefined ? meta.searchTerm : extension.options.searchTerm;
            const wholeWord =
              meta && meta.wholeWord !== undefined ? meta.wholeWord : extension.options.wholeWord;
            if (tr.docChanged || meta || term !== value.term || wholeWord !== value.wholeWord) {
              return {
                term,
                wholeWord,
                matches: findMatchesInDoc(newState.doc, term, wholeWord),
              };
            }
            return value;
          },
        },
        props: {
          decorations: (state) => {
            const pluginState = searchPluginKey.getState(state);
            if (!pluginState || !pluginState.term || pluginState.matches.length === 0) return null;
            const active = extension.options.activeIndex;
            const decos = pluginState.matches.map((m, i) =>
              Decoration.inline(m.from, m.to, {
                class: i === active ? extension.options.activeClass : extension.options.matchClass,
              })
            );
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

// Shared helper: upload an image file via the existing /upload/single endpoint
const uploadImageFile = async (file) => {
  if (!file) return null;
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return null;
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error('Image must be less than 10MB');
    return null;
  }
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data?.url || null;
  } catch {
    toast.error('Image upload failed');
    return null;
  }
};

// ─── INSERT IMAGE POPOVER (upload / URL / caption / alignment) ───
const InsertImagePopover = ({ editor, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [align, setAlign] = useState('center');
  const fileRef = useRef(null);

  const insert = (src) => {
    if (!src) return;
    editor.chain().focus().insertFigure({ src, caption: caption.trim(), align }).run();
    onClose();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = await uploadImageFile(file);
    if (fileRef.current) fileRef.current.value = '';
    if (src) insert(src);
  };

  return (
    <div className="absolute top-full left-0 mt-1 z-20 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700">Insert Image</span>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
          <X size={14} />
        </button>
      </div>

      {/* Upload from computer */}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-xs text-gray-500 hover:border-primary-400 hover:text-gray-700 transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? 'Uploading...' : 'Upload image from computer'}
      </button>

      <div className="my-2 flex items-center gap-2 text-[10px] text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />OR<span className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Paste URL */}
      <div className="flex gap-1">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste image URL..."
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-primary-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && url.trim()) insert(url.trim());
            if (e.key === 'Escape') onClose();
          }}
        />
        <button type="button" onClick={() => url.trim() && insert(url.trim())} disabled={!url.trim()} className="btn-primary text-xs px-2.5 py-1">Add</button>
      </div>

      {/* Caption */}
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption (optional)"
        className="mt-2 w-full rounded border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-primary-400"
      />

      {/* Alignment */}
      <div className="mt-2 flex items-center gap-1">
        <span className="text-[10px] text-gray-400 mr-1">Align:</span>
        {['left', 'center', 'right', 'full'].map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAlign(a)}
            className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${align === a ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {a === 'full' ? 'Full width' : a[0].toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] text-gray-400">Tip: you can also drag &amp; drop an image or paste one from the clipboard.</p>
    </div>
  );
};

// ─── FIND & REPLACE ───
const FindReplace = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wholeWord, setWholeWord] = useState(true);

  // Find all match positions in the ProseMirror document (shares the exact
  // scanner used by the highlight extension so they can never disagree).
  // NOTE: must be declared BEFORE the effects below — their dependency arrays
  // evaluate `findMatches` during render, so a later declaration would throw
  // a ReferenceError (TDZ) and white-screen the editor.
  const findMatches = useCallback((query) => {
    if (!query || !editor) return [];
    return findMatchesInDoc(editor.state.doc, query, wholeWord);
  }, [editor, wholeWord]);

  // Apply/clear the in-editor highlights as the panel opens and closes.
  // On reopen the document may have changed while closed, so re-sync the
  // match positions too (the extension re-scans automatically on dispatch).
  useEffect(() => {
    if (open) {
      editor?.commands.setSearchTerm(findText);
      if (findText) {
        const results = findMatches(findText);
        setMatches(results);
        setCurrentIndex((ci) => (ci >= results.length ? -1 : ci));
      }
      editor?.commands.setActiveMatch(currentIndex >= 0 ? currentIndex : -1);
    } else {
      editor?.commands.setSearchTerm('');
      editor?.commands.setActiveMatch(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editor]);

  // Keep the panel's positions in sync with the live highlights while the
  // document changes (e.g. the author keeps typing in the editor itself).
  useEffect(() => {
    if (!open || !editor || !findText) return;
    const sync = () => {
      const results = findMatches(findText);
      setMatches(results);
      setCurrentIndex((ci) => (ci >= results.length ? -1 : ci));
    };
    editor.on('transaction', sync);
    return () => editor.off('transaction', sync);
  }, [open, editor, findText, findMatches]);

  // Navigate to a specific match by index
  const goToMatch = useCallback((index, matchList) => {
    if (!editor || !matchList || matchList.length === 0) return;
    const match = matchList[index];
    if (!match) return;

    // Guard against stale positions (the doc may have changed) — never crash
    const size = editor.state.doc.content.size;
    if (match.from < 0 || match.to > size || match.from >= match.to) return;

    editor
      .chain()
      .focus()
      .setTextSelection({ from: match.from, to: match.to })
      .run();

    // Scroll the editor view to show the selection
    const { view } = editor;
    if (view) {
      const dom = view.domAtPos(match.from);
      if (dom.node) {
        dom.node.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [editor]);

  // Only count matches while typing — don't jump cursor
  const handleFindInput = useCallback((text) => {
    setFindText(text);
    if (!text || !editor) {
      editor.commands.setSearchTerm('');
      editor.commands.setActiveMatch(-1);
      setMatches([]);
      setCurrentIndex(0);
      return;
    }
    // Update the in-editor highlights live as the author types
    editor.commands.setSearchTerm(text);
    editor.commands.setActiveMatch(-1);
    const results = findMatches(text);
    setMatches(results);
    setCurrentIndex(-1);
  }, [editor, findMatches]);

  const handleToggleWholeWord = useCallback(() => {
    const next = !wholeWord;
    setWholeWord(next);
    if (!editor) return;
    editor.commands.setWholeWord(next);
    if (findText) {
      const results = findMatchesInDoc(editor.state.doc, findText, next);
      setMatches(results);
      setCurrentIndex((ci) => (ci >= results.length ? -1 : ci));
      editor.commands.setActiveMatch(-1);
    }
  }, [wholeWord, editor, findText]);

  const handleReplace = useCallback(() => {
    if (!findText || !editor || matches.length === 0) return;
    const match = matches[currentIndex];
    if (!match) return;

    // Guard against stale positions (the doc may have changed) — never crash
    const size = editor.state.doc.content.size;
    if (match.from < 0 || match.to > size || match.from >= match.to) return;

    try {
      // Select, delete, and insert plain text via a single chain
      editor
        .chain()
        .focus()
        .setTextSelection({ from: match.from, to: match.to })
        .deleteSelection()
        .insertContent(replaceText)
        .run();
    } catch {
      toast.error('Could not replace — content changed, search again');
      return;
    }

    // Recalculate matches after replacement
    const newResults = findMatches(findText);
    setMatches(newResults);
    const newIndex = Math.min(currentIndex, Math.max(0, newResults.length - 1));
    setCurrentIndex(newIndex);
    editor.commands.setActiveMatch(newResults.length > 0 ? newIndex : -1);
    if (newResults.length > 0 && newResults[newIndex]) {
      goToMatch(newIndex, newResults);
    }
  }, [editor, findText, replaceText, matches, currentIndex, findMatches, goToMatch]);

  const handleReplaceAll = useCallback(() => {
    if (!findText || !editor || matches.length === 0) return;

    // Drop any stale positions (doc may have changed) so insertText never throws
    const size = editor.state.doc.content.size;
    const valid = matches.filter((m) => m.from >= 0 && m.to <= size && m.from < m.to);
    if (valid.length === 0) return;

    try {
      // Build one transaction: replace from last to first so earlier positions stay valid
      const sorted = [...valid].sort((a, b) => b.from - a.from);
      const tr = editor.state.tr;
      sorted.forEach((match) => {
        tr.insertText(replaceText, match.from, match.to);
      });
      editor.view.dispatch(tr);
    } catch {
      toast.error('Could not replace all — content changed, search again');
      return;
    }

    editor.commands.setActiveMatch(-1);
    setMatches([]);
    setCurrentIndex(0);
  }, [editor, findText, replaceText, matches]);

  const handleNext = useCallback(() => {
    if (matches.length === 0) return;
    const nextIdx = (currentIndex + 1) % matches.length;
    setCurrentIndex(nextIdx);
    editor.commands.setActiveMatch(nextIdx);
    goToMatch(nextIdx, matches);
  }, [matches, currentIndex, goToMatch, editor]);

  const handlePrev = useCallback(() => {
    if (matches.length === 0) return;
    const prevIdx = (currentIndex - 1 + matches.length) % matches.length;
    setCurrentIndex(prevIdx);
    editor.commands.setActiveMatch(prevIdx);
    goToMatch(prevIdx, matches);
  }, [matches, currentIndex, goToMatch, editor]);

  // Handle Enter in FIND input → cycle to next match
  const handleFindKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [handleNext]);

  const handleReplaceKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplace();
      // Navigate to the next match after replacing
      handleNext();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [handleReplace, handleNext, handlePrev]);

  if (!open) {
    return (
      <ToolbarButton onClick={() => setOpen(true)} title="Find & Replace">
        <Search size={16} />
      </ToolbarButton>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-2 py-1 shadow-sm">
      <input
        type="text"
        value={findText}
        onChange={(e) => handleFindInput(e.target.value)}
        onKeyDown={handleFindKeyDown}
        placeholder="Find..."
        className="w-24 text-xs px-1 py-0.5 border border-gray-200 rounded outline-none focus:border-primary-400"
        autoFocus
      />
      <input
        type="text"
        value={replaceText}
        onChange={(e) => setReplaceText(e.target.value)}
        onKeyDown={handleReplaceKeyDown}
        placeholder="Replace..."
        className="w-24 text-xs px-1 py-0.5 border border-gray-200 rounded outline-none focus:border-primary-400"
      />
      <span className="text-xs text-gray-500 whitespace-nowrap min-w-[40px] text-center">
        {matches.length > 0 
          ? `${currentIndex >= 0 ? currentIndex + 1 : '-'}/${matches.length}` 
          : '0'}
      </span>
      <button
        type="button"
        onClick={handleToggleWholeWord}
        title={wholeWord ? 'Whole word only (click to also match inside words)' : 'Matching inside words (click for whole word only)'}
        className={`p-0.5 transition-colors ${wholeWord ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <WholeWord size={14} />
      </button>
      <button type="button" onClick={handlePrev} className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Previous" disabled={matches.length === 0}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
      </button>
      <button type="button" onClick={handleNext} className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Next (Enter in find)" disabled={matches.length === 0}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      <button type="button" onClick={handleReplace} className="text-xs px-1 py-0.5 text-gray-500 hover:text-primary-600 disabled:opacity-30" title="Replace" disabled={matches.length === 0}>R</button>
      <button type="button" onClick={handleReplaceAll} className="text-xs px-1 py-0.5 text-gray-500 hover:text-primary-600 disabled:opacity-30" title="Replace All" disabled={matches.length === 0}>All</button>
      <button type="button" onClick={() => setOpen(false)} className="p-0.5 text-gray-400 hover:text-gray-600" title="Close (Esc)">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
};

// ─── PREVIEW MODAL ───
const PreviewModal = ({ html, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-12 pb-8 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-8">
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: html || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [toolbarStuck, setToolbarStuck] = useState(false);
  const isInternalChange = useRef(false);
  const prevValueRef = useRef(value);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Detect when the sticky toolbar is pinned to the top of the viewport so we
  // can add a shadow that signals it's floating. Offset = admin topbar height (64px).
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const toolbarEl = el.querySelector('[data-editor-toolbar]');
      if (!toolbarEl) return;
      const rect = toolbarEl.getBoundingClientRect();
      // Stuck when the toolbar sits flush under the topbar (64px) or, in full
      // screen, at the top of the fixed container (16px — the m-4 margin).
      const threshold = fullScreen ? 16 : 64;
      setToolbarStuck(Math.abs(rect.top - threshold) < 2);
    };
    // In full screen the container scrolls internally (overflow-y-auto), so watch
    // both the window and the container itself to catch every scroll source.
    const el = containerRef.current;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    el?.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      el?.removeEventListener('scroll', handleScroll);
    };
  }, [fullScreen]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: {
          HTMLAttributes: { class: 'code-block' },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ImageExtension.configure({ inline: false }),
      Figure,
      FigCaption,
      SearchHighlight,
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      Superscript,
      Subscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      isInternalChange.current = true;
      const html = ed.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          'max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
      // Drag-and-drop an image file straight into the editor → upload → insert
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const pos = coords ? coords.pos : view.state.selection.from;
            uploadImageFile(file).then((src) => {
              if (!src) return;
              editorRef.current
                ?.chain()
                .focus()
                .insertContentAt(pos, {
                  type: 'figure',
                  attrs: { align: 'center' },
                  content: [{ type: 'image', attrs: { src, alt: '' } }],
                })
                .run();
            });
            return true;
          }
        }
        return false;
      },
      // Paste an image from the clipboard → upload → insert at cursor
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files || []);
        const file = files.find((f) => f.type.startsWith('image/'));
        if (file) {
          event.preventDefault();
          uploadImageFile(file).then((src) => {
            if (!src) return;
            editorRef.current
              ?.chain()
              .focus()
              .insertContent({
                type: 'figure',
                attrs: { align: 'center' },
                content: [{ type: 'image', attrs: { src, alt: '' } }],
              })
              .run();
          });
          return true;
        }
        return false;
      },
    },
  });

  editorRef.current = editor;

  // Update content when value prop changes externally
  useEffect(() => {
    if (editor && !isInternalChange.current && value !== prevValueRef.current) {
      editor.commands.setContent(value || '', false);
    }
    prevValueRef.current = value;
    isInternalChange.current = false;
  }, [value, editor]);

  // Full screen effect — the container becomes a fixed overlay that scrolls
  // internally so long articles stay fully reachable.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (fullScreen) {
      el.classList.add('fixed', 'inset-0', 'z-50', 'm-4', 'overflow-y-auto');
      document.body.style.overflow = 'hidden';
    } else {
      el.classList.remove('fixed', 'inset-0', 'z-50', 'm-4', 'overflow-y-auto');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [fullScreen]);

  if (!editor) return null;

  const handleSetLink = () => {
    if (linkUrl) {
      let url = linkUrl.trim();
      // Auto-prepend https:// if no protocol detected (case-insensitive)
      const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url);
      const isSpecial = url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:');
      if (url && !hasProtocol && !isSpecial) {
        url = 'https://' + url;
      }
      // External links open in new tab, internal links navigate normally
      const isExternal = /^https?:\/\//i.test(url);
      const linkAttrs = isExternal
        ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
        : { href: url };
      editor.chain().focus().setLink(linkAttrs).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const toggleSource = () => {
    if (showSource) {
      editor.commands.setContent(sourceCode || '', false);
    } else {
      setSourceCode(editor.getHTML());
    }
    setShowSource(!showSource);
  };

  // Word count
  const wordCount = (() => {
    try {
      const text = editor.getText();
      return text ? text.split(/\s+/).filter(Boolean).length : 0;
    } catch {
      return 0;
    }
  })();

  const charCount = (() => {
    try {
      return editor.getText().length || 0;
    } catch {
      return 0;
    }
  })();

  return (
    <>
      <div ref={containerRef} className="rounded-lg border border-gray-200 bg-white transition-all duration-300">
        {/* Toolbar — sticky below the admin topbar (h-16) so it stays reachable in long articles; sticks to top-0 in full screen */}
        <div
          data-editor-toolbar
          className={`sticky z-20 flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-gray-200 bg-gray-50 px-3 py-2 transition-shadow duration-200 ${
            fullScreen ? 'top-0' : 'top-16'
          } ${toolbarStuck ? 'shadow-soft' : ''}`}
        >
          {/* Paragraph Style Dropdown */}
          <ParagraphDropdown editor={editor} />

          <Divider />

          {/* Bold / Italic / Underline / Strikethrough */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)"><Bold size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)"><Italic size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><Underline size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={16} /></ToolbarButton>

          {/* Superscript / Subscript */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript"><SupIcon size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript"><SubIcon size={16} /></ToolbarButton>

          <Divider />

          {/* Text / Background Color */}
          <ColorPickerButton editor={editor} type="text" />
          <ColorPickerButton editor={editor} type="bg" />

          <Divider />

          {/* Headings */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} title="Heading 4"><Heading4 size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} active={editor.isActive('heading', { level: 5 })} title="Heading 5"><Heading5 size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} active={editor.isActive('heading', { level: 6 })} title="Heading 6"><Heading6 size={16} /></ToolbarButton>

          <Divider />

          {/* Lists */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={16} /></ToolbarButton>

          <Divider />

          {/* Alignment */}
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlignment: 'left' })} title="Align Left"><AlignLeft size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlignment: 'center' })} title="Align Center"><AlignCenter size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlignment: 'right' })} title="Align Right"><AlignRight size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlignment: 'justify' })} title="Justify"><AlignJustify size={16} /></ToolbarButton>

          <Divider />

          {/* Indent / Outdent */}
          <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Increase Indent"><Indent size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Decrease Indent"><CornerDownRight size={16} /></ToolbarButton>

          <Divider />

          {/* Blockquote / Code / Table / HR */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block"><Code size={16} /></ToolbarButton>
          <ToolbarButton onClick={insertTable} title="Insert Table"><TableIcon size={16} /></ToolbarButton>
          <ToolbarButton onClick={addHorizontalRule} title="Horizontal Line"><Minus size={16} /></ToolbarButton>

          {/* Link */}
          <div className="relative">
            <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive('link')} title="Insert Link (Ctrl+K)"><Link size={16} /></ToolbarButton>
            {showLinkInput && (
              <div className="absolute top-full left-0 mt-1 flex gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg z-10">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="input-field w-48 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSetLink();
                    if (e.key === 'Escape') setShowLinkInput(false);
                  }}
                  autoFocus
                />
                <button type="button" onClick={handleSetLink} className="btn-primary text-xs px-3 py-1">Add</button>
              </div>
            )}
          </div>

          {/* Image (upload / URL / caption / alignment) */}
          <div className="relative">
            <ToolbarButton onClick={() => setShowImagePopover(!showImagePopover)} active={showImagePopover} title="Insert Image"><Image size={16} /></ToolbarButton>
            {showImagePopover && (
              <InsertImagePopover editor={editor} onClose={() => setShowImagePopover(false)} />
            )}
          </div>

          <Divider />

          {/* Preview / Find & Replace / Clear Formatting / Source Code */}
          <ToolbarButton onClick={() => setShowPreview(true)} title="Preview"><Eye size={16} /></ToolbarButton>
          <FindReplace editor={editor} />
          <ToolbarButton onClick={clearFormatting} title="Clear Formatting"><Eraser size={16} /></ToolbarButton>
          <ToolbarButton onClick={toggleSource} active={showSource} title="Source Code"><FileCode size={16} /></ToolbarButton>

          <div className="flex-1" />

          {/* Full Screen / Undo / Redo */}
          <ToolbarButton onClick={() => setFullScreen(!fullScreen)} active={fullScreen} title={fullScreen ? 'Exit Full Screen' : 'Full Screen'}>
            {fullScreen ? <Minimize size={16} /> : <Fullscreen size={16} />}
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)"><Undo size={16} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)"><Redo size={16} /></ToolbarButton>
        </div>

        {/* Content area — wrapped so bottom corners stay rounded (overflow-hidden
            was removed from the outer container to allow the sticky toolbar) */}
        <div className="overflow-hidden rounded-b-lg">
          {/* Source Code View */}
          {showSource ? (
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full min-h-[300px] p-4 font-mono text-sm border-0 outline-none resize-y bg-gray-900 text-green-400"
              spellCheck={false}
            />
          ) : (
            <>
              {/* Editor content */}
              <EditorContent editor={editor} placeholder={placeholder} />

              {/* Word Count Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
            </>
          )}

          {/* Figure context menu — alignment + delete when an image is selected */}
          {editor.isActive('figure') && (
            <div className="flex items-center gap-1 px-3 py-1.5 border-t border-gray-200 bg-amber-50 text-xs">
              <span className="text-amber-700 font-medium mr-2">Image:</span>
              {['left', 'center', 'right', 'full'].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => editor.chain().focus().setFigureAlign(a).run()}
                  className={`px-2 py-0.5 rounded transition-colors ${editor.getAttributes('figure').align === a ? 'bg-amber-200 text-amber-800 font-semibold' : 'text-amber-700 hover:bg-amber-100'}`}
                >
                  {a === 'full' ? 'Full' : a[0].toUpperCase() + a.slice(1)}
                </button>
              ))}
              <button type="button" onClick={() => editor.chain().focus().deleteSelection().run()} className="px-2 py-0.5 rounded hover:bg-red-100 text-red-600 ml-auto">Delete</button>
            </div>
          )}

          {/* Table context menu */}
          {editor.isActive('table') && (
            <div className="flex items-center gap-1 px-3 py-1.5 border-t border-gray-200 bg-blue-50 text-xs">
              <span className="text-blue-600 font-medium mr-2">Table:</span>
              <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="px-2 py-0.5 rounded hover:bg-blue-100 text-blue-700">+ Row Above</button>
              <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2 py-0.5 rounded hover:bg-blue-100 text-blue-700">+ Row Below</button>
              <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-2 py-0.5 rounded hover:bg-blue-100 text-blue-700">+ Col Left</button>
              <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 py-0.5 rounded hover:bg-blue-100 text-blue-700">+ Col Right</button>
              <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="px-2 py-0.5 rounded hover:bg-red-100 text-red-600">- Row</button>
              <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="px-2 py-0.5 rounded hover:bg-red-100 text-red-600">- Col</button>
              <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 py-0.5 rounded hover:bg-red-100 text-red-600 ml-auto">Delete Table</button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          html={editor.getHTML()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
