import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';
import { getPlatform } from '../data/platforms';
import { 
  calculateFunnel, 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from './calculations';

export interface PdfReportOptions {
  clientName?: string;
  preparedBy?: string;
  agencyName?: string;
  executiveNotes?: string;
}

/**
 * Generates and downloads a clean, presentation-ready PDF report
 * of the paid media funnel and unit economics model.
 */
export function exportFunnelToPdf(
  inputs: FunnelInputs,
  outputs: FunnelOutputs,
  options: PdfReportOptions = {}
): void {
  const country = getCountry(inputs.countryCode || 'US');
  const platform = inputs.platformId ? getPlatform(inputs.platformId) : null;
  const clientName = (options.clientName || inputs.clientName || 'Prospective Client').trim();
  const preparedBy = (options.preparedBy || options.agencyName || 'Growth & Acquisition Advisory').trim();
  const industry = inputs.industry || 'General Industry Benchmark';
  const platformName = platform ? platform.name : 'Paid Advertising Campaign';
  const platformAudience = platform ? platform.audienceIntent : 'Targeted Inbound & Social Traffic';
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fmt = (val: number, precision: number = 0) =>
    formatCurrency(val, precision, country.currency, country.locale);

  // Initialize PDF doc (Portrait A4)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  let currentY = 14;

  // 1. Top Brand Banner
  doc.setFillColor(32, 34, 58); // #20223A Deep Navy Slate
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 3, 3, 'F');

  // Title inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PAID MEDIA GROWTH & UNIT ECONOMICS PROPOSAL', margin + 6, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 182, 155); // #00B69B Teal Accent
  doc.text('GHL ARMY • 100% DETERMINISTIC CLIENT REVENUE FORECAST', margin + 6, currentY + 17);

  doc.setFontSize(8);
  doc.setTextColor(200, 205, 220);
  doc.text(`DATE: ${timestamp.toUpperCase()}`, pageWidth - margin - 6, currentY + 10, { align: 'right' });
  doc.text(`MARKET: ${country.flag} ${country.name.toUpperCase()} (${country.currency})`, pageWidth - margin - 6, currentY + 17, { align: 'right' });

  currentY += 28;

  // 2. Client & Meta Info Strip
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 20, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT / PROSPECT', margin + 5, currentY + 6);
  doc.text('INDUSTRY NICHE', margin + 50, currentY + 6);
  doc.text('PRIMARY CHANNEL', margin + 105, currentY + 6);
  doc.text('PREPARED BY', margin + 145, currentY + 6);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text(clientName, margin + 5, currentY + 14);
  doc.text(industry, margin + 50, currentY + 14);
  doc.text(`${platformName} (${platformAudience})`, margin + 105, currentY + 14);
  doc.text(preparedBy, margin + 145, currentY + 14);

  currentY += 24;

  // 3. Scorecard Summary (4 Key Metric KPI Cards)
  const cardWidth = (pageWidth - margin * 2 - 9) / 4; // 4 cards with 3mm gap
  const cardHeight = 22;

  const kpis = [
    {
      title: 'MONTHLY REVENUE',
      value: fmt(outputs.revenue, 0),
      subtitle: `${formatNumber(outputs.customers, 1)} deals @ ${fmt(inputs.averageDealSize)}`,
      highlight: false,
    },
    {
      title: 'NET AD PROFIT',
      value: `${outputs.netProfit >= 0 ? '+' : ''}${fmt(outputs.netProfit, 0)}`,
      subtitle: outputs.netProfit >= 0 ? 'Profitable Campaign' : 'Review Unit Economics',
      highlight: true,
    },
    {
      title: 'TARGET ROAS',
      value: formatMultiplier(outputs.roas, 2),
      subtitle: `${outputs.roasPercentage.toFixed(0)}% Return On Spend`,
      highlight: false,
    },
    {
      title: 'COST PER CLIENT (CAC)',
      value: fmt(outputs.cac, 0),
      subtitle: `Max Break-Even: ${fmt(inputs.averageDealSize)}`,
      highlight: false,
    },
  ];

  kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    if (kpi.highlight) {
      doc.setFillColor(0, 182, 155); // #00B69B
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(kpi.title, cardX + 4, currentY + 5.5);

      doc.setFontSize(12);
      doc.text(kpi.value, cardX + 4, currentY + 13.5);

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text(kpi.subtitle, cardX + 4, currentY + 18.5);
    } else {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(kpi.title, cardX + 4, currentY + 5.5);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.text(kpi.value, cardX + 4, currentY + 13.5);

      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(kpi.subtitle, cardX + 4, currentY + 18.5);
    }
  });

  currentY += cardHeight + 5;

  // 4. Detailed 4-Step Funnel Breakdown Table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4-STEP PAID MEDIA PIPELINE BREAKDOWN', margin, currentY + 4);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Full arithmetic proof connecting media investment to closed won revenue', margin + 85, currentY + 4);

  currentY += 6;

  const funnelTableData = [
    [
      'Step 1: Budget & Traffic',
      `${fmt(inputs.monthlyAdSpend)} Spend ÷ ${fmt(inputs.expectedCpc, 2)} CPC`,
      `${formatNumber(outputs.expectedTraffic)} Clicks / Mo`,
      `Unit CPC: ${fmt(inputs.expectedCpc, 2)}`,
      'Top-of-funnel traffic entering dedicated landing page'
    ],
    [
      'Step 2: Leads & CVR',
      `${formatNumber(outputs.expectedTraffic)} Visitors × ${inputs.landingPageConversionRate}% CVR`,
      `${formatNumber(outputs.leads, 1)} Inbound Leads`,
      `Cost / Lead: ${fmt(outputs.costPerLead, 2)}`,
      'Form fills, consultation requests, and direct phone calls'
    ],
    [
      'Step 3: Sales Pipeline',
      `${formatNumber(outputs.leads, 1)} Leads × ${inputs.leadQualificationRate}% Qual Rate`,
      `${formatNumber(outputs.qualifiedLeads, 1)} Sales Calls`,
      `Cost / SQL: ${fmt(outputs.costPerQualifiedLead, 2)}`,
      'Pre-vetted prospects with budget, authority & active need'
    ],
    [
      'Step 4: Revenue & ROAS',
      `${formatNumber(outputs.qualifiedLeads, 1)} Calls × ${inputs.salesConversionRate}% Close Rate`,
      `${formatNumber(outputs.customers, 1)} Closed Clients`,
      `Gross: ${fmt(outputs.revenue, 0)}`,
      `Net Profit: ${fmt(outputs.netProfit, 0)} • ROAS: ${formatMultiplier(outputs.roas, 2)}`
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Funnel Step', 'Conversion Formula', 'Monthly Output', 'Unit Economics', 'Operational Milestone']],
    body: funnelTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [32, 34, 58],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [15, 23, 42],
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 42 },
      2: { fontStyle: 'bold', cellWidth: 32 },
      3: { cellWidth: 30, textColor: [0, 146, 124] },
      4: { cellWidth: 38 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 5. 3-Scenario Stress-Test & Upside Forecast
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3-TIER SCENARIO FORECAST (RISK DE-ESCALATION)', margin, currentY + 3);

  currentY += 5;

  // Scenario data computation
  const conservativeInputs: FunnelInputs = {
    ...inputs,
    expectedCpc: Number((inputs.expectedCpc * 1.15).toFixed(2)),
    landingPageConversionRate: Math.max(0.5, Number((inputs.landingPageConversionRate * 0.8).toFixed(1))),
    leadQualificationRate: Math.max(5, Number((inputs.leadQualificationRate * 0.85).toFixed(1))),
    salesConversionRate: Math.max(2, Number((inputs.salesConversionRate * 0.85).toFixed(1))),
  };
  const conservativeOutputs = calculateFunnel(conservativeInputs);

  const optimizedInputs: FunnelInputs = {
    ...inputs,
    expectedCpc: Math.max(0.2, Number((inputs.expectedCpc * 0.9).toFixed(2))),
    landingPageConversionRate: Number((inputs.landingPageConversionRate * 1.25).toFixed(1)),
    leadQualificationRate: Math.min(95, Number((inputs.leadQualificationRate * 1.15).toFixed(1))),
    salesConversionRate: Math.min(80, Number((inputs.salesConversionRate * 1.2).toFixed(1))),
  };
  const optimizedOutputs = calculateFunnel(optimizedInputs);

  const scenarioTableData = [
    [
      'Monthly Ad Spend',
      fmt(inputs.monthlyAdSpend),
      fmt(inputs.monthlyAdSpend),
      fmt(inputs.monthlyAdSpend),
    ],
    [
      'Cost Per Click (CPC)',
      fmt(conservativeInputs.expectedCpc, 2),
      fmt(inputs.expectedCpc, 2),
      fmt(optimizedInputs.expectedCpc, 2),
    ],
    [
      'Website Visitors',
      formatNumber(conservativeOutputs.expectedTraffic),
      formatNumber(outputs.expectedTraffic),
      formatNumber(optimizedOutputs.expectedTraffic),
    ],
    [
      'Inbound Leads',
      formatNumber(conservativeOutputs.leads, 1),
      formatNumber(outputs.leads, 1),
      formatNumber(optimizedOutputs.leads, 1),
    ],
    [
      'Qualified Sales Calls',
      formatNumber(conservativeOutputs.qualifiedLeads, 1),
      formatNumber(outputs.qualifiedLeads, 1),
      formatNumber(optimizedOutputs.qualifiedLeads, 1),
    ],
    [
      'Closed Clients / Mo',
      `~${formatNumber(conservativeOutputs.customers, 1)}`,
      `~${formatNumber(outputs.customers, 1)}`,
      `~${formatNumber(optimizedOutputs.customers, 1)}`,
    ],
    [
      'Gross Monthly Revenue',
      fmt(conservativeOutputs.revenue, 0),
      fmt(outputs.revenue, 0),
      fmt(optimizedOutputs.revenue, 0),
    ],
    [
      'Net Profit / (Loss)',
      fmt(conservativeOutputs.netProfit, 0),
      fmt(outputs.netProfit, 0),
      fmt(optimizedOutputs.netProfit, 0),
    ],
    [
      'Return On Ad Spend (ROAS)',
      formatMultiplier(conservativeOutputs.roas, 2),
      formatMultiplier(outputs.roas, 2),
      formatMultiplier(optimizedOutputs.roas, 2),
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Key Metric', 'Conservative (Stress-Test)', 'Realistic (Active Baseline)', 'Optimized (Agency Upside)']],
    body: scenarioTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [32, 34, 58],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [15, 23, 42],
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 44, textColor: [71, 85, 105] },
      2: { cellWidth: 44, fontStyle: 'bold', textColor: [0, 146, 124] },
      3: { cellWidth: 44, fontStyle: 'bold', textColor: [32, 34, 58] },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 6. Strategic Executive Notes & Call to Action Box
  const notesBoxHeight = 22;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, notesBoxHeight, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(32, 34, 58);
  doc.text('EXECUTIVE ACTION PLAN & NEXT STEPS:', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const defaultNotes = options.executiveNotes?.trim() || 
    `1. Launch campaign on ${platformName} targeting high-intent searchers in ${country.name}.\n` +
    `2. Deploy high-converting landing page with instant lead routing to maintain estimated ${inputs.landingPageConversionRate}% conversion rate.\n` +
    `3. Conduct weekly pipeline review to track cost per closed client against the ${fmt(outputs.cac, 0)} CAC benchmark.`;

  const splitNotes = doc.splitTextToSize(defaultNotes, pageWidth - margin * 2 - 8);
  doc.text(splitNotes, margin + 4, currentY + 10);

  currentY += notesBoxHeight + 4;

  // 7. Footer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    'CONFIDENTIAL & PROPRIETARY • GENERATED WITH GHL ARMY PAID MEDIA ROI & FUNNEL SUITE • DATA GROUNDED IN VERIFIED INDUSTRY BENCHMARKS',
    pageWidth / 2,
    pageHeight() - 6,
    { align: 'center' }
  );

  function pageHeight() {
    return doc.internal.pageSize.getHeight();
  }

  // Save/Download the PDF
  const sanitizedClient = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedClient}-paid-media-growth-report.pdf`;
  doc.save(filename);
}
