import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="section-lg bg-surface-white border-b border-gray-100">
      <div className="container-site">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail size={36} className="mx-auto text-primary-500 mb-6" />
          <SectionHeading
            label="Stay Updated"
            title="Subscribe to Our Newsletter"
            description="Get the latest updates on our programs, research publications, impact stories, and upcoming events delivered to your inbox."
          />

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input-field flex-1"
                required
              />
              <button
                type="submit"
                className="btn-primary shrink-0"
                disabled={subscribed}
              >
                {subscribed ? (
                  <Check size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-3">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
