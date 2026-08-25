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
