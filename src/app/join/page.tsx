'use client';

import { useState } from 'react';
import { CheckCircle2, Send, Users, Heart, Globe } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import ParticleField from '@/components/ParticleField';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const benefits = [
  {
    icon: Users,
    num: '01',
    title: 'LEADERSHIP DEVELOPMENT',
    desc: 'Direct hands-on experience organizing mega projects and leading teams.'
  },
  {
    icon: Heart,
    num: '02',
    title: 'COMMUNITY SERVICE',
    desc: 'Impact 50,000+ lives through literacy, health, and environmental initiatives.'
  },
  {
    icon: Globe,
    num: '03',
    title: 'ROTARY NETWORK',
    desc: 'Connect with Rotarians, District leaders, and youth across District 3142.'
  }
];

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          occupation: formData.occupation,
          motivation: formData.reason
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent text-[#f8fafc]">
      
      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-zinc-800 pb-8 space-y-4 page-hero-glow"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            PROSPECTUS NO. 08
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            MEMBERSHIP APPLICATION
          </span>
        </div>

        <h1 className="font-serif-heading text-5xl sm:text-7xl font-normal text-white">
          Join Rotaract Club of Navi Mumbai
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Be a part of a 45-year legacy of leadership, fellowship, and community service. Submit your membership prospectus application below.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-zinc-800 pb-12"
      >
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.num}
            variants={itemFade}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-6 elevated-card space-y-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37]/25 transition-colors">
                <benefit.icon className="w-5 h-5" />
              </div>
              <span className="text-[#d4af37] font-bold text-xs tracking-wider">{benefit.num}</span>
            </div>
            <h3 className="text-white font-bold text-xs tracking-wider">{benefit.title}</h3>
            <p className="text-zinc-400 font-sans text-xs leading-relaxed">{benefit.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="p-8 sm:p-12 elevated-card relative overflow-hidden"
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 space-y-6 font-sans relative"
          >
            {/* Gold particles for celebration */}
            <ParticleField count={40} />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <CheckCircle2 className="w-16 h-16 text-[#d4af37] mx-auto" />
            </motion.div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-normal text-white">
              Application Received
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Thank you for applying to join RACNM. Our membership team will review your application and contact you via phone/email shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif-heading text-3xl font-normal text-white">
                Membership Interest Prospectus
              </h2>
              <div className="h-px bg-gradient-to-r from-[#d4af37]/40 via-[#d4af37]/20 to-transparent" />
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl"
              >
                {errorMessage}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Yash Sarawgi"
                  className="form-input"
                />
              </div>

              <div className="space-y-2">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. name@example.com"
                  className="form-input"
                />
              </div>

              <div className="space-y-2">
                <label className="form-label">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="form-input"
                />
              </div>

              <div className="space-y-2">
                <label className="form-label">Occupation / College</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g. Student at SIES College / Software Engineer"
                  className="form-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="form-label">Why do you want to join Rotaract Club of Navi Mumbai?</label>
              <textarea
                rows={4}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Tell us briefly about your interests, skills, or why you'd like to get involved..."
                className="form-input resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-editorial-primary w-full justify-center py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Membership Application'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>

    </div>
  );
}
