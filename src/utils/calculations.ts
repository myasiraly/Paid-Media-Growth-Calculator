import { FunnelInputs, FunnelOutputs } from '../types';

/**
 * Calculates the complete Paid Media Growth Funnel according to the exact sequence:
 * Monthly ad spend
 * ↓ Expected CPC
 * ↓ Expected traffic (Clicks = Spend / CPC)
 * ↓ Landing-page conversion rate
 * ↓ Leads (Traffic * LP CVR)
 * ↓ Lead qualification rate
 * ↓ Qualified Leads (Leads * Qual Rate)
 * ↓ Sales conversion rate
 * ↓ Customers (Qualified Leads * Sales CVR)
 * ↓ CAC (Ad Spend / Customers)
 * ↓ Revenue (Customers * Deal Size)
 * ↓ ROAS (Revenue / Ad Spend)
 */
export function calculateFunnel(inputs: FunnelInputs): FunnelOutputs {
  const monthlyAdSpend = Math.max(0, inputs.monthlyAdSpend || 0);
  const expectedCpc = Math.max(0.01, inputs.expectedCpc || 0.01);
  const lpCvr = Math.max(0, Math.min(100, inputs.landingPageConversionRate || 0)) / 100;
  const qualRate = Math.max(0, Math.min(100, inputs.leadQualificationRate || 0)) / 100;
  const salesCvr = Math.max(0, Math.min(100, inputs.salesConversionRate || 0)) / 100;
  const averageDealSize = Math.max(0, inputs.averageDealSize || 0);
  const grossMargin = (inputs.grossMarginRate ?? 100) / 100;

  // 1. Expected Traffic (Clicks)
  const expectedTraffic = expectedCpc > 0 ? monthlyAdSpend / expectedCpc : 0;

  // 2. Leads (Form submits, bookings, opt-ins)
  const leads = expectedTraffic * lpCvr;

  // 3. Cost Per Lead (CPL)
  const costPerLead = leads > 0 ? monthlyAdSpend / leads : 0;

  // 4. Qualified Leads (MQLs -> SQLs or Sales Qualified Opportunities)
  const qualifiedLeads = leads * qualRate;

  // 5. Cost Per Qualified Lead (CPQL)
  const costPerQualifiedLead = qualifiedLeads > 0 ? monthlyAdSpend / qualifiedLeads : 0;

  // 6. Customers (Closed Won Deals / New Buyers)
  const customers = qualifiedLeads * salesCvr;

  // 7. Customer Acquisition Cost (CAC)
  const cac = customers > 0 ? monthlyAdSpend / customers : 0;

  // 8. Revenue
  const revenue = customers * averageDealSize;

  // 9. ROAS (Return On Ad Spend)
  const roas = monthlyAdSpend > 0 ? revenue / monthlyAdSpend : 0;
  const roasPercentage = roas * 100;

  // Additional Sales Insights
  const netProfit = (revenue * grossMargin) - monthlyAdSpend;
  const roi = monthlyAdSpend > 0 ? (netProfit / monthlyAdSpend) * 100 : 0;
  const breakEvenCpa = averageDealSize * grossMargin;
  const trafficToCustomerRate = expectedTraffic > 0 ? (customers / expectedTraffic) * 100 : 0;

  return {
    monthlyAdSpend,
    expectedCpc,
    expectedTraffic,
    landingPageConversionRate: inputs.landingPageConversionRate,
    leads,
    costPerLead,
    leadQualificationRate: inputs.leadQualificationRate,
    qualifiedLeads,
    costPerQualifiedLead,
    salesConversionRate: inputs.salesConversionRate,
    customers,
    cac,
    revenue,
    roas,
    roasPercentage,
    netProfit,
    roi,
    breakEvenCpa,
    trafficToCustomerRate,
  };
}

export function formatCurrency(value: number, precision: number = 0): string {
  if (isNaN(value) || !isFinite(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

export function formatNumber(value: number, precision: number = 0): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

export function formatPercent(value: number, precision: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${value.toFixed(precision)}%`;
}

export function formatMultiplier(value: number, precision: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0.00x';
  return `${value.toFixed(precision)}x`;
}

/**
 * Reverse calculate required spend and milestones from a target revenue or customer goal
 */
export function calculateRequiredSpend(
  targetRevenue: number,
  inputs: Omit<FunnelInputs, 'monthlyAdSpend'>
): {
  requiredSpend: number;
  requiredTraffic: number;
  requiredLeads: number;
  requiredQualifiedLeads: number;
  targetCustomers: number;
  expectedRoas: number;
} {
  const dealSize = Math.max(1, inputs.averageDealSize || 1);
  const targetCustomers = targetRevenue / dealSize;
  
  const lpCvr = (inputs.landingPageConversionRate || 1) / 100;
  const qualRate = (inputs.leadQualificationRate || 1) / 100;
  const salesCvr = (inputs.salesConversionRate || 1) / 100;
  const cpc = Math.max(0.01, inputs.expectedCpc || 1);

  // targetCustomers = qualifiedLeads * salesCvr
  const requiredQualifiedLeads = salesCvr > 0 ? targetCustomers / salesCvr : 0;
  // qualifiedLeads = leads * qualRate
  const requiredLeads = qualRate > 0 ? requiredQualifiedLeads / qualRate : 0;
  // leads = traffic * lpCvr
  const requiredTraffic = lpCvr > 0 ? requiredLeads / lpCvr : 0;
  // spend = traffic * cpc
  const requiredSpend = requiredTraffic * cpc;

  const expectedRoas = requiredSpend > 0 ? targetRevenue / requiredSpend : 0;

  return {
    requiredSpend,
    requiredTraffic,
    requiredLeads,
    requiredQualifiedLeads,
    targetCustomers,
    expectedRoas,
  };
}
