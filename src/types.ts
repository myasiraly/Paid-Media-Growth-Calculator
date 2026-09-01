export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  cpcIndex: number; // 1.0 = US baseline
  cvrMultiplier?: number; // regional conversion multiplier default 1.0
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Middle East' | 'Latin America' | 'Global';
  marketTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  typicalCpcRange: string;
  description: string;
}

export type PlatformId = 'google' | 'meta' | 'linkedin' | 'twitter' | 'snapchat' | 'tiktok';

export interface AdPlatform {
  id: PlatformId;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  brandColor: string;
  bgLight: string;
  borderLight: string;
  audienceIntent: 'High Active Search' | 'Visual Social Discovery' | 'B2B Professional ICP' | 'Real-Time / Tech Conversation' | 'Gen Z & Millennial AR/Video' | 'Viral UGC & Creator Video';
  benchmarks: {
    cpc: { low: number; avg: number; high: number };
    cpm: { low: number; avg: number; high: number };
    ctr: { low: number; avg: number; high: number };
    lpCvr: { low: number; avg: number; high: number };
    leadQualRate: { low: number; avg: number; high: number };
    salesCloseRate: { low: number; avg: number; high: number };
    typicalRoas: { low: number; avg: number; high: number };
  };
  recommendedDefaults: {
    expectedCpc: number;
    landingPageConversionRate: number;
    leadQualificationRate: number;
    salesConversionRate: number;
  };
  keyFormats: string[];
  bestSuitedFor: string[];
  keyTactics: string[];
  pros: string[];
  watchOuts: string[];
}

export interface FunnelInputs {
  monthlyAdSpend: number; // e.g. $10,000
  expectedCpc: number; // e.g. $3.50
  landingPageConversionRate: number; // e.g. 8.5%
  leadQualificationRate: number; // e.g. 45% (MQL to SQL)
  salesConversionRate: number; // e.g. 20% (SQL to Closed Won)
  averageDealSize: number; // e.g. $3,500 (ACV or first-purchase/LTV)
  grossMarginRate?: number; // optional % e.g. 80% (default 100% for revenue calculation, but useful for net profit)
  clientName?: string;
  industry?: string;
  channel?: string;
  platformId?: PlatformId; // 'google' | 'meta' | 'linkedin' | 'twitter' | 'snapchat' | 'tiktok'
  countryCode?: string; // e.g. 'US', 'GB', 'CA', 'AU', 'DE', etc.
  targetGoalType?: 'revenue' | 'customers'; // 'revenue' | 'customers'
  targetGoalValue?: number; // e.g. 30000 ($30k revenue) or 10 (10 clients)
}

export interface FunnelOutputs {
  monthlyAdSpend: number;
  expectedCpc: number;
  expectedTraffic: number; // clicks
  landingPageConversionRate: number;
  leads: number; // raw leads
  costPerLead: number; // CPL
  leadQualificationRate: number;
  qualifiedLeads: number; // SQLs
  costPerQualifiedLead: number; // CPQL
  salesConversionRate: number;
  customers: number; // closed deals
  cac: number; // Customer Acquisition Cost
  revenue: number; // Gross Revenue
  roas: number; // ROAS multiplier (e.g. 3.5x)
  roasPercentage: number; // ROAS as % (e.g. 350%)
  netProfit: number; // Revenue - Spend (or with margin)
  roi: number; // (Net Profit / Spend) * 100
  breakEvenCpa: number; // Maximum CAC to break even on deal size
  trafficToCustomerRate: number; // Overall funnel efficiency %
}

export interface IndustryBenchmark {
  id: string;
  name: string;
  category: string;
  description: string;
  defaults: FunnelInputs;
  benchmarks: {
    cpc: { low: number; avg: number; high: number };
    lpCvr: { low: number; avg: number; high: number };
    leadQualRate: { low: number; avg: number; high: number };
    salesCloseRate: { low: number; avg: number; high: number };
    typicalRoas: { low: number; avg: number; high: number };
  };
  tips: string[];
}

export interface ScenarioItem {
  id: string;
  name: string;
  color: string;
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
}

export interface GoalSeekTarget {
  targetType: 'revenue' | 'customers' | 'roas';
  targetValue: number;
}
