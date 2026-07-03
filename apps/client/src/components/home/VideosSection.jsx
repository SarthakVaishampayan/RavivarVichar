import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Button from '../shared/Button';

const videos = [
  {
    title: 'Field Podcast Ep. 1: Voices from Jodhpur',
    description: 'Hear directly from SHG members about how financial literacy is changing their lives.',
    thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
    duration: '24:15',
  },
  {
    title: 'RavivarVichar — Our Journey So Far',
    description: 'A short documentary on our work across 12 districts in Rajasthan.',
    thumbnail: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    duration: '18:30',
  },
];

export default function VideosSection() {
  return (
    <section className="section-lg bg-surface-white">
      <div className="container-site">
        <SectionHeading
          label="Videos"
          title="Watch & Listen"
          description="Stories, podcasts, and documentaries from the field."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, i) => (
            <motion.div
              key={video.title}
              className="card-hover overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play size={24} className="text-primary-500 ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-4 right-4 rounded-full bg-black/60 text-white px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {video.duration}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-card font-heading font-bold text-text-primary mb-2">
                  {video.title}
                </h3>
                <p className="text-body text-text-secondary">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button variant="outline" to="/media" arrow>
            View All Media
          </Button>
        </div>
      </div>
    </section>
  );
}
