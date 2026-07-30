import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Award, Image, Calendar, Loader2, ArrowRight } from 'lucide-react';
import api from '../../lib/axios';

const typeIcons = {
  article: { icon: FileText, color: 'text-primary-500' },
  recognition: { icon: Award, color: 'text-accent-blue' },
  gallery: { icon: Image, color: 'text-secondary-500' },
  event: { icon: Calendar, color: 'text-accent-red' },
};



export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const { data: res } = await api.get('/search', { params: { q: q.trim(), limit: 8 } });
      const fetched = res?.data?.results || [];
      setResults(fetched);
      setOpen(fetched.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(val), 300);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const closeSearch = () => {
    setOpen(false);
    setSelectedIndex(-1);
  };

  const navigateToResult = (result) => {
    closeSearch();
    setQuery('');
    navigate(result.url);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      closeSearch();
      inputRef.current?.blur();
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Open dropdown when query is set programmatically
  useEffect(() => {
    if (query && results.length > 0) setOpen(true);
  }, [results, query]);

  const highlightMatch = (text, q) => {
    if (!text || !q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    const lowerQ = q.toLowerCase();
    return parts.map((part, i) =>
      part.toLowerCase() === lowerQ ? (
        <span key={i} className="bg-primary-100 text-primary-700 font-medium rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3.5 text-ink-secondary/60 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search articles, events..."
          className="w-full lg:w-[320px] pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-input text-ink-primary placeholder-ink-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all duration-300"
          aria-label="Search"
        />
        {loading ? (
          <Loader2 size={16} className="absolute right-3.5 text-primary-500 animate-spin" />
        ) : query ? (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 text-ink-secondary/50 hover:text-ink-secondary transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Dropdown Results */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-[380px] lg:w-[480px] max-h-[70vh] overflow-y-auto bg-white rounded-card border border-gray-100 shadow-card z-50 animate-fade-in">
          {/* Results header */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              {results.length} {results.length === 1 ? 'Result' : 'Results'} for "{query}"
            </span>
            <button
              onClick={closeSearch}
              className="text-xs text-ink-secondary/60 hover:text-ink-secondary transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Results list */}
          <div className="py-1">
            {results.map((result, idx) => {
              const typeInfo = typeIcons[result.type] || typeIcons.article;
              const TypeIcon = typeInfo.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={`${result.type}-${result._id}`}
                  onClick={() => navigateToResult(result)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-primary-50/60' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Type icon */}
                  <div className={`shrink-0 mt-0.5 ${typeInfo.color}`}>
                    <TypeIcon size={18} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-ink-secondary/60 uppercase tracking-wider">
                        {result.typeLabel}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ink-primary mt-0.5 line-clamp-1">
                      {highlightMatch(result.title, query)}
                    </p>
                    {result.snippet && (
                      <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2 leading-relaxed">
                        {highlightMatch(result.snippet, query)}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={14} className={`shrink-0 mt-1.5 transition-opacity ${
                    isSelected ? 'text-primary-500 opacity-100' : 'text-ink-secondary/30 opacity-0'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-ink-secondary/50 text-center">
            Use <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">↑</kbd>
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono ml-0.5">↓</kbd> to navigate,
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono mx-0.5">Enter</kbd> to open
          </div>
        </div>
      )}
    </div>
  );
}
