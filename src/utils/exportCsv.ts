import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';
import { AD_PLATFORMS, getPlatform, calculatePlatformFunnel } from '../data/platforms';
import { formatCurrency, formatNumber, formatPercent, formatMultiplier } from './calculations';

/**
 * Escapes CSV cell content
 */
function escapeCsv(cell: string | number | null | undefined): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports the current funnel model and calculations as a formatted CSV file
 */
export function exportFunnelToCsv(
  inputs: FunnelInputs,
  outputs: FunnelOutputs
): void {
  const country = getCountry(inputs.countryCode || 'US');
  const platform = inputs.platformId ? getPlatform(inputs.platformId) : null;
  const clientName = inputs.clientName ? inputs.clientName.trim() : 'Prospective Client';
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const rows: string[][] = [
    // Header & Metadata
    ['PAID MEDIA GROWTH FUNNEL & CLIENT SALES REPORT'],
    ['Generated On', timestamp],
    ['Client / Prospect Name', clientName],
    ['Ad Platform / Primary Channel', platform ? `${platform.name} (${platform.audienceIntent})` : 'Custom / Multi-Channel'],
    ['Target Market / Country', `${country.name} (${country.code})`],
    ['Currency', `${country.currency} (${country.currencySymbol})`],
    ['Industry Vertical', inputs.industry || 'General'],
    [''],

    // Executive Summary
    ['EXECUTIVE SUMMARY & UNIT ECONOMICS'],
    ['Metric Category', 'Metric Name', 'Value (Formatted)', 'Raw Numeric Value', 'Unit / Details'],
    [
      'Top of Funnel',
      'Monthly Ad Spend',
      formatCurrency(inputs.monthlyAdSpend, 0, country.currency, country.locale),
      inputs.monthlyAdSpend.toString(),
      country.currency
    ],
    [
      'Top of Funnel',
      'Cost Per Click (CPC)',
      formatCurrency(inputs.expectedCpc, 2, country.currency, country.locale),
      inputs.expectedCpc.toFixed(2),
      `${country.currency} / click`
    ],
    [
      'Top of Funnel',
      'Projected Traffic (Clicks)',
      formatNumber(outputs.expectedTraffic, 0),
      outputs.expectedTraffic.toFixed(1),
      'Visitors / month'
    ],
    [
      'Middle of Funnel',
      'Landing Page Conversion Rate (CVR)',
      formatPercent(inputs.landingPageConversionRate, 2),
      inputs.landingPageConversionRate.toString(),
      '%'
    ],
    [
      'Middle of Funnel',
      'Projected Total Leads',
      formatNumber(outputs.leads, 1),
      outputs.leads.toFixed(2),
      'Form fills / inquiries'
    ],
    [
      'Middle of Funnel',
      'Cost Per Lead (CPL)',
      formatCurrency(outputs.costPerLead, 2, country.currency, country.locale),
      outputs.costPerLead.toFixed(2),
      `${country.currency} / raw lead`
    ],
    [
      'Middle of Funnel',
      'Lead Qualification Rate (MQL to SQL)',
      formatPercent(inputs.leadQualificationRate, 2),
      inputs.leadQualificationRate.toString(),
      '%'
    ],
    [
      'Middle of Funnel',
      'Projected Qualified Opportunities (SQL)',
      formatNumber(outputs.qualifiedLeads, 1),
      outputs.qualifiedLeads.toFixed(2),
      'Discovery / Demo calls'
    ],
    [
      'Middle of Funnel',
      'Cost Per Qualified Lead (CPQL)',
      formatCurrency(outputs.costPerQualifiedLead, 2, country.currency, country.locale),
      outputs.costPerQualifiedLead.toFixed(2),
      `${country.currency} / SQL`
    ],
    [
      'Bottom of Funnel',
      'Sales Closing Rate',
      formatPercent(inputs.salesConversionRate, 2),
      inputs.salesConversionRate.toString(),
      '%'
    ],
    [
      'Bottom of Funnel',
      'Projected Closed Customers / Deals',
      formatNumber(outputs.customers, 1),
      outputs.customers.toFixed(2),
      'New clients / month'
    ],
    [
      'Bottom of Funnel',
      'Customer Acquisition Cost (CAC)',
      formatCurrency(outputs.cac, 0, country.currency, country.locale),
      outputs.cac.toFixed(2),
      `${country.currency} / new customer`
    ],
    [
      'Financial Returns',
      'Average Deal Size / ACV',
      formatCurrency(inputs.averageDealSize, 0, country.currency, country.locale),
      inputs.averageDealSize.toString(),
      `${country.currency} / deal`
    ],
    [
      'Financial Returns',
      'Gross Monthly Revenue',
      formatCurrency(outputs.revenue, 0, country.currency, country.locale),
      outputs.revenue.toFixed(2),
      country.currency
    ],
    [
      'Financial Returns',
      'Gross Margin Rate',
      formatPercent(inputs.grossMarginRate ?? 100, 1),
      (inputs.grossMarginRate ?? 100).toString(),
      '%'
    ],
    [
      'Financial Returns',
      'Net Ad Profit',
      formatCurrency(outputs.netProfit, 0, country.currency, country.locale),
      outputs.netProfit.toFixed(2),
      country.currency
    ],
    [
      'Financial Returns',
      'ROAS Multiple',
      formatMultiplier(outputs.roas, 2),
      outputs.roas.toFixed(2),
      'x ad spend'
    ],
    [
      'Financial Returns',
      'ROAS Percentage',
      `${outputs.roasPercentage.toFixed(0)}%`,
      outputs.roasPercentage.toFixed(1),
      '%'
    ],
    [
      'Financial Returns',
      'Return on Investment (ROI)',
      `${outputs.roi.toFixed(1)}%`,
      outputs.roi.toFixed(2),
      '%'
    ],
    [
      'Financial Returns',
      'Traffic to Customer Rate',
      formatPercent(outputs.trafficToCustomerRate, 3),
      outputs.trafficToCustomerRate.toFixed(4),
      'Total Funnel %'
    ],
    [''],

    // Multi-Ad-Network Comparison Matrix
    ['6-AD-NETWORK AUTHENTIC ESTIMATION MATRIX'],
    [
      'Ad Network / Platform',
      'Audience Intent & Type',
      `Est. CPC (${country.currency})`,
      'Est. Monthly Clicks',
      'Est. Raw Leads',
      'Est. Qualified Calls',
      'Est. Closed Deals',
      `CAC (${country.currency})`,
      `Gross Revenue (${country.currency})`,
      'ROAS Multiple',
      `Net Profit (${country.currency})`
    ]
  ];

  // Add all 6 ad platform benchmarks
  AD_PLATFORMS.forEach((plat) => {
    const platResult = calculatePlatformFunnel(plat, inputs, country);
    const pOut = platResult.outputs;
    rows.push([
      plat.name,
      plat.audienceIntent,
      formatCurrency(platResult.cpcAdjusted, 2, country.currency, country.locale),
      formatNumber(pOut.expectedTraffic, 0),
      formatNumber(pOut.leads, 1),
      formatNumber(pOut.qualifiedLeads, 1),
      formatNumber(pOut.customers, 1),
      formatCurrency(pOut.cac, 0, country.currency, country.locale),
      formatCurrency(pOut.revenue, 0, country.currency, country.locale),
      formatMultiplier(pOut.roas, 2),
      formatCurrency(pOut.netProfit, 0, country.currency, country.locale)
    ]);
  });

  rows.push(['']);

  // 3-Scenario Projections Table
  rows.push(['3-SCENARIO PROJECTIONS (CONSERVATIVE vs REALISTIC vs AGGRESSIVE)']);
  rows.push([
    'Scenario',
    `Monthly Spend (${country.currency})`,
    `CPC (${country.currency})`,
    'Landing Page CVR',
    'Monthly Leads',
    'Lead Qual %',
    'Sales Close %',
    'Monthly Deals',
    `CAC (${country.currency})`,
    `Revenue (${country.currency})`,
    'ROAS Multiple',
    `Net Profit (${country.currency})`
  ]);

  const scenarios = [
    {
      name: 'Conservative (-20% Conversion Rates, +20% CPC)',
      cpc: inputs.expectedCpc * 1.2,
      lpCvr: inputs.landingPageConversionRate * 0.8,
      qualRate: inputs.leadQualificationRate * 0.85,
      salesCvr: inputs.salesConversionRate * 0.8,
    },
    {
      name: 'Realistic (Current Baseline Model)',
      cpc: inputs.expectedCpc,
      lpCvr: inputs.landingPageConversionRate,
      qualRate: inputs.leadQualificationRate,
      salesCvr: inputs.salesConversionRate,
    },
    {
      name: 'Aggressive / Optimized (+25% Conversion Rates, -15% CPC)',
      cpc: Math.max(0.05, inputs.expectedCpc * 0.85),
      lpCvr: inputs.landingPageConversionRate * 1.25,
      qualRate: Math.min(100, inputs.leadQualificationRate * 1.15),
      salesCvr: Math.min(100, inputs.salesConversionRate * 1.25),
    },
  ];

  scenarios.forEach((sc) => {
    const clicks = sc.cpc > 0 ? inputs.monthlyAdSpend / sc.cpc : 0;
    const leads = clicks * (sc.lpCvr / 100);
    const sqls = leads * (sc.qualRate / 100);
    const deals = sqls * (sc.salesCvr / 100);
    const cac = deals > 0 ? inputs.monthlyAdSpend / deals : 0;
    const rev = deals * inputs.averageDealSize;
    const roas = inputs.monthlyAdSpend > 0 ? rev / inputs.monthlyAdSpend : 0;
    const margin = (inputs.grossMarginRate ?? 100) / 100;
    const netProfit = (rev * margin) - inputs.monthlyAdSpend;

    rows.push([
      sc.name,
      formatCurrency(inputs.monthlyAdSpend, 0, country.currency, country.locale),
      formatCurrency(sc.cpc, 2, country.currency, country.locale),
      formatPercent(sc.lpCvr, 1),
      formatNumber(leads, 1),
      formatPercent(sc.qualRate, 1),
      formatPercent(sc.salesCvr, 1),
      formatNumber(deals, 1),
      formatCurrency(cac, 0, country.currency, country.locale),
      formatCurrency(rev, 0, country.currency, country.locale),
      formatMultiplier(roas, 2),
      formatCurrency(netProfit, 0, country.currency, country.locale)
    ]);
  });

  // Construct CSV content
  const csvContent = rows
    .map((row) => row.map(escapeCsv).join(','))
    .join('\r\n');

  // Trigger browser download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const sanitizedClient = (inputs.clientName || 'prospect')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();
  const filename = `paid_media_growth_forecast_${sanitizedClient}_${country.code.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
