export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentCompany?: string;
  headquarters: string;
  sustainabilityReportUrl?: string;
  websiteUrl: string;
  metrics: AnnualMetrics[];
}

export interface AnnualMetrics {
  year: number;
  scope1EmissionsMt?: number;
  scope2EmissionsMt?: number;
  scope3EmissionsMt?: number;
  totalEmissionsMt?: number;
  renewableEnergyPct?: number;
  pue?: number;
  wue?: number;
  waterUsageMegaliters?: number;
  aiSpecificReporting: boolean;
  cdpScore?: string;
  dataCenterElectricityTwh?: number;
  perQueryEnergyWh?: number;
  perQueryCo2Grams?: number;
  netZeroTarget?: string;
  nuclearDeals?: string;
  carbonRemovalMt?: number;
  greenpeaceGrade?: string;
  dataSourceUrl: string;
}

export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' | 'NR';

export type Trend = 'improving' | 'declining' | 'stable' | 'unknown';

export interface DimensionScores {
  carbon: number;
  renewable: number;
  water: number;
  pue: number;
  aiReporting: number;
  transparency: number;
}

export interface CompanyScore {
  companyId: string;
  overallScore: number;
  grade: Grade;
  dimensionScores: DimensionScores;
  trend: Trend;
}

export interface ScoredCompany extends Company {
  score: CompanyScore;
}

export type SortOption = 'score' | 'name' | 'emissions' | 'renewable';
export type FilterGrade = Grade | 'all';
