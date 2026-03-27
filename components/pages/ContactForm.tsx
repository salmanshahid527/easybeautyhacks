"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Would call your API route or email service
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
          <Check size={28} className="text-secondary" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-foreground">Thank you!</h3>
        <p className="text-foreground-muted">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Select a topic</option>
          <option value="general">General Inquiry</option>
          <option value="collaboration">Collaboration</option>
          <option value="advertising">Advertising</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us what's on your mind..."
          required
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary hover:bg-accent-foreground text-primary-foreground font-semibold transition-all hover:shadow-[var(--shadow-brand)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <span className="animate-pulse">Sending...</span>
        ) : (
          <>
            Send Message <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}
