'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricRowProps {
  label: string;
  value: string;
  maxValue?: number;
  currentValue?: number;
  trend?: 'up' | 'down' | 'stable';
  trendIsGood?: boolean;
  unit?: string;
}

export default function MetricRow({
  label,
  value,
  maxValue = 100,
  currentValue,
  trend,
  trendIsGood,
  unit,
}: MetricRowProps) {
  const fillPercent = currentValue !== undefined ? Math.min(100, (currentValue / maxValue) * 100) : 0;

  const barColor =
    fillPercent > 70 ? '#16A34A' : fillPercent > 40 ? '#CA8A04' : '#EA580C';

  return (
    <div className="group/row py-1.5">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary font-medium truncate">
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <span className="text-[13px] text-text-primary/80 font-medium tabular-nums">
            {value}
            {unit && <span className="text-text-tertiary ml-0.5 text-[11px]">{unit}</span>}
          </span>
          {trend && (
            <span className={trendIsGood ? 'text-score-excellent' : 'text-score-failing'}>
              {trend === 'up' && <TrendingUp size={10} />}
              {trend === 'down' && <TrendingDown size={10} />}
              {trend === 'stable' && <Minus size={10} className="text-text-tertiary" />}
            </span>
          )}
        </div>
      </div>
      {currentValue !== undefined && (
        <div className="h-[3px] rounded-full bg-surface-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            whileInView={{ width: `${fillPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
          />
        </div>
      )}
    </div>
  );
}
