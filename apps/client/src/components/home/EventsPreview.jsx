import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';

const events = [
  {
    title: 'Annual Women Entrepreneurs Summit 2026',
    date: 'March 15, 2026',
    time: '9:00 AM – 5:00 PM',
    location: 'Jaipur, Rajasthan',
    type: 'Conference',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
  {
    title: 'SHG Bookkeeping Bootcamp',
    date: 'February 10, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'Udaipur, Rajasthan',
    type: 'Workshop',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
  },
];

export default function EventsPreview() {
  return (
    <section className="section-lg bg-surface-section">
      <div className="container-site">
        <SectionHeading
          label="Events"
          title="Upcoming Events"
          description="Join us for workshops, conferences, and community gatherings."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card-hover overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <span className="inline-block rounded-full bg-primary-50 text-primary-600 px-3 py-1 text-xs font-medium mb-3 w-fit">
                    {event.type}
                  </span>
                  <h3 className="text-[20px] font-heading font-bold text-text-primary mb-3 leading-snug">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p className="flex items-center gap-2">
                      <Calendar size={15} className="text-primary-500" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={15} className="text-primary-500" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={15} className="text-primary-500" />
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
