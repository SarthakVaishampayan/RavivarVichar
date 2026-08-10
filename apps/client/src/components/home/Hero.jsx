import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSlideshow from '../shared/HeroSlideshow';
// NOTE: "Partner With Us" / "Join Our Initiative" buttons were temporarily
// removed from the home hero (2026-08). Restore here if we need them again.

export default function Hero() {
  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href="/hero-image.jpg" />
      </Helmet>
      <section className="relative mt-[90px] min-h-[calc(100vh-90px)] flex items-center overflow-hidden max-md:items-start max-md:pt-[12vh] lg:items-start lg:pt-[15vh]">
      {/* Full-screen rotating hero background (gallery of all hero images) */}
      <HeroSlideshow wrapperClass="bg-[#101010]" imageClass="object-[65%_center]" />

      {/* Content */}
      <div className="w-full pb-24 md:pb-0 lg:pb-24 relative z-10 max-lg:px-6 pl-[5vw]">
        <div className="max-w-[580px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-sm font-semibold tracking-[0.15em] text-white/70 uppercase inline-block mb-5">
              EMPOWERING INDIA'S WOMEN
            </span>
            <h1 className="text-3xl max-lg:text-hero-mobile lg:text-5xl text-white leading-[1.2]">
              Building{' '}
              <span className="text-[#6AA84F]">Independent</span>{' '}
              <span className="text-primary-500">Women</span>.{' '}
              Strengthening{' '}
              <span className="text-primary-500">Communities</span>
            </h1>
            <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
              Ravivar Vichar empowers women through entrepreneurship, knowledge, partnerships, and community-driven action to create lasting social and economic impact.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
