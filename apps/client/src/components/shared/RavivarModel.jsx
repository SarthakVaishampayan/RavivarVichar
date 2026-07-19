import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  BookOpen,
  Zap,
  Briefcase,
  TrendingUp,
  Shield,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const modelSteps = [
  {
    step: 1,
    label: 'LEARN',
    tabLabel: 'Learn',
    icon: BookOpen,
    description:
      'Access knowledge, awareness, and information through workshops, training, and digital resources.',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    step: 2,
    label: 'BUILD SKILLS',
    tabLabel: 'Build',
    icon: Zap,
    description:
      'Develop entrepreneurial, financial, and leadership skills through hands-on training and mentorship.',
    gradient: 'from-primary-400 to-primary-500',
  },
  {
    step: 3,
    label: 'START / STRENGTHEN BUSINESS',
    tabLabel: 'Start',
    icon: Briefcase,
    description:
      'Launch or grow a business with support in market access, financial linkages, and capacity building.',
    gradient: 'from-secondary-400 to-primary-500',
  },
  {
    step: 4,
    label: 'EARN',
    tabLabel: 'Earn',
    icon: TrendingUp,
    description:
      'Generate sustainable income through entrepreneurship, SHG livelihoods, and market opportunities.',
    gradient: 'from-secondary-500 to-secondary-400',
  },
  {
    step: 5,
    label: 'BECOME ECONOMICALLY INDEPENDENT',
    tabLabel: 'Freedom',
    icon: Shield,
    description:
      'Achieve financial autonomy with savings, assets, and the confidence to make independent decisions.',
    gradient: 'from-secondary-600 to-secondary-500',
  },
  {
    step: 6,
    label: 'LEAD',
    tabLabel: 'Lead',
    icon: Award,
    description:
      'Take on leadership roles in SHGs, community institutions, and local governance structures.',
    gradient: 'from-primary-600 to-secondary-600',
  },
  {
    step: 7,
    label: 'STRENGTHEN THE COMMUNITY',
    tabLabel: 'Community',
    icon: Users,
    description:
      'Mentor other women, create local opportunities, and build resilient communities that drive lasting change.',
    gradient: 'from-primary-500 to-primary-700',
  },
];

/* ── Pill Tab ── */
function PillTab({ step, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all duration-300 min-w-0 flex-1 ${
        isActive
          ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg scale-105`
          : 'bg-primary-50/60 border border-primary-100/60 text-ink-secondary hover:bg-primary-50 hover:border-primary-300 hover:shadow-sm hover:text-primary-600'
      }`}
    >
      {/* Step number */}
      <span
        className={`text-sm font-black leading-none transition-colors duration-300 ${
          isActive ? 'text-white/90' : 'text-primary-400/70'
        }`}
      >
        {String(step.step).padStart(2, '0')}
      </span>

      {/* Label */}
      <span className="text-[9px] font-bold font-heading uppercase tracking-wider whitespace-nowrap">
        {step.tabLabel}
      </span>

      {/* Active indicator dot */}
      {isActive && (
        <motion.span
          className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white"
          layoutId="activeDot"
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}
    </button>
  );
}

/* ── Main Component ── */
export default function RavivarModel() {
  const [activeStep, setActiveStep] = useState(0);
  const step = modelSteps[activeStep];
  const Icon = step.icon;

  const goNext = () => setActiveStep((p) => Math.min(p + 1, modelSteps.length - 1));
  const goPrev = () => setActiveStep((p) => Math.max(p - 1, 0));

  return (
    <section id="our-model" className="section-md bg-surface-section relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-72 h-72 rounded-full bg-primary-100/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-72 h-72 rounded-full bg-secondary-100/15 blur-3xl" />
      </div>

      <div className="container-content relative z-10">
        {/* ═══ Header ═══ */}
        <div className="max-w-3xl mx-auto text-center mb-6 lg:mb-8">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            OUR APPROACH
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The Pathway to Empowerment
          </motion.h2>
          <motion.p
            className="section-desc"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Seven progressive steps — from gaining knowledge to leading communities.
          </motion.p>
        </div>

        {/* ═══ Pill Tab Navigator ═══ */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="-mx-4 sm:mx-0 overflow-x-auto overflow-y-visible px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <LayoutGroup>
              <div className="flex items-center gap-1.5 lg:gap-2 w-max sm:w-full sm:justify-center">
                {modelSteps.map((s, i) => (
                  <PillTab
                    key={s.step}
                    step={s}
                    isActive={activeStep === i}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
            </LayoutGroup>
          </motion.div>

          {/* ═══ Active Step Content ═══ */}
          <div className="mt-6 lg:mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Gradient accent bar at top */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${step.gradient}`}
                />

                <div className="p-6 lg:p-8">
                  <div className="flex items-start gap-5 lg:gap-8">
                    {/* Step number (large decorative) */}
                    <div className="hidden lg:block shrink-0">
                      <span
                        className={`text-7xl font-black font-heading bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent select-none`}
                      >
                        {String(step.step).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-md flex items-center justify-center`}
                    >
                      <Icon size={26} className="text-white" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      {/* Step label */}
                      <span className="text-[11px] font-bold font-heading uppercase tracking-[0.15em] text-primary-500">
                        Step {String(step.step).padStart(2, '0')}
                      </span>
                      <h3 className="text-xl lg:text-2xl font-bold font-heading text-ink-primary mt-1">
                        {step.label}
                      </h3>
                      <p className="text-sm lg:text-body text-ink-secondary mt-3 leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  <div className="flex items-center justify-between mt-6 lg:mt-8 pt-4 border-t border-gray-50">
                    <button
                      onClick={goPrev}
                      disabled={activeStep === 0}
                      className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-primary-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <span className="text-xs text-ink-secondary/50 font-medium">
                      Step {activeStep + 1} of {modelSteps.length}
                    </span>

                    <button
                      onClick={goNext}
                      disabled={activeStep === modelSteps.length - 1}
                      className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-primary-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ═══ Footer Quote ═══ */}
          <motion.div
            className="text-center mt-6 lg:mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-ink-secondary/70 italic max-w-xl mx-auto leading-relaxed">
              &ldquo;Each step creates the foundation for the next — and the journey continues as
              empowered women empower their communities.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
