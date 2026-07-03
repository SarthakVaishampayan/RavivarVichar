import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';
import api from '../../lib/axios';

export default function EventsPreview() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events', { params: { type: 'upcoming', limit: 2 } });
        setEvents(data.data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <section className="section-lg bg-surface-section">
      <div className="container-site">
        <SectionHeading
          label="Events"
          title="Upcoming Events"
          description="Join us for workshops, conferences, and community gatherings."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(loading ? [] : events).map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card-hover overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <Calendar size={48} className="text-primary-300" />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <span className="inline-block rounded-full bg-primary-50 text-primary-600 px-3 py-1 text-xs font-medium mb-3 w-fit">
                    {event.type === 'upcoming' ? 'Upcoming' : 'Past'}
                  </span>
                  <h3 className="text-[20px] font-heading font-bold text-ink-primary mb-3 leading-snug">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-ink-secondary">
                    <p className="flex items-center gap-2">
                      <Calendar size={15} className="text-primary-500" />
                      {formatDate(event.createdAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={15} className="text-primary-500" />
                      {event.location?.address || 'Location TBD'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {!loading && events.length === 0 && (
            <div className="col-span-2 text-center py-12 text-ink-secondary">
              <p>No upcoming events. Check back soon!</p>
            </div>
          )}
        </div>

        <div className="text-center mt-14">
          <Button variant="outline" to="/events" arrow>
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}
