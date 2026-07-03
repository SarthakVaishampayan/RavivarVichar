import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import FloatingDots from '../components/shared/FloatingDots';
import { ArrowLeft, Calendar, User, Clock, Linkedin, Twitter, Facebook } from 'lucide-react';

function generateContent(title, category, author) {
  const topics = {
    'Research': { focus: 'research study', subtitle: 'Key Findings', desc: 'data collected from rural communities across Rajasthan' },
    'Impact Story': { focus: 'impact story', subtitle: 'Impact Highlights', desc: 'stories of transformation from the field' },
    'Case Study': { focus: 'case study', subtitle: 'Case Analysis', desc: 'in-depth analysis of specific community initiatives' },
    'Policy Brief': { focus: 'policy brief', subtitle: 'Policy Recommendations', desc: 'evidence-based policy analysis and recommendations' },
    'Opinion': { focus: 'opinion piece', subtitle: 'Perspectives', desc: 'insights drawn from years of grassroots experience' },
  };
  const t = topics[category] || { focus: 'article', subtitle: 'Key Points', desc: 'insights from our work in rural communities' };

  return `
    <p class="text-lg leading-relaxed text-ink-secondary mb-6">In this ${t.focus}, ${author} explores the critical dimensions of rural development through the lens of RavivarVichar's ongoing work in Rajasthan. The ${t.desc} reveal important patterns and actionable insights.</p>

    <h2 class="text-2xl font-heading font-bold text-ink-primary mt-10 mb-4">${t.subtitle}</h2>
    <p class="text-body text-ink-secondary mb-4">Our analysis draws from field observations, community feedback, and systematic assessment of program outcomes. The findings highlight the transformative potential of community-led development approaches:</p>

    <ul class="space-y-3 list-disc pl-6 text-body text-ink-secondary mb-6">
      <li><strong class="text-ink-primary">Community Ownership:</strong> Programs with strong community participation show 3x better outcomes.</li>
      <li><strong class="text-ink-primary">Sustainable Impact:</strong> Long-term engagement yields lasting changes in livelihoods and well-being.</li>
      <li><strong class="text-ink-primary">Women's Leadership:</strong> Women-led initiatives demonstrate remarkable effectiveness in driving community development.</li>
      <li><strong class="text-ink-primary">Integrated Approach:</strong> Combining multiple interventions creates synergistic effects that outperform single-focus programs.</li>
    </ul>

    <h2 class="text-2xl font-heading font-bold text-ink-primary mt-10 mb-4">Context & Background</h2>
    <p class="text-body text-ink-secondary mb-4">Rajasthan's rural landscape presents both challenges and opportunities. With RavivarVichar's decade-long presence across Bhilwara, Udaipur, and Chittorgarh districts, we have developed a nuanced understanding of local dynamics, cultural contexts, and community aspirations.</p>

    <blockquote class="border-l-4 border-primary-500 pl-6 my-8 italic text-lg text-ink-secondary bg-surface-section p-6 rounded-r-card">
      "The most significant change we've witnessed is not just in economic indicators, but in the confidence and agency of community members who now actively shape their own development journey."
      <footer class="mt-3 text-sm not-italic font-medium text-ink-primary">— ${author}, RavivarVichar</footer>
    </blockquote>

    <h2 class="text-2xl font-heading font-bold text-ink-primary mt-10 mb-4">Looking Ahead</h2>
    <p class="text-body text-ink-secondary mb-4">The insights from this ${t.focus} will inform our program design and policy advocacy efforts. We remain committed to evidence-based, community-driven approaches that create lasting positive change in rural communities across Rajasthan and beyond.</p>
  `;
}

const articleData = {
  'impact-of-shgs-on-rural-women': {
    title: 'The Impact of Self-Help Groups on Rural Women\'s Economic Empowerment',
    category: 'Research', author: 'Dr. Priya Sharma', date: 'March 15, 2025', readTime: '8 min read',
    content: `
      <p class="text-lg leading-relaxed text-ink-secondary mb-6">Self-Help Groups (SHGs) have emerged as one of the most effective vehicles for women's empowerment in rural India. This study examines the economic and social impact of SHGs on rural women in Rajasthan over a five-year period (2020-2025).</p>
      <h2 class="text-2xl font-heading font-bold text-ink-primary mt-10 mb-4">Key Findings</h2>
      <p class="text-body text-ink-secondary mb-4">Our research tracked 500 women across 40 SHGs in Bhilwara, Udaipur, and Chittorgarh districts. The findings reveal significant improvements across multiple dimensions of empowerment:</p>
      <ul class="space-y-3 list-disc pl-6 text-body text-ink-secondary mb-6">
        <li><strong class="text-ink-primary">Income Growth:</strong> Average household income increased by 45% over the study period.</li>
        <li><strong class="text-ink-primary">Financial Inclusion:</strong> 92% of members now have bank accounts, compared to 34% before joining.</li>
        <li><strong class="text-ink-primary">Decision-Making:</strong> 78% of women reported greater participation in household financial decisions.</li>
        <li><strong class="text-ink-primary">Social Capital:</strong> Members reported stronger community networks and mutual support systems.</li>
      </ul>
      <h2 class="text-2xl font-heading font-bold text-ink-primary mt-10 mb-4">Methodology</h2>
      <p class="text-body text-ink-secondary mb-4">The study employed a mixed-methods approach, combining quantitative surveys with qualitative interviews and focus group discussions. Baseline data was collected in 2020, with follow-up surveys conducted annually.</p>
      <blockquote class="border-l-4 border-primary-500 pl-6 my-8 italic text-lg text-ink-secondary bg-surface-section p-6 rounded-r-card">
        "Before joining the SHG, I never had a say in how our family money was spent. Now I not only manage our household finances but also run a small tailoring business that employs three other women from my village."
        <footer class="mt-3 text-sm not-italic font-medium text-ink-primary">— Lakshmi Devi, SHG Member, Bhilwara</footer>
      </blockquote>
      <h2 class="text-2xl font-heading font-bold text-ink-primary mt-10 mb-4">Policy Implications</h2>
      <p class="text-body text-ink-secondary mb-4">The findings underscore the importance of sustained investment in SHG programs.</p>
      <ol class="space-y-2 list-decimal pl-6 text-body text-ink-secondary mb-6">
        <li>Increased funding for SHG capacity-building programs</li>
        <li>Strengthened linkages between SHGs and formal banking institutions</li>
        <li>Integration of digital literacy training into SHG programs</li>
        <li>Creation of market linkage platforms for SHG products</li>
      </ol>
    `,
    tags: ['Self-Help Groups', 'Women Empowerment', 'Financial Inclusion', 'Rural Development'],
  },
  'digital-literacy-transforming-villages': {
    title: 'How Digital Literacy is Transforming Rural Entrepreneurship',
    category: 'Impact Story', author: 'Anita Verma', date: 'February 28, 2025', readTime: '6 min read',
    content: generateContent('How Digital Literacy is Transforming Rural Entrepreneurship', 'Impact Story', 'Anita Verma'),
    tags: ['Digital Literacy', 'Rural Entrepreneurship', 'Technology', 'Women Empowerment'],
  },
  'policy-recommendations-rural-finance': {
    title: 'Policy Recommendations for Strengthening Rural Financial Inclusion',
    category: 'Policy Brief', author: 'Rajesh Meena', date: 'February 10, 2025', readTime: '10 min read',
    content: generateContent('Policy Recommendations for Strengthening Rural Financial Inclusion', 'Policy Brief', 'Rajesh Meena'),
    tags: ['Financial Inclusion', 'Policy', 'Banking', 'Rural Development'],
  },
  'women-entrepreneurs-rajasthan': {
    title: 'From Home to Enterprise: Women Entrepreneurs of Rajasthan',
    category: 'Case Study', author: 'Dr. Priya Sharma', date: 'January 25, 2025', readTime: '12 min read',
    content: generateContent('From Home to Enterprise: Women Entrepreneurs of Rajasthan', 'Case Study', 'Dr. Priya Sharma'),
    tags: ['Women Entrepreneurship', 'Case Study', 'Rajasthan', 'Enterprise Development'],
  },
  'climate-resilient-agriculture': {
    title: 'Climate-Resilient Agriculture: Lessons from Rural Rajasthan',
    category: 'Research', author: 'Vikram Singh', date: 'January 12, 2025', readTime: '7 min read',
    content: generateContent('Climate-Resilient Agriculture: Lessons from Rural Rajasthan', 'Research', 'Vikram Singh'),
    tags: ['Agriculture', 'Climate Resilience', 'Sustainable Farming', 'Rajasthan'],
  },
  'future-rural-development': {
    title: 'The Future of Rural Development: A Community-Led Approach',
    category: 'Opinion', author: 'Dr. Priya Sharma', date: 'December 20, 2024', readTime: '5 min read',
    content: generateContent('The Future of Rural Development: A Community-Led Approach', 'Opinion', 'Dr. Priya Sharma'),
    tags: ['Rural Development', 'Community Leadership', 'Sustainable Development', 'Opinion'],
  },
  'shg-success-story-bhilwara': {
    title: 'From Savings to Success: An SHG Story from Bhilwara',
    category: 'Case Study', author: 'Anita Verma', date: 'December 5, 2024', readTime: '8 min read',
    content: generateContent('From Savings to Success: An SHG Story from Bhilwara', 'Case Study', 'Anita Verma'),
    tags: ['Self-Help Groups', 'Savings', 'Bhilwara', 'Women Empowerment'],
  },
  'health-outcomes-rural-interventions': {
    title: 'Health Outcomes of Community-Based Interventions in Rural India',
    category: 'Research', author: 'Rajesh Meena', date: 'November 18, 2024', readTime: '9 min read',
    content: generateContent('Health Outcomes of Community-Based Interventions in Rural India', 'Research', 'Rajesh Meena'),
    tags: ['Health', 'Community Health', 'Rural Healthcare', 'Public Health'],
  },
  'mentorship-impact-entrepreneurship': {
    title: 'Why Mentorship Matters in Rural Entrepreneurship',
    category: 'Impact Story', author: 'Dr. Priya Sharma', date: 'November 2, 2024', readTime: '6 min read',
    content: generateContent('Why Mentorship Matters in Rural Entrepreneurship', 'Impact Story', 'Dr. Priya Sharma'),
    tags: ['Mentorship', 'Entrepreneurship', 'Business Development', 'Women Leaders'],
  },
};

const allArticles = Object.entries(articleData).map(([slug, data]) => ({
  slug,
  title: data.title,
  category: data.category,
  date: data.date,
}));

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = articleData[slug];
  const relatedArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Article Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">The article you're looking for doesn't exist.</p>
          <Button variant="primary" to="/knowledge-hub" className="mt-8">Back to Knowledge Hub</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} — RavivarVichar</title>
        <meta name="description" content={article.content.replace(/<[^>]*>/g, '').slice(0, 160)} />
      </Helmet>

      <PageLayout>
        <section className="bg-surface-secondary py-20 lg:py-28">
          <div className="container-content">
            <Link to="/knowledge-hub" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Knowledge Hub
            </Link>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-600 mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold text-ink-primary leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-ink-secondary">
                <span className="flex items-center gap-1.5"><User size={16} /> {article.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {article.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> {article.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="flex gap-12 max-w-5xl mx-auto">
              <div className="hidden lg:flex flex-col items-center gap-4 pt-4 sticky top-[120px] h-fit">
                <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">Share</span>
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Twitter size={16} /></button>
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Linkedin size={16} /></button>
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Facebook size={16} /></button>
              </div>
              <div className="flex-1 max-w-3xl" dangerouslySetInnerHTML={{ __html: article.content }} />
              <div className="lg:hidden flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                <span className="text-sm text-ink-secondary">Share:</span>
                <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Twitter size={14} /></button>
                <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Linkedin size={14} /></button>
                <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-ink-secondary hover:bg-primary-500 hover:text-white transition-all"><Facebook size={14} /></button>
              </div>
            </div>
          </div>
        </section>

        {article.tags && (
          <section className="pb-16 bg-surface-white">
            <div className="container-content">
              <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-sm px-4 py-2 rounded-full bg-surface-section text-ink-secondary border border-gray-100">#{tag}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="section-md bg-surface-section">
            <div className="container-content">
              <h2 className="text-2xl font-heading font-bold text-ink-primary mb-10">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((a) => (
                  <Link key={a.slug} to={`/knowledge-hub/${a.slug}`} className="card-hover p-6">
                    <span className="text-xs font-semibold text-primary-500">{a.category}</span>
                    <h3 className="text-lg font-bold font-heading text-ink-primary mt-2 group-hover:text-primary-500 transition-colors line-clamp-2">{a.title}</h3>
                    <span className="text-sm text-ink-secondary mt-2 block">{a.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </PageLayout>
    </>
  );
}
