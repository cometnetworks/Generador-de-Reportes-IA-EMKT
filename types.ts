export interface KPI {
  name: string;
  value: string;
  interpretation: string;
}

export interface ReportData {
  campaignTitle: string;
  summary: string;
  kpis: KPI[];
  positiveInsights: string[];
  areasForImprovement: string[];
  actionableRecommendations: string[];
}
