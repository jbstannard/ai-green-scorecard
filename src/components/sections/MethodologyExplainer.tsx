'use client';

import { motion } from 'framer-motion';
import { gradeColor } from '@/utils/score-utils';
import type { Grade } from '@/types/scorecard';

const grades: { grade: Grade; range: string; label: string }[] = [
  { grade: 'A+', range: '90–100', label: 'Exemplary' },
  { grade: 'A',  range: '80–89',  label: 'Strong' },
  { grade: 'B+', range: '70–79',  label: 'Good' },
  { grade: 'B',  range: '60–69',  label: 'Average' },
  { grade: 'C',  range: '50–59',  label: 'Below avg.' },
  { grade: 'D',  range: '40–49',  label: 'Poor' },
  { grade: 'F',  range: '0–39',   label: 'Failing' },
];

const dimensions = [
  { name: 'Carbon Emissions',      weight: 25, desc: 'Scope 1/2/3 reporting & year-over-year reduction' },
  { name: 'Renewable Energy',       weight: 20, desc: 'Verified renewable percentage of operations' },
  { name: 'AI-Specific Reporting',  weight: 20, desc: 'Per-query energy/CO₂, AI/ML workloads disclosed' },
  { name: 'Water Usage',            weight: 15, desc: 'WUE score, lifecycle water accounting' },
  { name: 'Power Efficiency',       weight: 10, desc: 'PUE — compute delivered per unit of power drawn' },
  { name: 'Transparency',           weight: 10, desc: 'CDP, third-party audits, reporting regularity' },
];

export default function MethodologyExplainer() {
  return (
    <section id="methodology" className="bg-surface-2/50 py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — grade scale */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">How We Score</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-10">Methodology</h2>

            <div className="space-y-2">
              {grades.map(({ grade, range, label }, i) => {
                const color = gradeColor(grade);
                return (
                  <motion.div
                    key={grade}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="flex items-center gap-4 py-2.5 px-4 rounded-xl hover:bg-white transition-colors duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >{grade}</div>
                    <div className="flex-1">
                      <div className="h-[6px] rounded-full overflow-hidden bg-surface-3">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(7 - i) / 7 * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                        />
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-text-secondary w-14 shrink-0">{range}</span>
                    <span className="text-[11px] text-text-tertiary w-20 shrink-0">{label}</span>
                  </motion.div>
                );
              })}
              <div className="flex items-center gap-4 py-2.5 px-4 rounded-xl hover:bg-white transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold text-white/70 bg-text-ghost shrink-0">?</div>
                <div className="flex-1 h-[6px] rounded-full bg-surface-3" />
                <span className="text-[12px] font-medium text-text-secondary w-14 shrink-0">—</span>
                <span className="text-[11px] text-text-tertiary w-20 shrink-0">No data</span>
              </div>
            </div>
          </motion.div>

          {/* Right — dimensions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="lg:pt-20"
          >
            <p className="text-[13px] font-semibold text-text-primary mb-6">6 scoring dimensions</p>
            <div className="space-y-5">
              {dimensions.map((dim, i) => (
                <motion.div
                  key={dim.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  {/* Weight donut */}
                  <div className="shrink-0 w-12 h-12 relative">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
                      <circle cx="24" cy="24" r="19" fill="none" stroke="#16A34A" strokeWidth="5"
                        strokeDasharray={`${2 * Math.PI * 19 * dim.weight / 100} ${2 * Math.PI * 19}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-primary">
                      {dim.weight}%
                    </span>
                  </div>
                  <div className="pt-1">
                    <p className="text-[14px] font-semibold text-text-primary">{dim.name}</p>
                    <p className="text-[12px] text-text-tertiary mt-0.5 leading-relaxed">{dim.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
