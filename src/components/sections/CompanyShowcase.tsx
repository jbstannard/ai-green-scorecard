'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { companies } from '@/data/companies';
import { scoreCompany } from '@/data/scoring';
import { gradeColor, formatNumber } from '@/utils/score-utils';
import { ScoredCompany, SortOption, DimensionScores } from '@/types/scorecard';
import ScoreGauge from '@/components/cards/ScoreGauge';

const DIMENSIONS = [
  { key: 'carbon', label: 'Carbon' },
  { key: 'renewable', label: 'Renewables' },
  { key: 'water', label: 'Water' },
  { key: 'pue', label: 'PUE' },
  { key: 'aiReporting', label: 'AI Data' },
  { key: 'transparency', label: 'Transparency' },
];

function GradeBadge({ grade }: { grade: string }) {
  const color = gradeColor(grade as never);
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-[12px] text-[14px] font-bold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {grade === 'NR' ? '?' : grade}
    </span>
  );
}

// Radial dimension spider (SVG hexagon-style)
function DimensionRadar({ scores }: { scores: DimensionScores }) {
  const vals = DIMENSIONS.map(d => Math.min(scores[d.key as keyof DimensionScores] ?? 0, 100) / 100);
  const cx = 56, cy = 56, r = 44;
  const points = vals.map((v, i) => {
    const angle = (i / vals.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r * v, y: cy + Math.sin(angle) * r * v };
  });
  const bg = DIMENSIONS.map((_, i) => {
    const angle = (i / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <svg width={112} height={112} viewBox="0 0 112 112">
      {/* Background grid */}
      <path d={toPath(bg)} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
      <path d={toPath(bg.map(p => ({ x: cx + (p.x - cx) * 0.67, y: cy + (p.y - cy) * 0.67 })))} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={1} />
      <path d={toPath(bg.map(p => ({ x: cx + (p.x - cx) * 0.33, y: cy + (p.y - cy) * 0.33 })))} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={1} />
      {/* Spokes */}
      {bg.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.05)" strokeWidth={1} />)}
      {/* Score area */}
      <path d={toPath(points)} fill="rgba(22,163,74,0.12)" stroke="#16A34A" strokeWidth={1.5} strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#16A34A" />)}
    </svg>
  );
}

function FeaturedCard({ company }: { company: ScoredCompany }) {
  const { score } = company;
  const latest = company.metrics[0];
  const color = gradeColor(score.grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      className="relative rounded-[24px] bg-white border border-border-subtle overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:col-span-2"
    >
      {/* Grade-colored top stripe */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, transparent 0%, ${color} 40%, ${color} 60%, transparent 100%)` }} />

      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
        {/* Left: info */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-earth-green/8 border border-earth-green/15 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-earth-green animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-earth-green font-semibold">Top Rated</span>
          </div>

          <h3 className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-1">{company.name}</h3>
          {company.parentCompany && (
            <p className="text-[11px] uppercase tracking-[0.25em] text-text-ghost mb-5">{company.parentCompany}</p>
          )}
          <p className="text-[14px] text-text-secondary leading-[1.75] max-w-lg mb-7">{company.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {latest.renewableEnergyPct !== undefined && (
              <div className="px-4 py-2 rounded-full bg-earth-green/8 border border-earth-green/20 text-[12px] font-semibold text-earth-green">
                ♻ {Math.round(latest.renewableEnergyPct)}% renewable
              </div>
            )}
            {latest.netZeroTarget && (
              <div className="px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-[12px] font-medium text-text-secondary">
                🎯 Net zero {latest.netZeroTarget}
              </div>
            )}
            {latest.cdpScore && (
              <div className="px-4 py-2 rounded-full bg-surface-2 border border-border-subtle text-[12px] font-medium text-text-secondary">
                📋 CDP {latest.cdpScore}
              </div>
            )}
          </div>

          {/* Dimension bars */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {DIMENSIONS.map(d => {
              const val = score.dimensionScores[d.key as keyof typeof score.dimensionScores];
              const col = val > 70 ? '#16A34A' : val > 40 ? '#CA8A04' : '#DC2626';
              return (
                <div key={d.key}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-text-ghost font-medium">{d.label}</span>
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: col }}>{val}</span>
                  </div>
                  <div className="h-[3px] rounded-full bg-surface-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: col }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: large score gauge + radar */}
        <div className="flex flex-col items-center gap-5">
          <ScoreGauge score={score.overallScore} grade={score.grade} size={160} />
          <DimensionRadar scores={score.dimensionScores} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-ghost text-center">Dimension radar</p>
          {company.sustainabilityReportUrl && (
            <a
              href={company.sustainabilityReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-text-tertiary hover:text-earth-green transition-colors"
            >
              View report <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CompactCard({ company, index }: { company: ScoredCompany; index: number }) {
  const { score } = company;
  const latest = company.metrics[0];
  const color = gradeColor(score.grade);
  const isUnrated = score.grade === 'NR';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } }}
      className="group rounded-[20px] bg-white border border-border-subtle overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-shadow duration-400"
    >
      {/* Grade-colored stripe */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.7 }} />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="text-[18px] font-display font-semibold text-text-primary leading-tight">{company.name}</h3>
            {company.parentCompany && (
              <p className="text-[10px] uppercase tracking-[0.22em] text-text-ghost mt-0.5">{company.parentCompany}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <GradeBadge grade={score.grade} />
            {company.sustainabilityReportUrl && (
              <a href={company.sustainabilityReportUrl} target="_blank" rel="noopener noreferrer"
                className="text-text-ghost hover:text-text-secondary transition-colors p-1">
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Score arc mini */}
        <div className="flex items-center gap-4 mb-4 py-3 border-y border-border-subtle">
          <ScoreGauge score={score.overallScore} grade={score.grade} size={64} />
          <div className="flex-1">
            <p className="text-[12px] text-text-tertiary leading-[1.6] line-clamp-3">{company.description}</p>
          </div>
        </div>

        {!isUnrated ? (
          <div className="space-y-2.5">
            {latest.totalEmissionsMt !== undefined && (
              <MetricBar label="Emissions" value={`${formatNumber(latest.totalEmissionsMt * 1_000_000)}t CO₂e`} fill={Math.max(0, 100 - (latest.totalEmissionsMt / 70) * 100)} />
            )}
            {latest.renewableEnergyPct !== undefined && (
              <MetricBar label="Renewable" value={`${Math.round(latest.renewableEnergyPct)}%`} fill={latest.renewableEnergyPct} />
            )}
            {latest.pue !== undefined && (
              <MetricBar label="PUE" value={latest.pue.toFixed(2)} fill={Math.max(0, (1 - (latest.pue - 1.0)) * 100)} />
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-[22px] mb-1">🔒</p>
            <p className="text-[12px] text-text-ghost">No public data available</p>
            <p className="text-[11px] text-text-ghost/70 mt-1">Zero transparency disclosed</p>
          </div>
        )}

        {/* Dimension dots */}
        <div className="mt-4 pt-3.5 border-t border-border-subtle flex items-center justify-between">
          <div className="flex gap-1.5">
            {DIMENSIONS.map((dim) => {
              const val = score.dimensionScores[dim.key as keyof typeof score.dimensionScores];
              const col = val > 70 ? '#16A34A' : val > 40 ? '#CA8A04' : '#DC2626';
              return (
                <div
                  key={dim.key}
                  className="w-2.5 h-5 rounded-sm"
                  style={{
                    backgroundColor: `${col}25`,
                    border: `1px solid ${col}50`,
                  }}
                  title={`${dim.label}: ${val}`}
                />
              );
            })}
          </div>
          <span className="text-[11px] text-text-ghost tabular-nums font-medium">{score.overallScore}/100</span>
        </div>
      </div>
    </motion.div>
  );
}

function MetricBar({ label, value, fill }: { label: string; value: string; fill: number }) {
  const color = fill > 70 ? '#16A34A' : fill > 40 ? '#CA8A04' : '#EA580C';
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[9px] uppercase tracking-[0.18em] text-text-ghost font-medium">{label}</span>
        <span className="text-[11px] text-text-primary/70 font-medium tabular-nums">{value}</span>
      </div>
      <div className="h-[2px] rounded-full bg-surface-3 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max(fill, 0)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}

export default function CompanyShowcase() {
  const [sortBy, setSortBy] = useState<SortOption>('score');

  const scored = useMemo((): ScoredCompany[] => {
    return companies
      .map(c => ({ ...c, score: scoreCompany(c) }))
      .sort((a, b) => {
        if (sortBy === 'score') {
          if (a.score.grade === 'NR' && b.score.grade !== 'NR') return 1;
          if (b.score.grade === 'NR' && a.score.grade !== 'NR') return -1;
          return b.score.overallScore - a.score.overallScore;
        }
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'emissions') {
          return (a.metrics[0]?.totalEmissionsMt ?? Infinity) - (b.metrics[0]?.totalEmissionsMt ?? Infinity);
        }
        if (sortBy === 'renewable') {
          return (b.metrics[0]?.renewableEnergyPct ?? -1) - (a.metrics[0]?.renewableEnergyPct ?? -1);
        }
        return 0;
      });
  }, [sortBy]);

  const featured = scored[0];
  const rest = scored.slice(1);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'score', label: 'Best Score' },
    { value: 'name', label: 'A–Z' },
    { value: 'emissions', label: 'Lowest Emissions' },
    { value: 'renewable', label: 'Renewable %' },
  ];

  return (
    <section id="scores" className="bg-surface-0 pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-3">The Rankings</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary">Company Scorecards</h2>
            <p className="mt-3 text-[14px] text-text-secondary max-w-md leading-relaxed">
              11 AI companies scored across six environmental dimensions. Missing data means Not Rated.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-1.5 flex-wrap"
          >
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => setSortBy(opt.value)}
                className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all duration-300 ${
                  sortBy === opt.value
                    ? 'bg-text-primary text-white shadow-sm'
                    : 'bg-surface-2 text-text-tertiary hover:text-text-secondary border border-border-subtle'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Featured + grid */}
        <AnimatePresence mode="wait">
          <motion.div key={sortBy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <FeaturedCard company={featured} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {rest.map((c, i) => <CompactCard key={c.id} company={c} index={i} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
