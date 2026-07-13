import { useMemo, useState } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle,
  Lightbulb, FileImage, FileText, Hash, Edit3,
  Heading2, Link, MessageSquare, Search,
  Eye, Twitter, BookOpen, Image as ImageIcon,
  ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── UTILITIES ───

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text) {
  if (!text) return 0;
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences.length : Math.max(1, text.split(/\n+/).filter(Boolean).length);
}

function countImages(html) {
  if (!html) return 0;
  return (html.match(/<img[^>]*>/gi) || []).length;
}

function countImagesWithAlt(html) {
  if (!html) return 0;
  const imgs = html.match(/<img[^>]*>/gi) || [];
  return imgs.filter((img) => /alt\s*=\s*["'][^"']+["']/i.test(img)).length;
}

function countInternalLinks(html) {
  if (!html) return 0;
  const matches = html.match(/<a\s[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  let internal = 0;
  matches.forEach((tag) => {
    const m = tag.match(/href=["']([^"']*)["']/i);
    if (!m) return;
    const href = m[1];
    if (href.startsWith('/') || href.startsWith('#') || (!href.startsWith('http://') && !href.startsWith('https://'))) {
      internal++;
    }
  });
  return internal;
}

function extractHeadings(html) {
  if (!html) return { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, hasH1: false, hierarchy: [] };
  const getCount = (tag) => (html.match(new RegExp(`<${tag}[^>]*>`, 'gi')) || []).length;
  const h1 = getCount('h1');
  const h2 = getCount('h2');
  const h3 = getCount('h3');
  const h4 = getCount('h4');
  const h5 = getCount('h5');
  const h6 = getCount('h6');

  const hierarchy = [];
  const regex = /<h([1-6])[^>]*>.*?<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hierarchy.push(parseInt(match[1]));
  }

  return { h1, h2, h3, h4, h5, h6, hasH1: h1 > 0, hierarchy };
}

function checkAllCaps(title) {
  if (!title || title.length < 3) return false;
  const words = title.split(/\s+/).filter(Boolean);
  const longWords = words.filter((w) => w.length > 2);
  if (longWords.length === 0) return false;
  return longWords.every((w) => w === w.toUpperCase() && /[A-Z]/.test(w));
}

function checkExcessivePunctuation(title) {
  if (!title) return false;
  const matches = title.match(/!{2,}|\?{2,}|!+\?+\??|\?+!+!?/g);
  return matches && matches.length > 0;
}

// Readability helpers
function averageSentenceLength(text) {
  const sentences = sentenceCount(text);
  const words = wordCount(text);
  return sentences > 0 ? words / sentences : 0;
}

// Transition words list
const TRANSITION_WORDS = [
  'however', 'therefore', 'furthermore', 'moreover', 'nevertheless',
  'consequently', 'additionally', 'meanwhile', 'otherwise', 'indeed',
  'thus', 'hence', 'notably', 'specifically', 'conversely',
  'likewise', 'similarly', 'accordingly', 'besides', 'finally',
  'first', 'second', 'third', 'next', 'then', 'after', 'before',
  'while', 'during', 'since', 'until', 'because', 'although',
  'though', 'whereas', 'despite', 'in addition', 'for example',
  'for instance', 'in other words', 'in particular', 'in conclusion',
  'on the other hand', 'in contrast', 'as a result', 'in summary',
];

function countTransitionWords(text) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return TRANSITION_WORDS.filter((w) => lower.includes(w)).length;
}

// ─── MOBILE SEARCH PREVIEW ───
function MobileSearchPreview({ title, url, description }) {
  const displayTitle = title && title !== 'Page Title' ? title : 'Page Title';
  const displayDesc = description || 'Meta description will appear here...';
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
        Google Search Preview
      </div>
      <div className="max-w-[500px]">
        <div className="text-xs text-gray-600 truncate mb-0.5">
          {url || 'ravivarvichar.org'}
          <span className="inline-block ml-1 align-middle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </div>
        <div className="text-sm text-[#1a0dab] hover:underline cursor-pointer truncate leading-5">
          {displayTitle}
        </div>
        <div className="text-xs text-[#4d5156] leading-5 mt-0.5 line-clamp-2">
          {displayDesc}
        </div>
      </div>
    </div>
  );
}

// ─── CHECK DEFINITIONS ───
// Only checks that map to actual form fields in the article creator

const CHECK_GROUPS = [
  {
    key: 'title',
    label: 'Title Analysis',
    weight: 10,
    icon: Edit3,
    checks: [
      {
        key: 'titleExists',
        label: 'Title is too short (minimum 10 characters)',
        pass: (d) => (d.title || '').trim().length >= 10,
        tip: 'Add a descriptive title with at least 10 characters.',
      },
      {
        key: 'titleLength',
        label: 'Title should be 30–60 characters for best results',
        pass: (d) => {
          const len = (d.title || '').trim().length;
          return len >= 30 && len <= 60;
        },
        tip: 'Optimal title length for search results is 30–60 characters.',
      },
      {
        key: 'titleKeyphrase',
        label: 'Include the focus keyphrase in the title',
        pass: (d) => {
          if (!(d.title || '').trim()) return false;
          if (!d.focusKeyphrase) return true;
          return (d.title || '').toLowerCase().includes(d.focusKeyphrase.toLowerCase());
        },
        tip: 'Include your focus keyphrase naturally in the title.',
      },
      {
        key: 'titleAllCaps',
        label: 'Avoid using ALL CAPS in the title',
        pass: (d) => {
          if (!(d.title || '').trim()) return false;
          return !checkAllCaps(d.title || '');
        },
        tip: 'ALL CAPS titles hurt readability.',
      },
      {
        key: 'titlePunctuation',
        label: 'Avoid excessive punctuation in the title',
        pass: (d) => {
          if (!(d.title || '').trim()) return false;
          return !checkExcessivePunctuation(d.title || '');
        },
        tip: 'Avoid punctuation like !!! or ??? in the title.',
      },
    ],
  },
  {
    key: 'metaDesc',
    label: 'Meta Description',
    weight: 10,
    icon: MessageSquare,
    checks: [
      {
        key: 'metaExists',
        label: 'Add a meta description',
        pass: (d) => !!(d.seo?.metaDescription || '').trim(),
        tip: 'A meta description helps search engines understand your page.',
      },
      {
        key: 'metaLength',
        label: 'Meta description should be 120–160 characters',
        pass: (d) => {
          const desc = (d.seo?.metaDescription || '').trim();
          return desc.length >= 120 && desc.length <= 160;
        },
        tip: 'Optimal meta description length is 120–160 characters.',
      },
      {
        key: 'metaKeyphrase',
        label: 'Include the focus keyphrase in the meta description',
        pass: (d) => {
          if (!(d.seo?.metaDescription || '').trim()) return false;
          if (!d.focusKeyphrase) return true;
          return (d.seo?.metaDescription || '').toLowerCase().includes(d.focusKeyphrase.toLowerCase());
        },
        tip: 'Include the keyphrase in the meta description.',
      },
    ],
  },
  {
    key: 'keyphrase',
    label: 'Focus Keyphrase',
    weight: 10,
    icon: Hash,
    checks: [
      {
        key: 'kpExists',
        label: 'Set a focus keyphrase',
        pass: (d) => !!(d.focusKeyphrase || '').trim(),
        tip: 'Set a focus keyphrase that summarizes the article\'s main topic.',
      },
      {
        key: 'kpInTitle',
        label: 'Add the keyphrase to the title',
        pass: (d) => {
          if (!d.focusKeyphrase) return false;
          return (d.title || '').toLowerCase().includes(d.focusKeyphrase.toLowerCase());
        },
        tip: 'Include the keyphrase in the title.',
      },
      {
        key: 'kpInMeta',
        label: 'Add the keyphrase to the meta description',
        pass: (d) => {
          if (!d.focusKeyphrase) return false;
          return (d.seo?.metaDescription || '').toLowerCase().includes(d.focusKeyphrase.toLowerCase());
        },
        tip: 'Include the keyphrase in the meta description.',
      },
      {
        key: 'kpInContent',
        label: 'Include the keyphrase in the first paragraph',
        pass: (d) => {
          if (!d.focusKeyphrase) return false;
          const text = stripHtml((d.content || '').slice(0, 200));
          return text.toLowerCase().includes(d.focusKeyphrase.toLowerCase());
        },
        tip: 'Include the keyphrase naturally in the first paragraph.',
      },
      {
        key: 'kpDensity',
        label: 'Keyphrase should appear naturally (0.5–2% density)',
        pass: (d) => {
          if (!d.focusKeyphrase) return false;
          const text = stripHtml(d.content || '');
          if (!text) return false;
          const kpLower = d.focusKeyphrase.toLowerCase();
          const words = wordCount(text);
          const kpWords = kpLower.split(/\s+/).filter(Boolean).length;
          let count = 0;
          let idx = 0;
          while ((idx = text.toLowerCase().indexOf(kpLower, idx)) !== -1) {
            count++;
            idx += kpLower.length;
          }
          const density = words > 0 ? ((count * kpWords) / words) * 100 : 0;
          return count > 0 && density >= 0.5 && density <= 2;
        },
        tip: 'Aim for a natural keyphrase density between 0.5% and 2%.',
      },
    ],
  },
  {
    key: 'contentQuality',
    label: 'Content Quality',
    weight: 10,
    icon: FileText,
    checks: [
      {
        key: 'contentLength',
        label: 'Write at least 300 words of content',
        pass: (d) => {
          const text = stripHtml(d.content || '');
          return wordCount(text) >= 300;
        },
        tip: 'Aim for at least 300 words. In-depth content ranks better.',
      },
      {
        key: 'contentLengthOptimal',
        label: 'Aim for 600–1500 words for best results',
        pass: (d) => {
          const text = stripHtml(d.content || '');
          const words = wordCount(text);
          return words >= 600 && words <= 1500;
        },
        tip: 'Articles between 600–1500 words tend to perform best.',
      },
    ],
  },
  {
    key: 'headings',
    label: 'Heading Structure',
    weight: 10,
    icon: Heading2,
    checks: [
      {
        key: 'hasH2',
        label: 'Use at least one H2 subheading',
        pass: (d) => extractHeadings(d.content || '').h2 >= 1,
        tip: 'Use H2 subheadings to structure your content into sections.',
      },
      {
        key: 'noH1Overuse',
        label: 'Only use one H1 (the title is your H1)',
        pass: (d) => extractHeadings(d.content || '').h1 <= 1,
        tip: 'The article title serves as the H1. Avoid adding extra H1s.',
      },
      {
        key: 'headingHierarchy',
        label: 'Maintain a logical heading hierarchy (H1 → H2 → H3)',
        pass: (d) => {
          const { hierarchy } = extractHeadings(d.content || '');
          if (hierarchy.length < 2) return true;
          for (let i = 1; i < hierarchy.length; i++) {
            if (hierarchy[i] > hierarchy[i - 1] + 1) return false;
          }
          return true;
        },
        tip: 'Don\'t skip heading levels (e.g., H1 → H3). Use H1 → H2 → H3.',
      },
    ],
  },
  {
    key: 'featuredImage',
    label: 'Featured Image',
    weight: 5,
    icon: FileImage,
    checks: [
      {
        key: 'hasFeatured',
        label: 'Upload a featured image',
        pass: (d) => !!d.thumbnail,
        tip: 'Upload a featured image. It improves CTR and social sharing.',
      },
    ],
  },
  {
    key: 'imageSEO',
    label: 'Image ALT Text',
    weight: 5,
    icon: ImageIcon,
    checks: [
      {
        key: 'imageAlt',
        label: 'Add descriptive ALT text to all images',
        pass: (d) => {
          const total = countImages(d.content || '');
          if (total === 0) return true;
          return countImagesWithAlt(d.content || '') === total;
        },
        tip: 'Add ALT text to all images for accessibility and SEO.',
      },
    ],
  },
  {
    key: 'internalLinks',
    label: 'Internal Links',
    weight: 10,
    icon: Link,
    checks: [
      {
        key: 'internalCount',
        label: 'Add at least 4 internal links',
        pass: (d) => {
          return countInternalLinks(d.content || '') >= 4;
        },
        tip: 'Link to at least 4 other articles on your site.',
      },
    ],
  },
  {
    key: 'summary',
    label: 'Summary / Excerpt',
    weight: 5,
    icon: FileText,
    checks: [
      {
        key: 'hasExcerpt',
        label: 'Add a summary / excerpt',
        pass: (d) => !!(d.excerpt || '').trim(),
        tip: 'An excerpt appears in article cards and search snippets.',
      },
      {
        key: 'excerptLength',
        label: 'Summary should be around 40–80 words',
        pass: (d) => {
          const words = wordCount(d.excerpt || '');
          return words >= 40 && words <= 80;
        },
        tip: 'Aim for 40–80 words in your excerpt.',
      },
    ],
  },
  {
    key: 'readability',
    label: 'Readability',
    weight: 5,
    icon: BookOpen,
    checks: [
      {
        key: 'sentenceLength',
        label: 'Keep sentences short (aim for 15–20 words)',
        pass: (d) => {
          const text = stripHtml(d.content || '');
          if (!text) return false;
          const avg = averageSentenceLength(text);
          return avg >= 10 && avg <= 25;
        },
        tip: 'Short sentences (15–20 words) improve readability.',
      },
      {
        key: 'transitionWords',
        label: 'Use transition words (however, therefore, etc.)',
        pass: (d) => {
          const text = stripHtml(d.content || '');
          if (!text) return false;
          return countTransitionWords(text) >= 3;
        },
        tip: 'Transition words improve the flow of your writing.',
      },
    ],
  },
  {
    key: 'slug',
    label: 'URL / Slug',
    weight: 5,
    icon: Link,
    checks: [
      {
        key: 'slugFormat',
        label: 'URL slug should use hyphens and be lowercase',
        pass: (d) => {
          const slug = d.slug || '';
          if (!slug) {
            const title = d.title || '';
            if (!title) return false;
            return true; // server generates slug from title, so it'll be fine
          }
          return slug === slug.toLowerCase() && !slug.includes('_') && /^[a-z0-9-]+$/.test(slug);
        },
        tip: 'Use lowercase with hyphens in the URL slug.',
      },
    ],
  },
  {
    key: 'ogTags',
    label: 'Open Graph',
    weight: 5,
    icon: Eye,
    checks: [
      {
        key: 'ogTitle',
        label: 'Set an Open Graph title',
        pass: (d) => !!(d.seo?.ogTitle || '').trim(),
        tip: 'OG title controls how your article appears on social media.',
      },
      {
        key: 'ogDesc',
        label: 'Set an Open Graph description',
        pass: (d) => !!(d.seo?.ogDescription || '').trim(),
        tip: 'OG description improves social media sharing.',
      },
      {
        key: 'ogImage',
        label: 'Set an Open Graph image',
        pass: (d) => !!(d.seo?.ogImage || '').trim(),
        tip: 'OG image creates rich previews when shared.',
      },
    ],
  },
  {
    key: 'twitterCard',
    label: 'Twitter Card',
    weight: 3,
    icon: Twitter,
    checks: [
      {
        key: 'twitterTitle',
        label: 'Set a Twitter card title',
        pass: (d) => !!(d.seo?.twitterTitle || '').trim(),
        tip: 'Twitter title controls how your article appears on X.',
      },
      {
        key: 'twitterDesc',
        label: 'Set a Twitter card description',
        pass: (d) => !!(d.seo?.twitterDescription || '').trim(),
        tip: 'Twitter description improves sharing on X.',
      },
      {
        key: 'twitterImage',
        label: 'Set a Twitter card image',
        pass: (d) => !!(d.seo?.twitterImage || '').trim(),
        tip: 'Twitter image creates rich card previews on X.',
      },
    ],
  },
  {
    key: 'schema',
    label: 'Schema Markup',
    weight: 5,
    icon: Search,
    checks: [
      {
        key: 'schemaType',
        label: 'Select a schema type',
        pass: (d) => !!(d.seo?.schemaType || '').trim(),
        tip: 'Schema type helps search engines understand your content.',
      },
    ],
  },
  {
    key: 'canonical',
    label: 'Canonical URL',
    weight: 2,
    icon: Link,
    checks: [
      {
        key: 'canonicalUrl',
        label: 'Set a canonical URL',
        pass: (d) => !!(d.seo?.canonicalUrl || '').trim(),
        tip: 'A canonical URL prevents duplicate content issues.',
      },
    ],
  },
];

// ─── SCORING ───

function getScoreColor(score) {
  if (score >= 90) return '#22c55e';
  if (score >= 75) return '#86b341';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getScoreRating(score) {
  if (score >= 90) return { label: 'Excellent', sub: 'Your content is well-optimized for search engines.', color: '#22c55e' };
  if (score >= 75) return { label: 'Good', sub: 'Your content is solid with room for minor improvements.', color: '#86b341' };
  if (score >= 60) return { label: 'Fair', sub: 'Your content needs some optimization to perform better.', color: '#f59e0b' };
  if (score >= 40) return { label: 'Needs Improvement', sub: 'Several SEO elements need attention for better visibility.', color: '#f97316' };
  return { label: 'Poor', sub: 'Critical SEO elements are missing. Prioritize fixes.', color: '#ef4444' };
}

// ─── MAIN COMPONENT ───

export default function SeoAnalyzer({ formData }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  const analysis = useMemo(() => {
    const data = formData || {};

    // Early exit for empty forms
    const hasTitle = !!(data.title || '').trim();
    const hasContent = !!(data.content || '').trim();
    const hasKeyphrase = !!(data.focusKeyphrase || '').trim();
    const isEmpty = !hasTitle && !hasContent && !hasKeyphrase;
    if (isEmpty) {
      return {
        groups: [],
        totalScore: 0,
        passedOverall: 0,
        totalOverall: 0,
        pendingWarnings: 0,
        rating: { label: 'N/A', sub: 'Fill in your article details to see the SEO score.', color: '#9CA3AF' },
      };
    }

    const groups = CHECK_GROUPS.map((group) => {
      const results = group.checks.map((check) => ({
        ...check,
        passed: check.pass(data),
      }));
      const passed = results.filter((r) => r.passed).length;
      const total = results.length;
      const groupScore = total > 0 ? (passed / total) * group.weight : 0;
      return {
        ...group,
        results,
        passed,
        total,
        groupScore,
      };
    });

    const totalScore = Math.round(groups.reduce((sum, g) => sum + g.groupScore, 0));
    const passedOverall = groups.reduce((sum, g) => sum + g.passed, 0);
    const totalOverall = groups.reduce((sum, g) => sum + g.total, 0);
    const pendingWarnings = totalOverall - passedOverall;
    const rating = getScoreRating(totalScore);

    return { groups, totalScore, passedOverall, totalOverall, pendingWarnings, rating };
  }, [formData]);

  const { groups, totalScore, pendingWarnings, rating } = analysis;
  const scoreColor = getScoreColor(totalScore);

  const previewUrl = formData?.slug
    ? `ravivarvichar.org/knowledge-hub/${formData.slug}`
    : formData?.title
      ? `ravivarvichar.org/knowledge-hub/${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
      : 'ravivarvichar.org';

  const metaTitle = formData?.seo?.metaTitle || formData?.title || 'Page Title';
  const metaDescription = formData?.seo?.metaDescription || formData?.excerpt || '';

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Score Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <Search size={14} className="text-primary-500" />
            SEO Score
          </span>
          <span className="text-xs text-gray-500">
            {groups.length === 0
              ? ''
              : pendingWarnings === 0
                ? 'All checks passed!'
                : `${pendingWarnings} pending`
            }
          </span>
        </div>

        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(100, totalScore)}%`,
              background: totalScore >= 75
                ? 'linear-gradient(90deg, #22c55e, #86b341)'
                : totalScore >= 40
                  ? 'linear-gradient(90deg, #ef4444, #f59e0b 60%, #86b341)'
                  : '#ef4444',
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: scoreColor }}>
              {totalScore}
            </span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
          <div className="text-right max-w-[65%]">
            <p className="text-xs font-semibold" style={{ color: rating.color }}>{rating.label}</p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{rating.sub}</p>
          </div>
        </div>
      </div>

      {/* Mobile Search Preview */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
        <MobileSearchPreview title={metaTitle} url={previewUrl} description={metaDescription} />
      </div>

      {/* Grouped Checks */}
      <div className="divide-y divide-gray-100">
        {groups.map((group) => {
          const isExpanded = expandedGroup === group.key;
          const allPassed = group.passed === group.total;
          const GroupIcon = group.icon;

          return (
            <div key={group.key} className="bg-white">
              <button
                type="button"
                onClick={() => setExpandedGroup(isExpanded ? null : group.key)}
                className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {allPassed ? (
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                  )}
                  <GroupIcon size={13} className={allPassed ? 'text-green-400' : 'text-gray-400 shrink-0'} />
                  <span className={`text-xs font-medium truncate ${allPassed ? 'text-gray-500' : 'text-gray-700'}`}>
                    {group.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    allPassed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {group.passed}/{group.total}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-400 font-medium">{group.weight}pts</span>
                  {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-1.5">
                  {group.results.map((check) => (
                    <div key={check.key} className="flex items-start gap-2 pl-5">
                      <div className="mt-0.5 shrink-0">
                        {check.passed ? (
                          <CheckCircle2 size={12} className="text-green-500" />
                        ) : (
                          <XCircle size={12} className="text-red-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[11px] ${check.passed ? 'text-gray-400' : 'text-red-600'}`}>
                          {check.label}
                        </p>
                        {!check.passed && (
                          <div className="flex items-start gap-1 mt-0.5">
                            <Lightbulb size={10} className="text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-500 leading-relaxed">{check.tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Search size={10} />
          Live SEO analysis — updates as you type
        </p>
      </div>
    </div>
  );
}
