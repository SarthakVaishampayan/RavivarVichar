import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Button from '../shared/Button';
import FloatingDots from '../shared/FloatingDots';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-surface-white overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cpath fill='%23F5A623' d='M 0 0 C 200 100 300 300 200 500 C 100 700 200 800 400 800 C 600 800 700 600 800 400 C 900 200 700 0 500 0 Z'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </div>
      <FloatingDots count={6} />

      <div className="container-site w-full pt-[90px] pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left Content - 45% */}
          <div className="lg:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="section-label inline-block mb-5">
                Empowering Rural India
              </span>
              <h1 className="text-hero-mobile lg:text-hero text-text-primary leading-[1.1]">
                Building{' '}
                <span className="text-primary-500">Self-Reliant</span>{' '}
                Communities Through{' '}
                <span className="text-secondary-500">Knowledge</span> &amp; Action
              </h1>
              <p className="text-body text-text-secondary mt-6 max-w-lg">
                RavivarVichar works with rural communities in Rajasthan to
                foster entrepreneurship, strengthen self-help groups, and drive
                sustainable development through research and action.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <Button variant="primary" to="/partner-with-us" arrow>
                  Partner with Us
                </Button>
                <Button variant="secondary" to="/join-our-initiative" arrow={false}>
                  <Play size={18} />
                  Join Our Initiative
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Content - 55% (Image Collage with Organic Mask) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {/* Main blob image */}
            <div className="relative blob-mask w-full aspect-square max-w-[550px] mx-auto">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
                alt="Rural community empowerment"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating secondary image (smaller circle) */}
            <div className="absolute -bottom-6 -left-6 w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&q=80"
                alt="Women entrepreneurs"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating tertiary image */}
            <div className="absolute -top-4 -right-4 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&q=80"
                alt="Community"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
