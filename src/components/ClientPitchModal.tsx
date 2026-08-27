import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  FileText, 
  Send, 
  DollarSign, 
  TrendingUp, 
  Sparkles,
  Printer,
  Globe,
  Zap,
  Download,
  Link2
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';
import { getPlatform } from '../data/platforms';
import { exportFunnelToCsv } from '../utils/exportCsv';
import { copyShareableLink, getShareableUrl } from '../utils/urlState';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';
import { GHLArmyLogo } from './GHLArmyLogo';

interface ClientPitchModalProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onClose: () => void;
}

export const ClientPitchModal: React.FC<ClientPitchModalProps> = ({
  inputs,
  outputs,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const country = getCountry(inputs.countryCode || 'US');
  const platform = getPlatform(inputs.platformId || 'google');
  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  const prospectName = inputs.clientName?.trim() || 'Prospective Client';
  const industryTag = inputs.industry || 'General';

  const executiveSummaryText = `PAID MEDIA GROWTH FORECAST
Client: ${prospectName}
Ad Platform / Channel: ${platform.name} (${platform.audienceIntent})
Target Market / Country: ${country.name} (${country.code})
Currency: ${country.currency}
Industry / Vertical: ${industryTag}
Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

==================================================
CAMPAIGN FUNNEL BENCHMARKS (${platform.name.toUpperCase()})
==================================================
1. Monthly Ad Budget:            ${fmt(inputs.monthlyAdSpend)}
2. Estimated Unit CPC:           ${fmt(inputs.expectedCpc, 2)}
3. Projected Targeted Traffic:   ${formatNumber(outputs.expectedTraffic)} visitors / mo
4. Landing Page Conv. Rate:      ${inputs.landingPageConversionRate}%
5. Total Leads / Inquiries:      ${formatNumber(outputs.leads, 1)} leads / mo
   - Cost Per Lead (CPL):        ${fmt(outputs.costPerLead, 2)}
6. Lead Qualification Rate:      ${inputs.leadQualificationRate}%
7. Qualified Opportunities:      ${formatNumber(outputs.qualifiedLeads, 1)} SQLs / mo
   - Cost Per SQL (CPQL):        ${fmt(outputs.costPerQualifiedLead, 2)}
8. Sales Close / Win Rate:       ${inputs.salesConversionRate}%
9. New Customers / Deals:        ${formatNumber(outputs.customers, 1)} closed won / mo
10. Customer Acquisition Cost:   ${fmt(outputs.cac, 0)} per customer
11. Average Deal Size:           ${fmt(inputs.averageDealSize)}
12. Projected Monthly Revenue:   ${fmt(outputs.revenue, 0)}
13. Expected ROAS:               ${formatMultiplier(outputs.roas, 2)} (${outputs.roasPercentage.toFixed(0)}%)
14. Projected Net Profit:        ${fmt(outputs.netProfit, 0)}

==================================================
EXECUTIVE SUMMARY & RATIONALE
==================================================
Based on our growth model for ${platform.name} in the ${country.name} market, deploying a monthly budget of ${fmt(inputs.monthlyAdSpend)} is projected to drive ${formatNumber(outputs.expectedTraffic)} high-intent visitors at an average CPC of ${fmt(inputs.expectedCpc, 2)}. At an estimated ${inputs.landingPageConversionRate}% landing page conversion and a ${inputs.leadQualificationRate}% sales qualification rate, this generates ${formatNumber(outputs.qualifiedLeads, 1)} discovery calls per month.

With your team's ${inputs.salesConversionRate}% closing rate, this translates into ${formatNumber(outputs.customers, 1)} new paying clients per month at an acquisition cost (CAC) of ${fmt(outputs.cac, 0)}. Against an average deal value of ${fmt(inputs.averageDealSize)}, this generates ${fmt(outputs.revenue, 0)} in new monthly revenue, delivering a ${formatMultiplier(outputs.roas, 2)} Return On Ad Spend (ROAS).`;

  const emailRecapText = `Hi ${prospectName.split(' ')[0] || 'there'},

Great speaking with you today! As discussed, here is the paid media growth model we walked through for your campaign on ${platform.name} in ${country.name}:

- Primary Channel: ${platform.name} (${platform.audienceIntent})
- Target Market: ${country.flag} ${country.name} (${country.currency})
- Monthly Ad Spend: ${fmt(inputs.monthlyAdSpend)}
- Targeted Clicks: ~${formatNumber(outputs.expectedTraffic)} visitors (@ ${fmt(inputs.expectedCpc, 2)} CPC)
- Inbound Leads: ~${formatNumber(outputs.leads, 0)} leads (${inputs.landingPageConversionRate}% LP CVR)
- Qualified Sales Calls: ~${formatNumber(outputs.qualifiedLeads, 0)} SQLs (${inputs.leadQualificationRate}% Qual Rate)
- Projected New Customers: ~${formatNumber(outputs.customers, 1)} clients (${inputs.salesConversionRate}% Close Rate)
- Customer Acquisition Cost: ${fmt(outputs.cac, 0)}
- Projected Monthly Revenue: ${fmt(outputs.revenue, 0)}
- Target ROAS: ${formatMultiplier(outputs.roas, 2)}

Let me know if you have any questions on these benchmarks. Looking forward to our next steps!`;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#20223A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow-xs">
              <GHLArmyLogo size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Client Pitch Sheet & Proposal
                </h2>
                <span className="text-xs bg-slate-800 text-[#00B69B] px-2 py-0.5 rounded-full border border-slate-700 font-semibold flex items-center gap-1">
                  <span>{country.flag}</span>
                  <span>{country.currency}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ready-to-send recap formatted for sales follow-up and proposal decks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Monthly Spend</div>
              <div className="text-sm font-bold font-mono text-slate-900">{fmt(inputs.monthlyAdSpend)}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Closed Deals</div>
              <div className="text-sm font-bold font-mono text-slate-900">{formatNumber(outputs.customers, 1)} clients</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Projected Revenue</div>
              <div className="text-sm font-bold font-mono text-emerald-700">{fmt(outputs.revenue, 0)}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Projected ROAS</div>
              <div className="text-sm font-black font-mono text-[#00B69B]">{formatMultiplier(outputs.roas, 2)}</div>
            </div>
          </div>

          {/* Section 1: Email Recap Template */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Post-Call Email Recap
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(emailRecapText, 'email')}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email Template</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
              {emailRecapText}
            </pre>
          </div>

          {/* Section 2: Full Detailed Executive Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Complete Proposal Text (Deck / SOW Ready)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(executiveSummaryText, 'proposal')}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-[#20223A] hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                {copiedSection === 'proposal' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00B69B]" />
                    <span className="text-[#00B69B]">Copied Full Proposal!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#00B69B]" />
                    <span>Copy Full Proposal</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-[#20223A] text-slate-200 border border-slate-800 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {executiveSummaryText}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Pro-tip: Paste directly into your proposal deck or download a complete CSV report.
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="pitch-modal-share-link-btn"
              type="button"
              onClick={async () => {
                const ok = await copyShareableLink(inputs);
                if (ok) {
                  setCopiedSection('share-link');
                  setTimeout(() => setCopiedSection(null), 2500);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#00B69B] hover:bg-[#009e86] text-white transition-colors cursor-pointer shadow-2xs"
            >
              {copiedSection === 'share-link' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Shareable Link</span>
                </>
              )}
            </button>
            <button
              id="pitch-modal-export-csv-btn"
              type="button"
              onClick={() => exportFunnelToCsv(inputs, outputs)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV File</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

