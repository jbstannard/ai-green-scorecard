import { Grade, DimensionScores } from '@/types/scorecard';

export function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function gradeColor(grade: Grade): string {
  const colors: Record<Grade, string> = {
    'A+': '#16A34A',
    'A': '#22C55E',
    'B+': '#4ADE80',
    'B': '#CA8A04',
    'C': '#D97706',
    'D': '#EA580C',
    'F': '#DC2626',
    'NR': '#A3A29C',
  };
  return colors[grade];
}

export function gradeLabel(grade: Grade): string {
  const labels: Record<Grade, string> = {
    'A+': 'Exemplary',
    'A': 'Strong commitment',
    'B+': 'Good progress',
    'B': 'Average',
    'C': 'Below average',
    'D': 'Poor',
    'F': 'Failing',
    'NR': 'Not Rated',
  };
  return labels[grade];
}

export function computeOverallScore(dimensions: DimensionScores): number {
  const weights = {
    carbon:      0.25,  // absolute footprint — most important
    renewable:   0.20,  // energy sourcing
    water:       0.15,  // water stewardship
    pue:         0.10,  // infrastructure efficiency (facility-level; less relevant for pure-play AI)
    aiReporting: 0.20,  // AI-specific disclosure — core purpose of this scorecard
    transparency: 0.10, // public accountability
  };

  return Math.round(
    dimensions.carbon * weights.carbon +
    dimensions.renewable * weights.renewable +
    dimensions.water * weights.water +
    dimensions.pue * weights.pue +
    dimensions.aiReporting * weights.aiReporting +
    dimensions.transparency * weights.transparency
  );
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(1);
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`;
}
