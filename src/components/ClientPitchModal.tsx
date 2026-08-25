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
  Printer
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';

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

  const prospectName = inputs.clientName?.trim() || 'Prospective Client';
  const industryTag = inputs.industry || 'General';

  const executiveSummaryText = `PAID MEDIA GROWTH FORECAST
Client: ${prospectName}
Industry / Vertical: ${industryTag}
Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

==================================================
CAMPAIGN FUNNEL BENCHMARKS
==================================================
1. Monthly Ad Budget:            ${formatCurrency(inputs.monthlyAdSpend)}
2. Estimated Unit CPC:           ${formatCurrency(inputs.expectedCpc, 2)}
3. Projected Targeted Traffic:   ${formatNumber(outputs.expectedTraffic)} visitors / mo
4. Landing Page Conv. Rate:      ${inputs.landingPageConversionRate}%
5. Total Leads / Inquiries:      ${formatNumber(outputs.leads, 1)} leads / mo
   - Cost Per Lead (CPL):        ${formatCurrency(outputs.costPerLead, 2)}
6. Lead Qualification Rate:      ${inputs.leadQualificationRate}%
7. Qualified Opportunities:      ${formatNumber(outputs.qualifiedLeads, 1)} SQLs / mo
   - Cost Per SQL (CPQL):        ${formatCurrency(outputs.costPerQualifiedLead, 2)}
8. Sales Close / Win Rate:       ${inputs.salesConversionRate}%
9. New Customers / Deals:        ${formatNumber(outputs.customers, 1)} closed won / mo
10. Customer Acquisition Cost:   ${formatCurrency(outputs.cac, 0)} per customer
11. Average Deal Size:           ${formatCurrency(inputs.averageDealSize)}
12. Projected Monthly Revenue:   ${formatCurrency(outputs.revenue, 0)}
13. Expected ROAS:               ${formatMultiplier(outputs.roas, 2)} (${outputs.roasPercentage.toFixed(0)}%)
14. Projected Net Profit:        ${formatCurrency(outputs.netProfit, 0)}

==================================================
EXECUTIVE SUMMARY & RATIONALE
==================================================
Based on our growth model, deploying a monthly budget of ${formatCurrency(inputs.monthlyAdSpend)} is projected to drive ${formatNumber(outputs.expectedTraffic)} high-intent visitors. At an estimated ${inputs.landingPageConversionRate}% landing page conversion and a ${inputs.leadQualificationRate}% sales qualification rate, this generates ${formatNumber(outputs.qualifiedLeads, 1)} discovery calls per month.

With your team's ${inputs.salesConversionRate}% closing rate, this translates into ${formatNumber(outputs.customers, 1)} new paying clients per month at an acquisition cost (CAC) of ${formatCurrency(outputs.cac, 0)}. Against an average deal value of ${formatCurrency(inputs.averageDealSize)}, this generates ${formatCurrency(outputs.revenue, 0)} in new monthly revenue, delivering a ${formatMultiplier(outputs.roas, 2)} Return On Ad Spend (ROAS).`;

  const emailRecapText = `Hi ${prospectName.split(' ')[0] || 'there'},

Great speaking with you today! As discussed, here is the paid media growth model we walked through for your campaign:

- Monthly Ad Spend: ${formatCurrency(inputs.monthlyAdSpend)}
- Targeted Clicks: ~${formatNumber(outputs.expectedTraffic)} visitors (@ ${formatCurrency(inputs.expectedCpc, 2)} CPC)
- Inbound Leads: ~${formatNumber(outputs.leads, 0)} leads (${inputs.landingPageConversionRate}% LP CVR)
- Qualified Sales Calls: ~${formatNumber(outputs.qualifiedLeads, 0)} SQLs (${inputs.leadQualificationRate}% Qual Rate)
- Projected New Customers: ~${formatNumber(outputs.customers, 1)} clients (${inputs.salesConversionRate}% Close Rate)
- Customer Acquisition Cost: ${formatCurrency(outputs.cac, 0)}
- Projected Monthly Revenue: ${formatCurrency(outputs.revenue, 0)}
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
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Client Pitch Sheet & Proposal Summary</h2>
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
              <div className="text-sm font-bold font-mono text-slate-900">{formatCurrency(inputs.monthlyAdSpend)}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Closed Deals</div>
              <div className="text-sm font-bold font-mono text-slate-900">{formatNumber(outputs.customers, 1)} clients</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Projected Revenue</div>
              <div className="text-sm font-bold font-mono text-emerald-700">{formatCurrency(outputs.revenue, 0)}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Projected ROAS</div>
              <div className="text-sm font-black font-mono text-blue-900">{formatMultiplier(outputs.roas, 2)}</div>
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
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                {copiedSection === 'proposal' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-blue-400">Copied Full Proposal!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Copy Full Proposal</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {executiveSummaryText}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Pro-tip: Paste directly into your proposal deck or CRM opportunity notes.
          </span>
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
  );
};
