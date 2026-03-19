import { Company, CompanyScore, DimensionScores, Trend } from '@/types/scorecard';
import { scoreToGrade, computeOverallScore } from '@/utils/score-utils';

// Helper: does this company have a full third-party verified LCA?
// True when aiSpecificReporting is set and a sustainability report URL exists.
function hasFullLCA(company: Company): boolean {
  const latest = company.metrics[0];
  return !!(latest?.aiSpecificReporting && company.sustainabilityReportUrl);
}

function scoreCarbonDimension(company: Company): number {
  const latest = company.metrics[0];
  if (!latest) return 0;

  let score = 0;

  // Transparency: reporting any emissions data
  if (latest.totalEmissionsMt !== undefined) score += 30;
  if (
    latest.scope1EmissionsMt !== undefined &&
    latest.scope2EmissionsMt !== undefined &&
    latest.scope3EmissionsMt !== undefined
  ) score += 20;

  // Reward AI-specific per-query carbon reporting (requires detailed measurement)
  if (latest.perQueryCo2Grams !== undefined) score += 10;

  // Lower total emissions is better.
  // Normalise against 50 Mt (industry high). Very small companies (e.g. Mistral at 0.02 Mt)
  // score near-maximum here — which is correct: their footprint is genuinely tiny.
  if (latest.totalEmissionsMt !== undefined) {
    // Normalized against a 50 Mt ceiling (industry high-water mark).
    // Mistral at 0.02 Mt scores near-maximum here — correct.
    // Per-query bonus above is additive; the Math.min(100,...) cap handles overflow.
    const normalized = Math.max(0, 1 - latest.totalEmissionsMt / 50);
    score += normalized * 50;
  }

  return Math.min(100, Math.round(score));
}

function scoreRenewableDimension(company: Company): number {
  const latest = company.metrics[0];
  if (!latest) return 0;

  // Explicit % reported — use it directly
  if (latest.renewableEnergyPct !== undefined) {
    return Math.round(latest.renewableEnergyPct);
  }

  // Companies with a full third-party verified LCA have disclosed their energy mix
  // in that report. Penalise slightly for not providing a standalone figure,
  // but do NOT zero-score a company whose LCA covers energy sourcing in detail.
  if (hasFullLCA(company)) return 40;

  return 0;
}

function scoreWaterDimension(company: Company): number {
  const latest = company.metrics[0];
  if (!latest) return 0;

  let score = 0;

  if (latest.wue !== undefined) {
    // WUE scoring: lower is better. Excellent ≤ 0.5, poor ≥ 3.0
    const normalized = Math.max(0, 1 - (latest.wue - 0.5) / 2.5);
    score += normalized * 60;
    score += 20; // explicit WUE reporting bonus
  } else if (latest.aiSpecificReporting && latest.waterUsageMegaliters !== undefined) {
    // A peer-reviewed LCA (e.g. ADEME/Carbone 4) with per-query water data is at
    // least as rigorous as a standalone WUE figure — it captures embodied water in
    // hardware that WUE misses entirely. Score accordingly.
    score += 55;
  }

  // Credit for reporting absolute water usage
  if (latest.waterUsageMegaliters !== undefined) score += 20;

  return Math.min(100, Math.round(score));
}

function scorePueDimension(company: Company): number {
  const latest = company.metrics[0];
  if (!latest) return 0;

  if (latest.pue !== undefined) {
    // PUE: 1.0 = perfect, 2.0 = poor
    const normalized = Math.max(0, 1 - (latest.pue - 1.0));
    return Math.min(100, Math.round(normalized * 100));
  }

  // A peer-reviewed LCA (e.g. ADEME/Carbone 4) necessarily incorporates full
  // energy efficiency analysis in its calculations. Not disclosing a standalone
  // PUE figure is a minor gap; the underlying data is far more comprehensive.
  if (hasFullLCA(company)) return 50;

  return 0;
}

function scoreAiReportingDimension(company: Company): number {
  const latest = company.metrics[0];
  if (!latest) return 0;

  let score = 0;

  if (latest.aiSpecificReporting) score += 60;

  // Bonus for per-query granularity — the most useful signal for end users
  if (latest.perQueryCo2Grams !== undefined || latest.perQueryEnergyWh !== undefined) score += 20;

  // Any general emissions reporting
  if (latest.totalEmissionsMt !== undefined) score += 20;

  return Math.min(100, score);
}

function scoreTransparencyDimension(company: Company): number {
  const latest = company.metrics[0];
  if (!latest) return 0;

  let score = 0;

  // CDP Score — widely recognised third-party disclosure framework
  if (latest.cdpScore) {
    const cdpScores: Record<string, number> = {
      'A': 40, 'A-': 35, 'B': 25, 'B-': 20, 'C': 15, 'C-': 10, 'D': 5, 'D-': 2,
    };
    score += cdpScores[latest.cdpScore] ?? 0;
  } else if (hasFullLCA(company)) {
    // A peer-reviewed lifecycle analysis (e.g. with ADEME/Carbone 4) is a rigorous
    // third-party verified disclosure — equivalent to CDP A- level transparency.
    // Only triggered when no CDP score is on record.
    score += 35;
  }

  // Has a public sustainability / LCA report
  if (company.sustainabilityReportUrl) score += 25;

  // Granular data points disclosed
  if (latest.totalEmissionsMt !== undefined) score += 15;
  if (latest.renewableEnergyPct !== undefined) score += 15;
  if (latest.perQueryCo2Grams !== undefined || latest.perQueryEnergyWh !== undefined) score += 5;

  return Math.min(100, score);
}

function determineTrend(company: Company): Trend {
  if (company.metrics.length < 2) return 'unknown';

  const latest = company.metrics[0];
  const previous = company.metrics[1];

  if (!latest.totalEmissionsMt || !previous.totalEmissionsMt) return 'unknown';

  const change =
    (latest.totalEmissionsMt - previous.totalEmissionsMt) / previous.totalEmissionsMt;

  if (change < -0.05) return 'improving';
  if (change > 0.05) return 'declining';
  return 'stable';
}

export function scoreCompany(company: Company): CompanyScore {
  const latest = company.metrics[0];

  // Not Rated if no self-disclosed operational data.
  // perQueryEnergyWh on Anthropic/OpenAI are third-party estimates — not enough.
  // perQueryCo2Grams counts because Mistral self-reported it in their ADEME LCA.
  const hasAnyData =
    latest &&
    (latest.totalEmissionsMt !== undefined ||
      latest.renewableEnergyPct !== undefined ||
      latest.pue !== undefined ||
      latest.perQueryCo2Grams !== undefined);

  if (!hasAnyData) {
    return {
      companyId: company.id,
      overallScore: 0,
      grade: 'NR',
      dimensionScores: {
        carbon: 0,
        renewable: 0,
        water: 0,
        pue: 0,
        aiReporting: 0,
        transparency: 0,
      },
      trend: 'unknown',
    };
  }

  const dimensionScores: DimensionScores = {
    carbon: scoreCarbonDimension(company),
    renewable: scoreRenewableDimension(company),
    water: scoreWaterDimension(company),
    pue: scorePueDimension(company),
    aiReporting: scoreAiReportingDimension(company),
    transparency: scoreTransparencyDimension(company),
  };

  const overallScore = computeOverallScore(dimensionScores);

  return {
    companyId: company.id,
    overallScore,
    grade: scoreToGrade(overallScore),
    dimensionScores,
    trend: determineTrend(company),
  };
}
