import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { Users, Target, Heart, Award } from 'lucide-react';

const stats = [
  { number: '500+', label: 'Villages Reached' },
  { number: '50K+', label: 'Lives Impacted' },
  { number: '200+', label: 'SHGs Established' },
  { number: '15+', label: 'Years of Service' },
];

const timeline = [
  { year: '2010', title: 'Foundation', description: 'RavivarVichar was established with a vision to revive rural livelihoods through research and community action.' },
  { year: '2013', title: 'First SHG Network', description: 'Launched our first Self-Help Group network in 20 villages across Bhilwara district.' },
  { year: '2016', title: 'Entrepreneurship Program', description: 'Started the women entrepreneurship program, training 500+ rural women in business skills.' },
  { year: '2019', title: 'Research Wing', description: 'Established our research division to produce data-driven policy recommendations for rural development.' },
  { year: '2022', title: 'Digital Expansion', description: 'Launched digital literacy programs and expanded our reach to 500+ villages across Rajasthan.' },
  { year: '2025', title: 'National Impact', description: 'Recognized nationally for our community-driven development model and sustainable impact.' },
];

const team = [
  { name: 'Dr. Priya Sharma', role: 'Founder & Executive Director', bio: 'PhD in Rural Development with 20+ years of experience in community-led initiatives across Rajasthan.', image: null },
  { name: 'Rajesh Meena', role: 'Head of Programs', bio: 'Former district development officer who brings grassroots expertise to program design and implementation.', image: null },
  { name: 'Anita Verma', role: 'Research Director', bio: 'Economist specializing in rural livelihoods, impact assessment, and policy research.', image: null },
  { name: 'Vikram Singh', role: 'Operations Lead', bio: 'Expert in scaling grassroots operations and building sustainable community partnerships.', image: null },
];

const values = [
  { icon: Target, title: 'Our Mission', description: 'To empower rural communities through sustainable livelihoods, education, and entrepreneurship while preserving cultural heritage.' },
  { icon: Heart, title: 'Our Vision', description: 'A self-reliant rural India where every community has the resources, knowledge, and agency to shape its own future.' },
  { icon: Award, title: 'Our Approach', description: 'Community-led development combining grassroots action with rigorous research for evidence-based impact.' },
];

export default function About() {
  const location = useLocation();

  // Handle hash on page load for scroll-to-section
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>About Us — RavivarVichar</title>
        <meta name="description" content="Learn about RavivarVichar's mission to empower rural communities through research, entrepreneurship, and self-help groups since 2010." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section id="our-story" className="relative overflow-hidden bg-surface-secondary py-24 lg:py-32">
          <FloatingDots />
          <div className="container-content relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label">OUR STORY</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Empowering Rural{' '}
                <span className="text-primary-500">Communities</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
                For over a decade, RavivarVichar has been working at the grassroots level to revive rural livelihoods, 
                foster entrepreneurship, and create sustainable change across Rajasthan.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold font-heading text-primary-500">{stat.number}</div>
                  <div className="text-sm text-ink-secondary mt-2 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission / Vision / Approach */}
        <section id="our-values" className="section-md bg-surface-section">
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card p-8 lg:p-10 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-6">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-card font-heading font-bold text-ink-primary mb-4">{item.title}</h3>
                    <p className="text-body text-ink-secondary">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section id="our-journey" className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="OUR JOURNEY"
              title="A Decade of Impact"
              description="From a small initiative to a recognized force in rural development — our journey of growth and impact."
            />
            <div className="relative mt-16">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gray-200 lg:-translate-x-px" />
              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <div key={item.year} className={`relative flex flex-col lg:flex-row items-start gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="card p-6 lg:p-8 inline-block max-w-lg">
                        <span className="text-sm font-bold text-primary-500">{item.year}</span>
                        <h3 className="text-xl font-bold font-heading text-ink-primary mt-1">{item.title}</h3>
                        <p className="text-body text-ink-secondary mt-3">{item.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow -translate-x-1.5 lg:-translate-x-2 mt-2 z-10" />
                    <div className="flex-1 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission (moved from homepage) */}
        <section id="our-mission" className="section-md bg-surface-section">
          <div className="container-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden mx-auto shadow-card border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80"
                    alt="Our mission"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 right-8 w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-soft">
                  <img
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80"
                    alt="Community work"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <SectionHeading
                  label="OUR MISSION"
                  title="Empowering Communities, Transforming Lives"
                  description=""
                  align="left"
                />
                <div className="space-y-5 text-body text-ink-secondary">
                  <p>
                    At RavivarVichar, we believe that sustainable change comes from within
                    communities. Our mission is to equip rural women and marginalized groups
                    with the knowledge, skills, and resources they need to build better futures
                    for themselves and their families.
                  </p>
                  <p>
                    Through research-driven programs, financial literacy initiatives, and
                    grassroots entrepreneurship support, we're creating an ecosystem where
                    rural communities can thrive on their own terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="our-founders" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OUR FOUNDERS"
              title="Meet the People Behind the Mission"
              description="Passionate individuals committed to driving change in rural communities."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {team.map((member) => (
                <div key={member.name} className="card-hover overflow-hidden text-center group">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-primary-200 flex items-center justify-center">
                      <Users size={32} className="text-primary-500" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold font-heading text-ink-primary">{member.name}</h3>
                    <p className="text-sm font-medium text-primary-500 mt-1">{member.role}</p>
                    <p className="text-sm text-ink-secondary mt-3">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-md bg-primary-500 relative overflow-hidden">
          <FloatingDots />
          <div className="container-content relative z-10 text-center">
            <h2 className="text-section-mobile lg:text-section text-white font-heading font-bold">
              Want to Make a Difference?
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
              Join us in our mission to empower rural communities. Your support can transform lives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="secondary" to="/join-our-initiative" arrow>Join Our Initiative</Button>
              <Button variant="outline" to="/contact" className="border-white text-white hover:bg-white hover:text-primary-500">Get in Touch</Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
