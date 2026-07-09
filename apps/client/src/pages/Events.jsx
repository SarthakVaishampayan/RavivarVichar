import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/shared/Button';
import { Calendar, MapPin } from 'lucide-react';
import api from '../lib/axios';

export default function Events() {
  const [loaded, setLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const img = new Image();
    img.src = '/events-hero.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = filter === 'all' ? { limit: 50, sort: '-createdAt' } : { type: filter, limit: 50, sort: '-createdAt' };
        const { data } = await api.get('/events', { params });
        setEvents(data.data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '', month: '', year: '' };
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      year: d.getFullYear().toString(),
    };
  };

  return (
    <>
      <Helmet>
        <title>Events — Ravivar Vichar</title>
        <meta name="description" content="Upcoming and past events from Ravivar Vichar — conferences, workshops, camps, summits, and symposiums." />
      <link rel="preload" as="image" href="/events-hero.jpg" />
      </Helmet>

      <PageLayout>
        <section className="relative min-h-[70vh] lg:min-h-[calc(100vh-90px)] flex items-start overflow-hidden pt-[35vh]">
          {/* Background image */}
          <div className="absolute inset-0 bg-gray-900">
            <img
  src="/events-hero.jpg"
  alt="Ravivar Vichar Events"
  onLoad={() => setLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`}
/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)' }} />
          </div>
          {/* Content */}
          <div className="w-full relative z-10 pl-[5vw]">
            <div className="max-w-[580px]">
              <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">EVENTS</span>
              <h1 className="text-3xl lg:text-5xl text-white leading-[1.2]">
                Join Us at <span className="text-[#F5A623]">Our Events</span>
              </h1>
              <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
                From conferences to community camps, we organize events that bring together changemakers, community leaders, and partners to drive rural development.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Buttons (Below Hero) */}
        <section className="bg-surface-white py-8 border-b border-gray-100">
          <div className="container-content">
            <div className="flex items-center justify-center gap-3">
              {['all', 'upcoming', 'past'].map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setLoading(true); }}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${filter === f ? 'bg-primary-500 text-white shadow-soft' : 'bg-white text-ink-secondary hover:text-primary-500 border border-gray-200'}`}
                >
                  {f === 'all' ? 'All Events' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-md bg-surface-white">
          <div className="container-content">
            {loading ? (
              <div className="text-center py-16"><p className="text-lg text-ink-secondary">Loading events...</p></div>
            ) : (
              <div className="space-y-8 max-w-4xl mx-auto">
                {events.length === 0 ? (
                  <div className="text-center py-16"><p className="text-lg text-ink-secondary">No events found.</p></div>
                ) : (
                  events.map((event) => {
                    const fd = formatDate(event.createdAt);
                    return (
                      <div key={event._id} className="card-hover overflow-hidden flex flex-col lg:flex-row">
                        <div className="lg:w-32 shrink-0 bg-surface-section flex items-center justify-center py-6 lg:py-0">
                          <div className="text-center">
                            <div className="text-2xl font-bold font-heading text-primary-500">{fd.day}</div>
                            <div className="text-sm text-ink-secondary uppercase tracking-wider">{fd.month}</div>
                            <div className="text-xs text-ink-secondary font-medium">{fd.year}</div>
                          </div>
                        </div>
                        <div className="flex-1 p-6 lg:p-8">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            {event.type === 'upcoming' && (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600">Upcoming</span>
                            )}
                          </div>
                          <h3 className="text-xl lg:text-card font-heading font-bold text-ink-primary">{event.title}</h3>
                          <p className="text-body text-ink-secondary mt-3 line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-ink-secondary">
                            <span className="flex items-center gap-1.5"><MapPin size={15} /> {event.location?.address || 'Location TBD'}</span>
                          </div>
                        </div>
                        <div className="lg:w-32 shrink-0 flex items-center justify-center p-6 lg:p-0">
                          <Button variant={event.type === 'upcoming' ? 'primary' : 'secondary'} size="sm">
                            {event.type === 'upcoming' ? 'Register' : 'View'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </section>

        <section className="section-md bg-surface-section">
          <div className="container-content text-center">
            <h2 className="text-section-mobile lg:text-section text-ink-primary font-heading font-bold">
              Want to Organize an Event With Us?
            </h2>
            <p className="text-body text-ink-secondary mt-4 max-w-xl mx-auto">
              We collaborate with partners to organize community events, workshops, and conferences. Let's create impact together.
            </p>
            <Button variant="primary" to="/contact" className="mt-8" arrow>Contact Us</Button>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
