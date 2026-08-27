import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info } from 'lucide-react';

export interface MetricTooltipInfo {
  title: string;
  shortDef: string;
  formula?: string;
  salesPitchTip?: string;
  benchmarkContext?: string;
}

export const METRIC_DEFINITIONS: Record<string, MetricTooltipInfo> = {
  monthlyAdSpend: {
    title: 'Monthly Ad Spend (Budget)',
    shortDef: 'The gross monetary budget allocated to paid media platforms over a 30-day operating cycle.',
    formula: 'Top-of-Funnel Total Capital Outlay',
    salesPitchTip: 'Frame ad spend not as an operational cost, but as an investment engine where every dollar produces predictable downstream customer returns.',
    benchmarkContext: 'Typical starting budgets range from $2,500 to $15,000/mo depending on market tier and target acquisition velocity.'
  },
  expectedCpc: {
    title: 'Cost Per Click (CPC)',
    shortDef: 'The average amount charged by ad networks (Google, Meta, LinkedIn, etc.) each time a prospect clicks on an ad.',
    formula: 'Total Ad Spend ÷ Total Clicks',
    salesPitchTip: 'Explain that higher CPCs (e.g. LinkedIn B2B or Google High-Intent Search) often correlate with higher buyer intent and larger average deal sizes.',
    benchmarkContext: 'Meta/TikTok: $0.40–$2.50 | Google Search: $2.50–$9.00 | LinkedIn B2B: $6.00–$18.00+'
  },
  expectedTraffic: {
    title: 'Expected Traffic (Clicks / Visitors)',
    shortDef: 'The total estimated volume of targeted prospect sessions delivered to your landing page or website each month.',
    formula: 'Monthly Ad Spend ÷ Expected CPC',
    salesPitchTip: 'Demonstrates the raw volume of relevant eyeballs and potential buyers entering the top of your sales pipeline.',
    benchmarkContext: 'High-intent traffic converts at 2–3x higher rates than generic programmatic impressions.'
  },
  landingPageConversionRate: {
    title: 'Landing Page Conversion Rate (LP CVR)',
    shortDef: 'The percentage of site visitors who complete the primary conversion action (submit a form, book a demo, or start a trial).',
    formula: '(Total Leads ÷ Total Site Visitors) × 100',
    salesPitchTip: 'A 2% improvement in LP conversion rate effectively cuts your Cost Per Lead (CPL) in half without increasing ad spend by a single dollar.',
    benchmarkContext: 'Average B2B lead gen: 3%–6% | High-converting dedicated LP: 8%–15%+'
  },
  costPerLead: {
    title: 'Cost Per Lead (CPL)',
    shortDef: 'The average paid media cost required to generate one raw lead, inquiry, or top-of-funnel opt-in.',
    formula: 'Monthly Ad Spend ÷ Total Leads (or CPC ÷ LP CVR)',
    salesPitchTip: 'Use CPL to establish baseline customer acquisition efficiency before evaluating sales team pipeline filters.',
    benchmarkContext: 'B2B Tech: $50–$180 | Local Services: $25–$75 | Consumer: $10–$40'
  },
  leadQualificationRate: {
    title: 'Lead Qualification Rate (MQL → SQL)',
    shortDef: 'The percentage of raw inquiries that meet your Ideal Customer Profile (ICP) criteria and convert into sales-ready Discovery Calls (SQLs).',
    formula: '(Sales Qualified Leads ÷ Raw Leads) × 100',
    salesPitchTip: 'Assures clients that your campaign targets decision-makers rather than tyre-kickers, protecting the sales team’s valuable closing hours.',
    benchmarkContext: 'Unfiltered lead forms: 20%–35% | Strict ICP qualification forms: 45%–70%'
  },
  costPerQualifiedLead: {
    title: 'Cost Per Qualified Lead / SQL (CPQL)',
    shortDef: 'The direct acquisition cost to put a verified, high-intent buyer directly onto a live sales discovery call.',
    formula: 'Monthly Ad Spend ÷ Total Qualified Leads',
    salesPitchTip: 'This is the golden operational metric for sales leaders—showing exactly what it costs to produce a qualified pipeline meeting.',
    benchmarkContext: 'SaaS/B2B: $150–$450 | Enterprise Services: $300–$900'
  },
  salesConversionRate: {
    title: 'Sales Conversion Rate (Close / Win Rate)',
    shortDef: 'The percentage of sales-qualified opportunities (SQLs) that your account executives successfully close into paying clients.',
    formula: '(New Won Customers ÷ Sales Qualified Leads) × 100',
    salesPitchTip: 'Connects marketing pipeline generation directly with client sales execution. Even modest win-rate boosts create compounding revenue surges.',
    benchmarkContext: 'Industry average for outbound/inbound mix is 18%–25%; top sales organizations close 30%–40%+.'
  },
  customers: {
    title: 'New Customers / Won Deals',
    shortDef: 'The net volume of paying clients acquired directly through the ad campaign over the 30-day period.',
    formula: 'Sales Qualified Leads × Sales Conversion Rate',
    salesPitchTip: 'This represents concrete closed business and client headcount added to the customer roster.',
    benchmarkContext: 'Calculated from pipeline conversion velocity; directly dictates top-line revenue.'
  },
  cac: {
    title: 'Customer Acquisition Cost (CAC)',
    shortDef: 'The total paid media expenditure required to win a single net-new paying customer or client contract.',
    formula: 'Monthly Ad Spend ÷ Total New Customers',
    salesPitchTip: 'Compare CAC directly against Average Deal Size (ACV) and Lifetime Value (LTV). A healthy business model maintains a CAC that is <33% of deal value.',
    benchmarkContext: 'LTV to CAC ratio of 3:1 is standard healthy; 4:1+ is exceptional growth efficiency.'
  },
  averageDealSize: {
    title: 'Average Deal Size (ACV / Order Value)',
    shortDef: 'The average revenue generated from a single won client contract, annual subscription (ACV), or initial project scope.',
    formula: 'Total Revenue ÷ Total Customers Won',
    salesPitchTip: 'Demonstrates why high-ticket services or enterprise software can sustain significantly higher acquisition costs while yielding stellar ROAS.',
    benchmarkContext: 'B2B Services: $3,000–$25,000+ | Enterprise SaaS: $15,000–$100,000+'
  },
  grossMarginRate: {
    title: 'Gross Margin Rate (%)',
    shortDef: 'The percentage of total client revenue retained after direct costs of goods, fulfillment, or service delivery.',
    formula: '((Revenue − Cost of Goods Sold) ÷ Revenue) × 100',
    salesPitchTip: 'Allows the model to calculate true Net Operating Profit, ensuring the campaign generates real cash flow rather than empty top-line revenue.',
    benchmarkContext: 'Software/Digital: 75%–90% | Professional Agencies: 50%–70% | Physical Ecom: 35%–55%'
  },
  roas: {
    title: 'Return On Ad Spend (ROAS)',
    shortDef: 'The revenue multiple generated for every single dollar or currency unit invested into the paid advertising campaign.',
    formula: 'Total Revenue Generated ÷ Monthly Ad Spend',
    salesPitchTip: 'The ultimate presentation headline: "For every $1 you give this campaign, you receive $X.XX in contracted client revenue back."',
    benchmarkContext: 'Under 1.0x = Unprofitable | 2.0x–3.0x = Healthy Sustainable | 4.0x+ = High-Return Scalable Campaign'
  },
  roi: {
    title: 'Return on Investment (Net Campaign ROI)',
    shortDef: 'The percentage net profit earned on the campaign after accounting for gross profit margins and subtracting total ad spend.',
    formula: '((Gross Profit − Total Ad Spend) ÷ Total Ad Spend) × 100',
    salesPitchTip: 'Demonstrates executive financial return to CFOs and investors who care about net bottom-line cash generation.',
    benchmarkContext: 'Positive ROI (>100%) represents a compounding growth asset for the business.'
  }
};

interface MetricTooltipProps {
  metricKey: keyof typeof METRIC_DEFINITIONS | string;
  customTitle?: string;
  customDef?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  iconSize?: 'sm' | 'md';
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  metricKey,
  customTitle,
  customDef,
  position = 'top',
  className = '',
  iconSize = 'sm',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const info: MetricTooltipInfo = METRIC_DEFINITIONS[metricKey] || {
    title: customTitle || metricKey,
    shortDef: customDef || 'Metric used for calculating funnel performance and unit economics.',
  };

  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close on outside click for mobile friendliness
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent border-[5px]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent border-[5px]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent border-[5px]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent border-[5px]',
  };

  return (
    <div 
      ref={tooltipRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
    >
      <button
        type="button"
        aria-label={`Definition for ${info.title}`}
        className="text-slate-400 hover:text-blue-600 focus:text-blue-600 transition-colors p-0.5 rounded-full hover:bg-blue-50 focus:outline-none cursor-pointer flex items-center justify-center"
      >
        <HelpCircle className={iconSize === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      {/* Floating Tooltip Box */}
      {isOpen && (
        <div 
          className={`absolute z-50 w-72 sm:w-80 p-3.5 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700/80 text-left pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150 ${positionClasses[position]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <h4 className="text-xs font-bold text-white leading-snug">
                {info.title}
              </h4>
            </div>
            {info.formula && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 shrink-0 font-medium">
                {info.formula}
              </span>
            )}
          </div>

          {/* Definition */}
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2 font-normal">
            {info.shortDef}
          </p>

          {/* Sales Pitch / Rep Context */}
          {info.salesPitchTip && (
            <div className="bg-slate-800/90 rounded-lg p-2 mb-1.5 border border-slate-700/60">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                <span>💡 Sales Rep Talking Point</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-normal">
                {info.salesPitchTip}
              </p>
            </div>
          )}

          {/* Benchmark Context */}
          {info.benchmarkContext && (
            <div className="text-[10px] text-slate-400 flex items-start gap-1 mt-1">
              <span className="text-blue-400 font-semibold shrink-0">Benchmark:</span>
              <span className="text-slate-300">{info.benchmarkContext}</span>
            </div>
          )}

          {/* Triangle Arrow */}
          <div className={`absolute w-0 h-0 pointer-events-none ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};
