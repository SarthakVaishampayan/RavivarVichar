import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 300, mass: 0.8 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function TeamMemberModal({ member, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!member) return;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [member, handleKeyDown]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            key="team-member-modal"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            variants={modalVariants}
            role="dialog"
            aria-modal="true"
            aria-label={`${member.name} — ${member.role}`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 group"
              aria-label="Close"
            >
              <X size={16} className="text-gray-500 group-hover:text-gray-800 transition-colors" />
            </button>

            {/* ─── Content ─── */}
            <div className="p-6 lg:p-8">
              {/* Name */}
              <h2 className="text-2xl lg:text-3xl font-bold font-heading text-ink-primary">
                {member.name}
              </h2>

              {/* Role badge */}
              <span className="inline-block mt-3 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100/60">
                {member.role}
              </span>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-gray-200 to-transparent" />

              {/* Bio */}
              <div className="space-y-4 text-body text-ink-secondary leading-relaxed">
                {(member.fullBio || member.bio).split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Decorative bottom accent */}
              <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
