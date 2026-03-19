'use client';

import { motion } from 'framer-motion';
import { DATA_PERIOD, DATA_LAST_UPDATED } from '@/data/companies';

const sources = [
  'Google 2025 Environmental Report',
  'Microsoft 2025 Sustainability Report',
  'Amazon 2024 Sustainability Report',
  'Meta 2025 Sustainability Report',
  'Apple 2025 Environmental Progress Report',
  'NVIDIA FY2025 Sustainability Report',
  'Mistral AI LCA (Carbone 4 / ADEME)',
  'IEA Energy and AI Report 2025',
  'Corporate Climate Responsibility Monitor 2025',
  'Greenpeace AI Supply Chain Report',
  'Nature Sustainability Journal',
  'CDP Climate Change Questionnaire',
  'DitchCarbon / CarbonCredits.com',
];

export default function ScorecardFooter() {
  return (
    <footer className="bg-surface-0 border-t border-border-subtle py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 rounded-[7px] rotate-45 bg-earth-green/10" />
                <div className="absolute inset-[5.5px] rounded-[3.5px] rotate-45 bg-earth-green" />
              </div>
              <span className="font-display font-bold text-[15px] tracking-[-0.03em] text-text-primary">AI Green Scorecard</span>
            </div>
            <p className="text-[12px] text-text-tertiary leading-relaxed max-w-xs">
              An independent editorial analysis of the environmental impact of AI companies. Not affiliated with any rated company.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-ghost font-medium mb-3">Data Sources</p>
            <div className="flex flex-wrap gap-1.5">
              {sources.map(s => (
                <span key={s} className="text-[10px] text-text-ghost px-2.5 py-1 rounded-lg bg-surface-2 border border-border-subtle">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-4 rounded-xl bg-earth-green/5 border border-earth-green/10 flex flex-col md:flex-row items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-earth-green animate-pulse" />
            <span className="text-[12px] text-earth-green/80 font-medium">
              Data current as of <strong className="text-earth-green">{DATA_PERIOD}</strong>
            </span>
          </div>
          <span className="text-[10px] text-text-ghost">Last refresh: {DATA_LAST_UPDATED} · 11 companies scored</span>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-10">
          <p className="text-[10px] text-text-ghost">Methodology is transparent and open to scrutiny. All data sourced from public disclosures.</p>
          <p className="text-[10px] text-text-ghost">Data reflects 2024–2025 sustainability reports where available.</p>
        </div>

        {/* Created by The Conscious Church */}
        <div className="pt-8 border-t border-border-subtle flex flex-col items-center gap-4">
          <a
            href="https://newsletter.theconsciouschurch.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-ghost font-medium">Created by</p>
            <img
              src="/tcc-logo-light.png"
              alt="The Conscious Church"
              className="h-[24px] w-auto opacity-50 group-hover:opacity-90 transition-opacity duration-300"
            />
          </a>
          <p className="text-[10px] text-text-ghost/70 text-center max-w-sm leading-relaxed">
            Exploring the intersection of faith, technology, and the future of the church.
          </p>
        </div>
      </div>
    </footer>
  );
}
