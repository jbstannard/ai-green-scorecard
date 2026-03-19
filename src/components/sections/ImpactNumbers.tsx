'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ to, duration = 2.2, suffix = '', decimals = 0 }: {
  to: number; duration?: number; suffix?: string; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = eased * to;
      setCount(decimals ? Math.round(val * 10) / 10 : Math.floor(val));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration, decimals]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Inline SVG icons (stroke, no fill) ── */
function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 16" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="18" height="14" rx="2.5"/>
      <path d="M1 4.5l9 5.5 9-5.5"/>
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="9" cy="9" r="7"/>
      <path d="M14.5 14.5L19 19"/>
    </svg>
  );
}
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 19" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 10c0 4.4-3.1 8-7 8H2l2-3.5C2.4 13.2 2 11.6 2 10c0-4.4 3.6-8 8-8s7 3.6 7 8z"/>
    </svg>
  );
}
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M10 1v18M1 10h18M4.1 4.1l11.8 11.8M15.9 4.1L4.1 15.9"/>
    </svg>
  );
}
function ImageGenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 16" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="18" height="14" rx="2.5"/>
      <path d="M1 11l4-4 3 3 3-3 5 5"/>
      <circle cx="14.5" cy="5" r="1.4" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 16" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="13" height="14" rx="2.5"/>
      <path d="M14 5.5l7-3v11l-7-3V5.5z"/>
    </svg>
  );
}

/* ── Country comparison data ── */
const comparisons = [
  { label: 'Switzerland',          twh: 58,   flag: '🇨🇭', type: 'country' },
  { label: 'Argentina',            twh: 135,  flag: '🇦🇷', type: 'country' },
  { label: 'United Kingdom',       twh: 300,  flag: '🇬🇧', type: 'country' },
  { label: 'AI Data Centres 2024', twh: 415,  flag: '🤖',  type: 'ai-now',    highlight: '#16A34A' },
  { label: 'Germany',              twh: 560,  flag: '🇩🇪', type: 'country' },
  { label: 'Japan',                twh: 920,  flag: '🇯🇵', type: 'country' },
  { label: 'AI Data Centres 2030', twh: 945,  flag: '⚠️',  type: 'ai-future', highlight: '#DC2626' },
  { label: 'India',                twh: 1624, flag: '🇮🇳', type: 'country' },
];
const sorted   = [...comparisons].sort((a, b) => a.twh - b.twh);
const maxTwh   = Math.max(...sorted.map(s => s.twh));

/* ── Per-query energy data — log-scaled sizes ── */
type QueryItem = {
  label: string; wh: number; color: string;
  size: number; mobileSize: number; mult: string;
  Icon: React.ComponentType<{ className?: string }>;
};
const queryComparisons: QueryItem[] = [
  { label: 'Send an email',    wh: 0.0035, color: '#22C55E', size: 44,  mobileSize: 38,  mult: 'baseline',      Icon: EmailIcon    },
  { label: 'Google Search',    wh: 0.3,    color: '#84CC16', size: 100, mobileSize: 80,  mult: '85× email',     Icon: SearchIcon   },
  { label: 'ChatGPT query',    wh: 2.9,    color: '#EAB308', size: 136, mobileSize: 108, mult: '829× email',    Icon: ChatIcon     },
  { label: 'GPT-4 query',      wh: 10,     color: '#F97316', size: 156, mobileSize: 124, mult: '2,857× email',  Icon: SparkleIcon  },
  { label: 'AI image gen',     wh: 46,     color: '#EF4444', size: 178, mobileSize: 142, mult: '13,143× email', Icon: ImageGenIcon },
  { label: 'Video generation', wh: 200,    color: '#DC2626', size: 200, mobileSize: 160, mult: '57,143× email', Icon: VideoIcon    },
];

function whLabel(wh: number) {
  if (wh < 0.01)  return `${wh} Wh`;
  if (wh < 1)     return `${wh.toFixed(2)} Wh`;
  if (wh < 10)    return `${wh.toFixed(1)} Wh`;
  return `${Math.round(wh)} Wh`;
}

/* ── Shared circle card component ── */
function EnergyCircle({ item, index, size, animate = true }:
  { item: QueryItem; index: number; size: number; animate?: boolean }) {
  const fsize = Math.round(Math.max(10, Math.min(size * 0.13, 15)));
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col items-center"
    >
      <motion.div
        initial={animate ? { scale: 0.55, opacity: 0 } : false}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ duration: 0.65, delay: index * 0.09 + 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: size, height: size,
          backgroundColor: `${item.color}15`,
          border: `1.5px solid ${item.color}45`,
          color: item.color,
        }}
      >
        <item.Icon className="w-[46%] h-auto" />
      </motion.div>

      <p className="mt-2 font-display font-bold tabular-nums leading-none text-center"
         style={{ color: item.color, fontSize: fsize }}>
        {whLabel(item.wh)}
      </p>
      <p className="mt-1 text-[11px] text-text-secondary font-medium text-center leading-tight">
        {item.label}
      </p>
      <p className="mt-0.5 text-[9px] text-text-ghost text-center">
        {item.mult}
      </p>
    </motion.div>
  );
}

export default function ImpactNumbers() {
  return (
    <section id="impact" className="relative bg-surface-0 pt-24 pb-32 px-6 overflow-hidden">
      {/* Ambient glow — very subtle green tint top-left */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-earth-green/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-400/[0.03] blur-[80px] pointer-events-none" />
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="mb-20 max-w-xl"
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">
            The Scale of the Problem
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary leading-[1.0]">
            The numbers<br />don&apos;t lie.
          </h2>
        </motion.div>

        {/* ── 4 Big stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-subtle mb-24">
          {[
            { value: 415, suffix: '',  unit: 'TWh', label: 'consumed by global data centres in 2024',    sub: 'More than the entire UK uses in a year.',                  color: 'text-earth-green',  hex: '#16A34A' },
            { value: 945, suffix: '',  unit: 'TWh', label: 'projected by 2030 — up 128%',                sub: "Adding Japan's entire electricity grid to the internet.",  color: 'text-amber-600',    hex: '#D97706' },
            { value: 60,  suffix: '%', unit: '',    label: 'of new data centre power from fossil fuels',  sub: 'Despite record clean energy investment.',                 color: 'text-orange-600',   hex: '#EA580C' },
            { value: 169, suffix: '×', unit: '',    label: 'more energy: Claude Opus vs Google Search',   sub: 'One advanced AI query powers a bulb for 10 minutes.',     color: 'text-red-600',      hex: '#DC2626' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className="bg-surface-0 p-10 md:p-12 relative overflow-hidden group hover:bg-surface-1/60 transition-colors duration-500"
            >
              {/* Colour wash on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `linear-gradient(135deg, ${stat.hex}08 0%, transparent 60%)` }} />
              {/* Left accent bar */}
              <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full"
                   style={{ backgroundColor: stat.hex, opacity: 0.5 }} />
              <div className={`text-6xl md:text-7xl lg:text-8xl font-display font-extrabold ${stat.color} leading-none tracking-[-0.04em] tabular-nums`}>
                <CountUp to={stat.value} duration={2.2} suffix={stat.suffix} />
                {stat.unit && (
                  <span className="text-3xl md:text-4xl ml-1.5 align-baseline font-display font-bold">
                    {stat.unit}
                  </span>
                )}
              </div>
              <p className="mt-4 text-[15px] font-semibold text-text-primary/80">{stat.label}</p>
              <p className="mt-2 text-[13px] text-text-tertiary leading-relaxed max-w-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── VISUAL 1: Country energy comparison bars ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="mb-28"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-3">In Context</p>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
                AI vs the world&apos;s electricity grids.
              </h3>
            </div>
            <p className="text-[13px] text-text-tertiary max-w-xs leading-relaxed">
              Annual electricity consumption in terawatt-hours (TWh)
            </p>
          </div>

          <div className="space-y-3">
            {sorted.map((item, i) => {
              const isAi  = item.type === 'ai-now' || item.type === 'ai-future';
              const barColor = (item as { highlight?: string }).highlight ?? '#CBD5E1';
              const pct   = (item.twh / maxTwh) * 100;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                  className="flex items-center gap-3"
                >
                  {/* Label */}
                  <div className="w-28 sm:w-40 md:w-48 flex-shrink-0 flex items-center gap-2 justify-end text-right">
                    <span className={`text-[12px] sm:text-[13px] leading-tight ${isAi ? 'font-semibold text-text-primary' : 'text-text-tertiary'}`}>
                      {item.label}
                    </span>
                    <span className="text-[15px] flex-shrink-0">{item.flag}</span>
                  </div>
                  {/* Bar */}
                  <div className="flex-1 h-[10px] rounded-full bg-surface-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true, margin: '-5%' }}
                      transition={{ duration: 1.0, delay: i * 0.06 + 0.15, ease: [0.19, 1, 0.22, 1] }}
                    />
                  </div>
                  {/* Value */}
                  <div className={`w-16 md:w-20 flex-shrink-0 text-[12px] md:text-[13px] tabular-nums ${isAi ? 'font-bold text-text-primary' : 'text-text-tertiary'}`}>
                    {item.twh.toLocaleString()} TWh
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.6 }}
            className="mt-6 text-[11px] text-text-ghost"
          >
            Sources: IEA Energy and AI Report 2025 · IEA World Energy Statistics 2024
          </motion.p>
        </motion.div>

        {/* ── VISUAL 2: Per-query energy infographic ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-3">Energy Per Query</p>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
                Not all AI is equal.
              </h3>
            </div>
            <p className="text-[13px] text-text-tertiary max-w-xs leading-relaxed">
              How much electricity each request really costs
            </p>
          </div>

          {/*
            Desktop: 6-column grid — circles bottom-aligned via justify-end so
            the dramatic scale difference reads visually like a skyline.
            Mobile:  horizontal scroll with naturally-sized circles.
          */}

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-6 gap-x-4 items-end">
            {queryComparisons.map((item, i) => (
              <div key={item.label} className="flex flex-col items-center justify-end">
                <EnergyCircle item={item} index={i} size={item.size} />
              </div>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden flex items-end gap-5 overflow-x-auto pb-3 -mx-6 px-6 scrollbar-none">
            {queryComparisons.map((item, i) => (
              <div key={item.label} className="flex-shrink-0">
                <EnergyCircle item={item} index={i} size={item.mobileSize} />
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <p className="text-[13px] text-amber-900 leading-relaxed">
              <span className="font-semibold">To put it simply:</span> one ChatGPT query uses about 10× more
              electricity than a Google Search. One AI-generated image uses more energy than leaving a
              lightbulb on for three hours.
            </p>
          </div>

          <p className="mt-4 text-[11px] text-text-ghost">
            Sources: Goldman Sachs Research 2025 · IEA Energy and AI 2025 · Luccioni et al. (2023)
          </p>
        </motion.div>

      </div>
    </section>
  );
}
