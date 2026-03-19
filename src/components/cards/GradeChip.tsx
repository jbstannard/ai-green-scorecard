'use client';

import { Grade } from '@/types/scorecard';
import { gradeColor, gradeLabel } from '@/utils/score-utils';

export default function GradeChip({ grade }: { grade: Grade }) {
  const color = gradeColor(grade);
  const isUnrated = grade === 'NR';

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="font-bold">{isUnrated ? '?' : grade}</span>
      <span className="opacity-70">{gradeLabel(grade)}</span>
    </div>
  );
}
