import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../shared/Button';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/hero-image.jpg';
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href="/hero-image.jpg" />
      </Helmet>
      <section className="relative mt-[90px] min-h-[calc(100vh-90px)] flex items-start overflow-hidden max-lg:pt-[12vh] pt-[15vh]">
      {/* Full-screen background image fills section (starts below navbar) */}
      <div className="absolute inset-0 bg-[#101010]">
        <img
          src="/hero-image.jpg"
          alt="Ravivar Vichar community work"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-[65%_center] transition-opacity duration-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Gradient overlay: dark on left, transparent on right */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.70) 35%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.08) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="w-full pb-24 relative z-10 max-lg:px-6 pl-[5vw]">
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
              <span className="text-[#F5A623]">Women</span>.{' '}
              Strengthening{' '}
              <span className="text-[#C9892D]">Communities</span>
            </h1>
            <p className="text-lg text-white/70 mt-6 leading-relaxed max-w-[550px]">
              Ravivar Vichar empowers women through entrepreneurship, knowledge, partnerships, and community-driven action to create lasting social and economic impact.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Button
                variant="primary"
                to="/partner-with-us"
                className="!bg-[#C9892D] !text-white hover:!bg-[#B87A1A] !border-[#C9892D]"
                arrow
              >
                Partner With Us
              </Button>
              <Button
                variant="outline"
                to="/join-our-initiative"
                className="!border-white !text-white hover:!bg-white/10"
                arrow
              >
                Join Our Initiative
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
