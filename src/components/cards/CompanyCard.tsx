'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { ScoredCompany } from '@/types/scorecard';
import { gradeColor, formatNumber } from '@/utils/score-utils';
import ScoreGauge from './ScoreGauge';
import MetricRow from './MetricRow';

export default function CompanyCard({ company, index = 0 }: { company: ScoredCompany; index?: number }) {
  const { score } = company;
  const latest = company.metrics[0];
  const color = gradeColor(score.grade);
  const isUnrated = score.grade === 'NR';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.19, 1, 0.22, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }}
      className="group relative rounded-[20px] bg-white border border-border-subtle spotlight-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-500"
      style={{ willChange: 'transform' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
      />

      <div className="p-6 md:p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-xl font-serif text-text-primary tracking-[-0.02em]">{company.name}</h3>
            {company.parentCompany && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary mt-1.5 block font-medium">
                {company.parentCompany}
              </span>
            )}
          </div>
          {company.sustainabilityReportUrl && (
            <a
              href={company.sustainabilityReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-text-primary transition-colors duration-300 p-1.5 rounded-lg hover:bg-surface-2"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        {/* Score gauge */}
        <div className="flex justify-center mb-5">
          <ScoreGauge score={score.overallScore} grade={score.grade} />
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-text-secondary leading-[1.7] mb-6">
          {company.description}
        </p>

        {/* Metrics */}
        {isUnrated ? (
          <div className="py-8 text-center">
            <p className="text-sm text-text-ghost italic">
              No public environmental data available
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {latest.totalEmissionsMt !== undefined && (
              <MetricRow
                label="Total Emissions"
                value={`${formatNumber(latest.totalEmissionsMt * 1_000_000)}`}
                unit="t CO₂e"
                currentValue={Math.max(0, 100 - (latest.totalEmissionsMt / 70) * 100)}
                maxValue={100}
              />
            )}
            {latest.renewableEnergyPct !== undefined && (
              <MetricRow
                label="Renewable Energy"
                value={`${Math.round(latest.renewableEnergyPct)}%`}
                currentValue={latest.renewableEnergyPct}
              />
            )}
            {latest.dataCenterElectricityTwh !== undefined && (
              <MetricRow
                label="Data Centre Energy"
                value={`${latest.dataCenterElectricityTwh}`}
                unit="TWh"
              />
            )}
            {latest.pue !== undefined && (
              <MetricRow
                label="Power Efficiency (PUE)"
                value={latest.pue.toFixed(2)}
                currentValue={Math.max(0, (1 - (latest.pue - 1.0)) * 100)}
                maxValue={100}
              />
            )}
            {latest.wue !== undefined && (
              <MetricRow
                label="Water Efficiency (WUE)"
                value={`${latest.wue.toFixed(1)}`}
                unit="L/kWh"
                currentValue={Math.max(0, (1 - (latest.wue - 0.5) / 2.5) * 100)}
                maxValue={100}
              />
            )}
            {latest.cdpScore && (
              <MetricRow
                label="CDP Score"
                value={latest.cdpScore}
              />
            )}
            {latest.netZeroTarget && (
              <MetricRow
                label="Net-Zero Target"
                value={latest.netZeroTarget}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
