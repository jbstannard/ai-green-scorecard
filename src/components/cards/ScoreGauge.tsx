'use client';

import { motion } from 'framer-motion';
import { Grade } from '@/types/scorecard';
import { gradeColor } from '@/utils/score-utils';

export default function ScoreGauge({ score, grade, size = 112 }: { score: number; grade: Grade; size?: number }) {
  const color = gradeColor(grade);
  const isNR = grade === 'NR';
  const sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const filled = isNR ? 0 : arc * (score / 100);
  const cx = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(17,17,16,0.07)" strokeWidth={sw}
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" transform={`rotate(135 ${cx} ${cx})`} />
        <motion.circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" transform={`rotate(135 ${cx} ${cx})`}
          initial={{ strokeDashoffset: arc }}
          whileInView={{ strokeDashoffset: arc - filled }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-display font-bold" style={{ color }}>{isNR ? '?' : grade}</span>
        {!isNR && <span className="text-[10px] text-text-tertiary tabular-nums font-medium mt-0.5">{score}/100</span>}
      </div>
    </div>
  );
}
