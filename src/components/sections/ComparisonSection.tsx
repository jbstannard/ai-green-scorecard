'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { companies } from '@/data/companies';
import { scoreCompany } from '@/data/scoring';
import { gradeColor } from '@/utils/score-utils';

const queryCosts = [
  { label: 'Claude 3 Opus',   energy: 4.05, co2: 1.80, color: '#DC2626', icon: '🔴' },
  { label: 'Mistral Large 2', energy: 2.85, co2: 1.14, color: '#EA580C', icon: '🟠' },
  { label: 'GPT-4o',          energy: 0.30, co2: 0.13, color: '#CA8A04', icon: '🟡' },
  { label: 'Gemini',          energy: 0.24, co2: 0.10, color: '#4ADE80', icon: '🟢' },
  { label: 'Claude Haiku',    energy: 0.22, co2: 0.09, color: '#22C55E', icon: '🟢' },
  { label: 'Google Search',   energy: 0.024,co2: 0.01, color: '#16A34A', icon: '🟢' },
];

export default function ComparisonSection() {
  const scored = useMemo(() =>
    companies
      .map(c => ({ ...c, score: scoreCompany(c) }))
      .filter(c => c.score.grade !== 'NR')
      .sort((a, b) => b.score.overallScore - a.score.overallScore),
  []);
  const max = Math.max(...scored.map(c => c.score.overallScore));

  return (
    <section id="compare" className="bg-surface-0 py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Ranking chart */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-28 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">At a Glance</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">How they compare</h2>
            <p className="text-[14px] text-text-secondary leading-[1.75]">
              Scored across six environmental dimensions. The gap between leaders and laggards is significant.
            </p>
          </motion.div>

          <div className="space-y-2">
            {scored.map((c, i) => {
              const color = gradeColor(c.score.grade);
              const pct = (c.score.overallScore / max) * 100;
              return (
                <motion.div key={c.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                  className="flex items-center gap-4 group"
                >
                  <span className="text-[13px] font-medium text-text-secondary w-24 shrink-0 text-right group-hover:text-text-primary transition-colors">{c.name}</span>
                  <div className="flex-1 h-10 bg-surface-2 rounded-xl overflow-hidden border border-border-subtle">
                    <motion.div
                      className="h-full rounded-xl flex items-center pl-4"
                      style={{ backgroundColor: `${color}14` }}
                      initial={{ width: '0%' }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <span className="text-[12px] font-bold whitespace-nowrap" style={{ color }}>
                        {c.score.grade} · {c.score.overallScore}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Energy per query — visual infographic */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">The Hidden Cost</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">Energy per query</h2>
            <p className="text-[14px] text-text-secondary max-w-lg mx-auto leading-relaxed">
              A single Claude 3 Opus query uses 169× the energy of a Google search. Model choice is a genuine environmental decision.
            </p>
          </motion.div>

          {/* Visual bubble comparison */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {queryCosts.map((item, i) => {
              const maxE = 4.05;
              const size = Math.max(56, (item.energy / maxE) * 140);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center justify-center"
                    style={{ width: 120, height: 120 }}>
                    <motion.div
                      className="rounded-full flex flex-col items-center justify-center"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: `${item.color}14`,
                        border: `2px solid ${item.color}30`,
                      }}
                    >
                      <span className="font-bold text-[13px]" style={{ color: item.color }}>
                        {item.energy >= 1 ? `${item.energy}` : item.energy >= 0.1 ? `${item.energy}` : `${item.energy}`}
                      </span>
                      <span className="text-[9px] text-text-tertiary">Wh</span>
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-semibold text-text-primary leading-tight">{item.label}</p>
                    <p className="text-[11px] text-text-tertiary">{item.co2}g CO₂</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] text-text-ghost italic"
          >
            Sources: CarbonCredits.com · Sustainability Magazine · Mistral AI LCA (Carbone 4/ADEME). Estimates vary by prompt length.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
