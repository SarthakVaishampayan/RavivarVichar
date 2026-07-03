import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import FloatingDots from '../components/shared/FloatingDots';
import Button from '../components/shared/Button';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useState } from 'react';

const events = [
  { id: 1, title: 'Annual Rural Development Conference 2025', date: 'Aug 15, 2025', time: '9:00 AM - 5:00 PM', location: 'Jaipur, Rajasthan', description: 'Our flagship conference bringing together policymakers, practitioners, and community leaders to discuss rural development strategies.', category: 'Conference', attendees: 500, type: 'upcoming' },
  { id: 2, title: 'Women Entrepreneurs Meetup — Bhilwara', date: 'Jul 22, 2025', time: '10:00 AM - 3:00 PM', location: 'Bhilwara, Rajasthan', description: 'A networking and learning event for women entrepreneurs to share experiences, challenges, and best practices.', category: 'Workshop', attendees: 200, type: 'upcoming' },
  { id: 3, title: 'Financial Literacy Camp — Udaipur', date: 'Jun 10, 2025', time: '9:00 AM - 4:00 PM', location: 'Udaipur, Rajasthan', description: 'A day-long camp covering digital banking, budgeting, savings, and financial planning for rural families.', category: 'Camp', attendees: 300, type: 'upcoming' },
  { id: 4, title: 'SHG Leaders Summit 2025', date: 'May 5, 2025', time: '10:00 AM - 4:00 PM', location: 'Chittorgarh, Rajasthan', description: 'Annual gathering of SHG leaders to share achievements, learn from each other, and plan for the year ahead.', category: 'Summit', attendees: 350, type: 'past' },
  { id: 5, title: 'Research Symposium: Rural India 2025', date: 'Mar 20, 2025', time: '9:30 AM - 5:30 PM', location: 'Udaipur, Rajasthan', description: 'Presentation of research findings on rural development, with sessions on policy implications and future directions.', category: 'Symposium', attendees: 250, type: 'past' },
  { id: 6, title: 'Health Awareness Camp — Chittorgarh', date: 'Feb 12, 2025', time: '8:00 AM - 2:00 PM', location: 'Chittorgarh, Rajasthan', description: 'Free health check-ups, nutrition counseling, and awareness sessions for rural communities.', category: 'Camp', attendees: 450, type: 'past' },
];

export default function Events() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <>
      <Helmet>
        <title>Events — RavivarVichar</title>
        <meta name="description" content="Upcoming and past events from RavivarVichar — conferences, workshops, camps, summits, and symposiums." />
      </Helmet>

      <PageLayout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-secondary py-24 lg:py-32">
          <FloatingDots />
          <div className="container-content relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label">EVENTS</span>
              <h1 className="text-hero-mobile lg:text-hero text-ink-primary mt-4 leading-tight">
                Join Us at{' '}
                <span className="text-primary-500">Our Events</span>
              </h1>
              <p className="text-body text-ink-secondary mt-6 max-w-2xl mx-auto">
                From conferences to community camps, we organize events that bring together changemakers, 
                community leaders, and partners to drive rural development.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {['all', 'upcoming', 'past'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === f
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All Events' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Events List */}
        <section className="section-md bg-surface-white">
          <div className="container-content">
            <div className="space-y-8 max-w-4xl mx-auto">
              {filtered.map((event, i) => (
                <div key={event.id} className="card-hover overflow-hidden flex flex-col lg:flex-row">
                  {/* Date Badge */}
                  <div className="lg:w-32 shrink-0 bg-surface-section flex items-center justify-center py-6 lg:py-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-heading text-primary-500">
                        {event.date.split(' ')[1]?.replace(',', '')}
                      </div>
                      <div className="text-sm text-ink-secondary uppercase tracking-wider">
                        {event.date.split(' ')[0]}
                      </div>
                      <div className="text-xs text-ink-secondary font-medium">
                        {event.date.split(' ')[2]}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-600">
                        {event.category}
                      </span>
                      {event.type === 'upcoming' && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl lg:text-card font-heading font-bold text-ink-primary">
                      {event.title}
                    </h3>
                    <p className="text-body text-ink-secondary mt-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-ink-secondary">
                      <span className="flex items-center gap-1.5"><Clock size={15} /> {event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={15} /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><Users size={15} /> {event.attendees}+ attendees</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="lg:w-32 shrink-0 flex items-center justify-center p-6 lg:p-0">
                    <Button variant={event.type === 'upcoming' ? 'primary' : 'secondary'} size="sm">
                      {event.type === 'upcoming' ? 'Register' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-md bg-surface-section">
          <div className="container-content text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">
              Want to Organize an Event With Us?
            </h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">
              We collaborate with partners to organize community events, workshops, and conferences. 
              Let's create impact together.
            </p>
            <Button variant="primary" to="/contact" className="mt-8" arrow>Contact Us</Button>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
