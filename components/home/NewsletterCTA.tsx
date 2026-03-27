"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { fadeUpVariant } from "@/lib/animations";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Would connect to email service
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="relative section-gap overflow-hidden">
      {/* Background — rose to forest green gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.4"/>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[600px] px-4 sm:px-6 text-center">
        {/* Sparkle decoration */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
            <path
              d="M20 48C20 48 4 36 4 20C4 11.163 11.163 4 20 4C28.837 4 36 11.163 36 20C36 36 20 48 20 48Z"
              fill="rgba(255,255,255,0.3)"
            />
            <path
              d="M20 48C20 48 4 36 4 20C4 11.163 11.163 4 20 4"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
              fill="none"
            />
            <line x1="20" y1="4" x2="20" y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>

        <motion.h2
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4"
        >
          Get Weekly Beauty Hacks
        </motion.h2>

        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-white/80 mb-8 leading-relaxed"
        >
          Join 50,000+ beauty lovers getting tips every Tuesday
        </motion.p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={20} className="text-white" />
              </div>
              <p className="text-white font-medium">You&apos;re subscribed! Welcome ✨</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 border border-white/40 text-white placeholder:text-white/70 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-white text-primary font-semibold hover:bg-primary-muted transition-colors shrink-0"
              >
                Subscribe Free
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6 mt-6 text-xs text-white/75"
        >
          <span>✓ Free forever</span>
          <span>✓ Unsubscribe anytime</span>
          <span>✓ No spam</span>
        </motion.div>
      </div>
    </section>
  );
}
