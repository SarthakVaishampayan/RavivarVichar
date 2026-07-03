import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import FloatingDots from '../components/shared/FloatingDots';
import api from '../lib/axios';
import { ArrowLeft, Check } from 'lucide-react';

const colorMap = {
  primary: { text: 'text-primary-500', bg: 'bg-primary-50', icon: 'text-primary-500 fill-primary-500' },
  secondary: { text: 'text-secondary-500', bg: 'bg-secondary-50', icon: 'text-secondary-500 fill-secondary-500' },
  blue: { text: 'text-blue-500', bg: 'bg-blue-50', icon: 'text-blue-500 fill-blue-500' },
  red: { text: 'text-red-500', bg: 'bg-red-50', icon: 'text-red-500 fill-red-500' },
  green: { text: 'text-green-600', bg: 'bg-green-50', icon: 'text-green-600 fill-green-600' },
};

export default function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const { data } = await api.get(`/programs/slug/${slug}`);
        setProgram(data.data);
      } catch (err) {
        console.error('Failed to fetch program:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <p className="text-lg text-ink-secondary">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (!program) {
    return (
      <PageLayout>
        <div className="container-content py-32 text-center">
          <h1 className="text-3xl font-heading font-bold text-ink-primary">Program Not Found</h1>
          <p className="text-body text-ink-secondary mt-4">The program you're looking for doesn't exist.</p>
          <Button variant="primary" to="/programs" className="mt-8">View All Programs</Button>
        </div>
      </PageLayout>
    );
  }

  if (!program.color) program.color = 'primary';
  const colors = colorMap[program.color] || colorMap.primary;
  const stats = program.stats || {};
  const impact = program.impact || [];
  const approach = program.approach || [];
  const tagline = program.tagline || '';

  return (
    <>
      <Helmet>
        <title>{program.title} — RavivarVichar Programs</title>
        <meta name="description" content={tagline || program.description} />
      </Helmet>

      <PageLayout>
        <section className={`relative overflow-hidden ${colors.bg} py-24 lg:py-32`}>
          <FloatingDots />
          <div className="container-content relative z-10">
            <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary-500 transition-colors mb-8">
              <ArrowLeft size={16} /> Back to Programs
            </Link>
            <div className="max-w-3xl">
              <span className={`section-label ${colors.text}`}>{program.title}</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                {tagline || program.title}
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl">{program.description}</p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button variant="primary" to="/donate" arrow>Support This Program</Button>
                <Button variant="secondary" to="/contact">Get Involved</Button>
              </div>
            </div>
          </div>
        </section>

        {Object.keys(stats).length > 0 && (
          <section className="section-sm bg-surface-white">
            <div className="container-content">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className={`text-3xl lg:text-4xl font-bold font-heading ${colors.text}`}>{value}</div>
                    <div className="text-sm text-ink-secondary mt-1 capitalize">{key.replace(/_/g, ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {approach.length > 0 && (
          <section className="section-md bg-surface-section">
            <div className="container-content">
              <div className="text-center mb-16">
                <span className={`section-label ${colors.text}`}>OUR APPROACH</span>
                <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold mt-3">How We Make It Happen</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {approach.map((item, i) => (
                  <div key={i} className="card-hover p-8 flex gap-5">
                    <div className={`shrink-0 h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} font-bold text-lg`}>{i + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold font-heading text-ink-primary">{item.title}</h3>
                      <p className="text-body text-ink-secondary mt-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {impact.length > 0 && (
          <section className="section-md bg-surface-white">
            <div className="container-content">
              <div className="text-center mb-16">
                <span className={`section-label ${colors.text}`}>OUR IMPACT</span>
                <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold mt-3">Measurable Results</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {impact.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-card bg-surface-section">
                    <Check size={20} className={`shrink-0 mt-0.5 ${colors.text}`} />
                    <span className="text-body text-ink-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={`section-md ${colors.bg} relative overflow-hidden`}>
          <FloatingDots />
          <div className="container-content relative z-10 text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">Ready to Make an Impact?</h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">Your support can help us expand this program to reach more communities.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="primary" to="/donate" arrow>Donate Now</Button>
              <Button variant="secondary" to="/contact">Volunteer With Us</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
