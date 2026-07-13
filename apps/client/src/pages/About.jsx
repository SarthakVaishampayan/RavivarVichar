import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import SectionHeading from '../components/shared/SectionHeading';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { Eye, Heart, BookOpen, Zap, Users, Globe, Newspaper, Monitor, Calendar, Search, Megaphone } from 'lucide-react';

const stats = [
  { number: '32+', label: 'Years of Publication' },
  { number: '2023', label: 'Ravivar Vichar Launched' },
  { number: '10K+', label: 'Digital Reach' },
  { number: '100+', label: 'Issues Published' },
];

const coreValues = [
  {
    icon: Eye,
    title: 'Empowerment',
    description: 'We believe in the innate potential of women and aim to empower them by showcasing their achievements and providing them with resources, knowledge, and support.',
  },
  {
    icon: Heart,
    title: 'Inclusivity',
    description: 'We are committed to inclusivity and diversity, recognizing that women from different backgrounds, cultures, and experiences bring unique perspectives and strengths to the table.',
  },
  {
    icon: BookOpen,
    title: 'Literacy',
    description: 'We value the importance of education and knowledge-sharing, aiming to provide valuable insights, information, and resources to our audience. A source to provide financial literacy and digital literacy to women across India is close to our hearts.',
  },
  {
    icon: Zap,
    title: 'Inspiration',
    description: 'We strive to inspire women to overcome challenges, pursue their dreams, and become role models for others.',
  },
];

const goals = [
  { icon: Megaphone, title: "Amplify Women's Voices", description: 'We aim to provide a platform for women to share their stories, ideas, and perspectives, fostering a sense of community and solidarity.' },
  { icon: Zap, title: 'Highlight Success Stories', description: 'We will feature success stories of women who have made significant achievements, whether in their personal lives, careers, or within self-help groups, to motivate and inspire others.' },
  { icon: Search, title: 'Address Issues', description: 'We are committed to addressing critical issues that women face, including gender-based discrimination, economic disparities, healthcare, and education, by providing well-researched analysis and practical solutions.' },
  { icon: BookOpen, title: 'Knowledge Hub', description: "We aspire to become a knowledge hub, offering resources, articles, and guides on a wide range of topics relevant to women's empowerment, financial independence, health, and well-being." },
  { icon: Globe, title: 'Global Reach', description: 'We aim to expand our reach beyond India to encompass self-help groups of women from diverse cultures and backgrounds, fostering cross-cultural understanding and support.' },
  { icon: Users, title: 'Collaboration', description: 'We will collaborate with organisations, experts, and influencers who share our mission and values to amplify our impact and reach.' },
];

const initiatives = [
  { icon: Monitor, title: 'Digital Platform', description: "Ravivar Vichar is an innovative platform spread across various social media channels that is dedicated to shedding light on the critical issues concerning self-help groups and women's challenges in contemporary society. It leverages the power of social media to bridge the gap between information and action." },
  { icon: Newspaper, title: 'Monthly Magazine', description: "Launch a monthly print and digital magazine featuring success stories, interviews, and in-depth articles on women's issues." },
  { icon: Calendar, title: 'Webinars and Workshops', description: 'Organise webinars, workshops, and training sessions to provide women with practical skills and knowledge.' },
  { icon: Users, title: 'Community Building', description: 'Create online communities and forums where women can connect, share experiences, and seek support.' },
  { icon: Search, title: 'Research and Analysis', description: "Conduct research and analysis on self-help group initiatives, women's economic empowerment, and gender-related issues, publishing our findings to inform policies and practices." },
  { icon: Megaphone, title: 'Advocacy', description: "Engage in advocacy efforts to promote gender equality and women's rights and support policies that empower women." },
];

const visionTexts = [
  'Ravivar Vichar envisions a world where women from self-help groups and beyond can reach their full potential, break barriers, and lead fulfilling lives. By sharing stories of success, addressing issues, and providing valuable resources, we aim to be a catalyst for positive change and contribute to a more equitable and empowered society. Together, we can build a brighter future for women everywhere.',
  'Our vision is to be a leading global platform that serves as a beacon of inspiration, support, and knowledge for women involved in self-help groups and all women in general. We aspire to foster positive change, empowerment, and gender equality through our content and engagement.',
];

export default function About() {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const img = new Image();
    img.src = '/about-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

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
        <title>About Us — Ravivar Vichar</title>
        <meta name="description" content="Ravivar Vichar is a digital and print platform under Ravivar Publications Pvt. Ltd., dedicated to empowering women from self-help groups through stories, resources, and advocacy." />
      <link rel="preload" as="image" href="/about-hero.jpg" />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section id="our-story" className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[20vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/about-hero.jpg"
  alt="About Ravivar Vichar"
  onLoad={() => setLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`}
/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          {/* Content */}
          <div className="w-full relative z-10 max-lg:px-6 pl-[5vw]">
            <div className="max-w-[580px]">
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">ABOUT US</span>
              <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
                Amplifying Women's{' '}
                <span className="text-[#F5A623]">Voices</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                Ravivar Vichar, a prominent digital and print platform, is a publication under the esteemed banner 
                of Ravivar Publications Pvt. Ltd. We are dedicated to empowering and uplifting women from self-help 
                groups in India and around the world.
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

        {/* Vision */}
        <section id="our-vision" className="section-md bg-surface-section">
          <div className="container-content">
            <div className="max-w-3xl mx-auto">
              <SectionHeading
                label="OUR VISION"
                title="A World of Empowered Women"
                description=""
                align="center"
              />
              <div className="space-y-6 text-body text-ink-secondary mt-10">
                {visionTexts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section id="our-mission" className="section-md bg-surface-white">
          <div className="container-content">
            <div className="max-w-3xl mx-auto">
              <SectionHeading
                label="OUR MISSION"
                title="Empower, Uplift, Inspire"
                description=""
                align="center"
              />
              <p className="text-body text-ink-secondary mt-10 text-center max-w-2xl mx-auto">
                Ravivar Vichar is dedicated to empowering and uplifting women from self-help groups in India and 
                around the world by providing a comprehensive digital and print platform. Our mission is to share 
                success stories and perspectives, address issues, and offer insightful analyses that celebrate the 
                achievements of these women and shed light on a wide range of female-related topics.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id="our-values" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="CORE VALUES"
              title="What Drives Us"
              description="The principles that guide every story we tell and every initiative we undertake."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {coreValues.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card p-8 lg:p-10">
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

        {/* Goals & Objectives */}
        <section id="our-goals" className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="GOALS & OBJECTIVES"
              title="What We Aim to Achieve"
              description="Our roadmap to creating lasting impact for women everywhere."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {goals.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-hover p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-heading text-ink-primary">{item.title}</h3>
                        <p className="text-sm text-ink-secondary mt-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section id="our-journey" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OUR JOURNEY"
              title="A Decade of Impact"
              description="From a small initiative to a recognized force in rural development — our journey of growth and impact."
            />
            <div className="relative mt-16">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gray-200 lg:-translate-x-px" />
              <div className="space-y-12">
                {[
                  { year: '2010', title: 'Foundation', description: 'Ravivar Vichar was established with a vision to revive rural livelihoods through research and community action.' },
                  { year: '2013', title: 'First SHG Network', description: 'Launched our first Self-Help Group network in 20 villages across Bhilwara district.' },
                  { year: '2016', title: 'Entrepreneurship Program', description: 'Started the women entrepreneurship program, training 500+ rural women in business skills.' },
                  { year: '2019', title: 'Research Wing', description: 'Established our research division to produce data-driven policy recommendations for rural development.' },
                  { year: '2022', title: 'Digital Expansion', description: 'Launched digital literacy programs and expanded our reach to 500+ villages across Rajasthan.' },
                  { year: '2025', title: 'National Impact', description: 'Recognized nationally for our community-driven development model and sustainable impact.' },
                ].map((item, i) => (
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

        {/* Key Initiatives */}
        <section className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="KEY INITIATIVES"
              title="Our Flagship Programs"
              description="Concrete actions we're taking to turn our vision into reality."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              {initiatives.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card p-6 lg:p-8">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-card font-heading font-bold text-ink-primary mb-2">{item.title}</h3>
                        <p className="text-body text-ink-secondary">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our History */}
        <section id="our-history" className="section-md bg-surface-white">
          <div className="container-content">
            <SectionHeading
              label="OUR HISTORY"
              title="Three Decades of Impact"
              description="From a trusted magazine to a modern digital platform — our journey of growth."
            />
            <div className="max-w-3xl mx-auto mt-12 space-y-8 text-body text-ink-secondary">
              <p>
                Ravivar Vichar, a prominent digital and print platform, is a publication under the esteemed banner 
                of Ravivar Publications Pvt. Ltd. It has been a part of the media landscape for over three decades, 
                gaining recognition for its flagship publication, <strong>Ravivar Digest</strong>, which has been in 
                circulation for 32 years.
              </p>
              <p>
                Ravivar Digest has been a trailblazer in addressing social and contemporary issues. It has consistently 
                played a vital role in enlightening society about various pertinent matters, with a particular emphasis 
                on promoting awareness about self-help groups and women's issues. Over the years, it has established 
                itself as a trusted source of information and inspiration.
              </p>
              <p>
                In <strong>2023</strong>, the publication expanded its horizons by launching Ravivar Vichar, a platform 
                that aimed to provide a digital space for contemporary discourse. This venture was driven by the 
                commitment to amplify the voices of marginalised communities, especially women, and shed light on the 
                challenges they face. The response to Ravivar Vichar has been nothing short of phenomenal, resonating 
                with a diverse cross-section of society.
              </p>
              <p>
                Ravivar Vichar continues to uphold the legacy of Ravivar Publications Pvt. Ltd., serving as a beacon 
                of informed journalism and social awareness as it carries forward its mission to educate, inspire, and 
                empower its readership.
              </p>
            </div>
          </div>
        </section>

        {/* Our Founders */}
        <section id="our-founders" className="section-md bg-surface-section">
          <div className="container-content">
            <SectionHeading
              label="OUR FOUNDERS"
              title="Meet the People Behind the Mission"
              description="Passionate individuals committed to driving change in rural communities."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {[
                { name: 'Dr. Priya Sharma', role: 'Founder & Executive Director', bio: 'PhD in Rural Development with 20+ years of experience in community-led initiatives across Rajasthan.' },
                { name: 'Rajesh Meena', role: 'Head of Programs', bio: 'Former district development officer who brings grassroots expertise to program design and implementation.' },
                { name: 'Anita Verma', role: 'Research Director', bio: 'Economist specializing in rural livelihoods, impact assessment, and policy research.' },
                { name: 'Vikram Singh', role: 'Operations Lead', bio: 'Expert in scaling grassroots operations and building sustainable community partnerships.' },
              ].map((member) => (
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
              Join Our Movement
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
              Whether you want to share your story, partner with us, or support our mission — every voice matters.
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
