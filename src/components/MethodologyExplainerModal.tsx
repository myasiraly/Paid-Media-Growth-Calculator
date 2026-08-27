import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Calculator, 
  Globe2, 
  Scale, 
  DollarSign,
  Search,
  Users,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getCountry } from '../data/countries';
import { FunnelInputs, FunnelOutputs } from '../types';
import { formatCurrency, formatNumber, formatMultiplier } from '../utils/calculations';

interface MethodologyExplainerModalProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyExplainerModal: React.FC<MethodologyExplainerModalProps> = ({
  inputs,
  outputs,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const country = getCountry(inputs.countryCode || 'US');
  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#20223A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00B69B] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Why This Information Is Reliable</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00B69B]/20 text-[#00B69B] border border-[#00B69B]/30">
                  100% Transparent Math
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                The exact formulas, benchmark sources, and logic behind these projections
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

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-slate-700">
          
          {/* Section 1: The 3 Core Pillars of Truth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-[#00B69B]/10 text-[#00927C] flex items-center justify-center font-bold mb-2.5">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">1. Pure Math, No Guesses</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                There is zero speculative AI "guessing". Every single number is calculated using exact multiplication and division of conversion rates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2.5">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">2. Real Ad Network Data</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Cost-per-click rates are based on actual auction medians across Meta, Google Search, LinkedIn B2B, TikTok, and 20+ countries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2.5">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">3. Fully Adaptable to You</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Benchmarks are helpful starting guides, but you can type your company's own exact historical numbers into any slider anytime.
              </p>
            </div>
          </div>

          {/* Section 2: Step-by-Step Live Arithmetic Proof */}
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00B69B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Live Mathematical Proof (Your Current Settings)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Verify on any pocket calculator</span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/60">
                <span className="text-slate-400">Step 1: Visitors</span>
                <span className="text-white">
                  {fmt(inputs.monthlyAdSpend)} Budget ÷ {fmt(inputs.expectedCpc, 2)} CPC = <strong>{formatNumber(outputs.expectedTraffic)} Visitors</strong>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-800/60">
                <span className="text-slate-400">Step 2: Leads</span>
                <span className="text-white">
                  {formatNumber(outputs.expectedTraffic)} Visitors × {inputs.landingPageConversionRate}% CVR = <strong>{formatNumber(outputs.leads, 1)} Leads</strong>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-800/60">
                <span className="text-slate-400">Step 3: Calls</span>
                <span className="text-white">
                  {formatNumber(outputs.leads, 1)} Leads × {inputs.leadQualificationRate}% Qual = <strong>{formatNumber(outputs.qualifiedLeads, 1)} Calls</strong>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-800/60">
                <span className="text-slate-400">Step 4: Clients</span>
                <span className="text-white">
                  {formatNumber(outputs.qualifiedLeads, 1)} Calls × {inputs.salesConversionRate}% Close = <strong>{formatNumber(outputs.customers, 1)} Clients</strong>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#00B69B]/10 border border-[#00B69B]/30 text-[#00B69B] font-bold">
                <span>Final Revenue:</span>
                <span>
                  {formatNumber(outputs.customers, 1)} Clients × {fmt(inputs.averageDealSize)} = {fmt(outputs.revenue, 0)} ({formatMultiplier(outputs.roas, 2)} ROAS)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Where Benchmark Numbers Come From */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#00927C]" />
              <span>Where Do The Default Conversion Numbers Come From?</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-slate-900">Cost Per Click (CPC) Differences</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Google Search costs more (e.g. $3.50+) because prospects are actively searching for help right now. Meta & TikTok cost less (e.g. $0.80–$1.50) because ads appear while people browse social feeds.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-slate-900">Landing Page Conversion (CVR)</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  A basic website converts 1–3% of visitors. Dedicated landing pages with a focused headline, single call-to-action, and trust badges typically convert at 5–12%.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-slate-900">Lead Qualification Filter</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  In the real world, 40–50% of raw internet inquiries have wrong numbers, no budget, or are outside your service area. Filtering ensures your sales team only talks to real buyers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-slate-900">Sales Close Rate</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  For qualified discovery calls, a 15–30% close rate is standard across professional service industries. 1 in 4 serious conversations closing into a client is a realistic baseline.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: How To Protect Yourself (Sensitivity & Scenarios) */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              !
            </div>
            <div>
              <span className="font-bold block mb-0.5">Pro Tip for Business Owners:</span>
              <span>
                Always test the <strong>"Conservative"</strong> scenario (using the Scenario toggle in the top bar) to make sure your campaign still makes a profit even if ad costs rise by 25% or conversion drops. If the numbers work in the conservative test, you have a safe business case.
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Click any slider in the calculator to test your own custom numbers
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#00B69B] hover:bg-[#00927C] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Got It, Back to Calculator
          </button>
        </div>

      </div>
    </div>
  );
};
