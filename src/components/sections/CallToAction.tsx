'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

/* Stroke SVG icons */
function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}
function CompressIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  );
}
function SpeakIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  );
}
function CycleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );
}

const actions = [
  {
    n: '01',
    title: 'Choose greener providers',
    body: 'Prefer companies with real sustainability reports, not just pledges. Meta, Microsoft, and Mistral lead on transparency. Avoid companies publishing nothing at all.',
    Icon: LeafIcon,
    accent: '#16A34A',
    bg: 'rgba(22,163,74,0.06)',
  },
  {
    n: '02',
    title: 'Right-size your AI use',
    body: 'Use the smallest model that does the job. Claude Haiku, GPT-4o mini, or Gemini Flash use a fraction of the energy of flagship models — often with comparable results.',
    Icon: CompressIcon,
    accent: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    n: '03',
    title: 'Ask for transparency',
    body: 'Email your AI provider. Ask what their Scope 3 emissions are. Ask for a sustainability report. Collective demand drives corporate behaviour.',
    Icon: SpeakIcon,
    accent: '#CA8A04',
    bg: 'rgba(202,138,4,0.06)',
  },
  {
    n: '04',
    title: 'Offset and reduce together',
    body: "Calculate your team's AI carbon footprint using tools like ML CO₂ Impact. Then reduce first, offset second — not the other way around.",
    Icon: CycleIcon,
    accent: '#9333EA',
    bg: 'rgba(147,51,234,0.06)',
  },
];

const reports = [
  { name: 'Google',       url: 'https://sustainability.google/reports/' },
  { name: 'Microsoft',    url: 'https://www.microsoft.com/en-us/corporate-responsibility/sustainability/report' },
  { name: 'Amazon',       url: 'https://sustainability.aboutamazon.com/' },
  { name: 'Meta',         url: 'https://sustainability.atmeta.com/' },
  { name: 'Apple',        url: 'https://www.apple.com/environment/' },
  { name: 'NVIDIA',       url: 'https://www.nvidia.com/en-us/sustainability/' },
  { name: 'Mistral LCA',  url: 'https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai' },
  { name: 'IEA Energy & AI', url: 'https://www.iea.org/reports/energy-and-ai' },
];

export default function CallToAction() {
  return (
    <section className="bg-surface-0 py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">Take Action</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary">
            What you can do.
          </h2>
          <p className="mt-3 text-[14px] text-text-secondary max-w-md leading-relaxed">
            Individual choices add up. Here's where to start.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {actions.map((a, i) => (
            <motion.div
              key={a.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className="group relative bg-white rounded-2xl p-7 border border-border-subtle shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle tinted background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: a.bg }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: a.accent }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: a.bg, color: a.accent }}
                >
                  <a.Icon />
                </div>

                <p className="text-[11px] font-bold text-text-ghost font-mono mb-1">{a.n}</p>
                <h3 className="text-[17px] font-display font-bold text-text-primary tracking-[-0.02em] mb-3">
                  {a.title}
                </h3>
                <p className="text-[13.5px] text-text-secondary leading-[1.75]">{a.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Source links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[12px] font-semibold text-text-secondary mb-4">Read the source reports</p>
          <div className="flex flex-wrap gap-2">
            {reports.map(r => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border-subtle text-[12px] font-medium text-text-secondary hover:text-earth-green hover:border-earth-green/30 transition-all duration-300"
              >
                {r.name} <ExternalLink size={10} className="opacity-40" />
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
