import { useMemo } from 'react';
import {
  CheckCircle2, XCircle,
  Lightbulb, FileImage, FileText, Hash,
  Heading2, Link, MessageSquare, Edit3,
} from 'lucide-react';

const CHECKS = [
  {
    key: 'title',
    label: 'Title is too short (less than 10 characters)',
    icon: Edit3,
    weight: 15,
    pass: (data) => (data.title || '').trim().length >= 10,
    tip: 'Add a descriptive title with at least 10 characters. Include your focus keyphrase naturally.',
  },
  {
    key: 'featuredImage',
    label: 'Featured Image Missing',
    icon: FileImage,
    weight: 15,
    pass: (data) => !!data.thumbnail,
    tip: 'Upload a featured image. It improves click-through rates and social sharing.',
  },
  {
    key: 'metaDescription',
    label: 'Missing meta description',
    icon: MessageSquare,
    weight: 12.5,
    pass: (data) => !!(data.seo?.metaDescription || '').trim(),
    tip: 'Write a compelling meta description (120-160 chars) that includes your keyphrase and encourages clicks.',
  },
  {
    key: 'summary',
    label: 'Missing summary/excerpt',
    icon: FileText,
    weight: 10,
    pass: (data) => !!(data.excerpt || '').trim(),
    tip: 'Add a brief summary. It appears in article cards and search results.',
  },
  {
    key: 'contentLength',
    label: 'Content is too short (less than 200 words)',
    icon: Edit3,
    weight: 15,
    pass: (data) => {
      const text = stripHtml(data.content || '');
      return text.split(/\s+/).filter(Boolean).length >= 200;
    },
    tip: 'Aim for at least 300 words. In-depth content ranks better and keeps readers engaged.',
  },
  {
    key: 'focusKeyphrase',
    label: 'Missing Focus Keyphrase',
    icon: Hash,
    weight: 12.5,
    pass: (data) => !!(data.focusKeyphrase || '').trim(),
    tip: 'Set a focus keyphrase that summarizes the main topic of your article.',
  },
  {
    key: 'h2Tags',
    label: 'H2 tag not present in content',
    icon: Heading2,
    weight: 10,
    pass: (data) => {
      const content = data.content || '';
      return /<h2[^>]*>/i.test(content);
    },
    tip: 'Use H2 subheadings to structure your content. They improve readability and SEO.',
  },
  {
    key: 'internalLinks',
    label: 'Internal links are less than recommended count of 4',
    icon: Link,
    weight: 10,
    pass: (data) => {
      const content = data.content || '';
      const links = content.match(/<a\s[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
      // Count relative links (no protocol = internal) and links without domain
      const internal = links.filter((link) => {
        const m = link.match(/href=["']([^"']*)["']/i);
        if (!m) return false;
        const href = m[1];
        // Relative path or no protocol = internal
        return !href.startsWith('http://') && !href.startsWith('https://');
      });
      return internal.length >= 4;
    },
    tip: 'Add at least 4 internal links to other articles on your site. This improves navigation and SEO.',
  },
];

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getScoreColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score) {
  if (score >= 80) {
    return { label: 'Great job!', sub: 'Your content is well-optimized for search engines.' };
  }
  if (score >= 50) {
    return { label: 'Getting better!', sub: `Your content is ${score}% SEO friendly, which means it is well-optimized for search engines.` };
  }
  return { label: 'Needs improvement', sub: 'Enhance your SEO score by refining your content for better search engine visibility. Keep optimising to attract more traffic.' };
}

export default function SeoAnalyzer({ formData }) {
  const analysis = useMemo(() => {
    const data = formData || {};

    const results = CHECKS.map((check) => ({
      ...check,
      passed: check.pass(data),
    }));

    const passedCount = results.filter((r) => r.passed).length;
    const totalWeight = results.reduce((sum, r) => sum + (r.passed ? r.weight : 0), 0);
    const score = Math.round(totalWeight);

    const warnings = results.filter((r) => !r.passed);

    return { results, score, warnings, passedCount };
  }, [formData]);

  const { results, score, warnings, passedCount } = analysis;
  const scoreColor = getScoreColor(score);
  const scoreInfo = getScoreLabel(score);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Score Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">SEO Score</span>
          <span className="text-xs text-gray-500">
            {warnings.length === 0 ? 'All checks passed!' : `${warnings.length} Pending SEO Warnings`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${score}%`,
              background: score >= 80
                ? '#22c55e'
                : `linear-gradient(90deg, #ef4444, #f59e0b ${score > 40 ? '50%' : '100%'}, #22c55e)`,
            }}
          />
        </div>

        {/* Score percentage + message */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold" style={{ color: scoreColor }}>
            {score}%
          </span>
          <div className="text-right max-w-[65%]">
            <p className="text-xs font-semibold text-gray-700">{scoreInfo.label}</p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
              {scoreInfo.sub}
            </p>
          </div>
        </div>

        {/* Check count */}
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <CheckCircle2 size={12} className="text-green-500" />
          <span>{passedCount}/{results.length} checks passed</span>
        </div>
      </div>

      {/* Warnings List */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {results.map((check) => (
          <div
            key={check.key}
            className={`p-3 transition-colors ${
              check.passed ? 'bg-white' : 'bg-red-50/30'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {check.passed ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <check.icon size={13} className={check.passed ? 'text-green-400' : 'text-red-300'} />
                  <span className={`text-xs font-medium ${check.passed ? 'text-gray-500' : 'text-red-700'}`}>
                    {check.label}
                  </span>
                </div>

                {/* Suggestion tip for failed checks */}
                {!check.passed && (
                  <div className="flex items-start gap-1.5 mt-1.5 pl-0.5">
                    <Lightbulb size={12} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">{check.tip}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
