import React from 'react';
import { Sparkles, Users, MessageSquare, PhoneCall, Trophy, DollarSign, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';
import { getPlatform } from '../data/platforms';
import { formatCurrency, formatNumber, formatMultiplier } from '../utils/calculations';

interface PlainEnglishStoryProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  isCalculable: boolean;
}

export const PlainEnglishStory: React.FC<PlainEnglishStoryProps> = ({
  inputs,
  outputs,
  isCalculable,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const platform = inputs.platformId ? getPlatform(inputs.platformId) : null;
  const fmt = (val: number, precision: number = 0) =>
    formatCurrency(val, precision, country.currency, country.locale);

  if (!isCalculable) {
    return (
      <div className="bg-gradient-to-r from-[#20223A] to-[#2d2f4d] rounded-2xl p-5 text-white border border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#00B69B]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            How Your Growth Pipeline Works
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Select your industry, advertising platform, and budget above to see your customized growth story in plain English.
        </p>
      </div>
    );
  }

  const isProfitable = outputs.netProfit > 0;

  return (
    <div className="bg-[#20223A] text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00B69B]/20 text-[#00B69B] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Your Marketing Pipeline In Plain English</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Clear, step-by-step summary of how your ad budget turns into clients and revenue
            </p>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
          isProfitable
            ? 'bg-[#00B69B]/20 text-[#00B69B] border-[#00B69B]/40'
            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        }`}>
          {isProfitable ? '✓ Profitable Campaign' : 'Needs Optimization'}
        </span>
      </div>

      {/* Narrative High-Level Sentence */}
      <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-700/70 text-xs sm:text-sm text-slate-200 leading-relaxed">
        If you invest <strong className="text-white font-bold">{fmt(inputs.monthlyAdSpend)}/month</strong> on{' '}
        <strong className="text-[#00B69B]">{platform?.name || 'online'} ads</strong> in{' '}
        <strong className="text-white">{inputs.industry || 'your industry'}</strong>, you can expect to close{' '}
        <strong className="text-[#00B69B] font-bold">~{formatNumber(outputs.customers, 1)} paying clients</strong>, generating{' '}
        <strong className="text-white font-bold">{fmt(outputs.revenue, 0)} in revenue</strong> (
        <strong className="text-[#00B69B]">{formatMultiplier(outputs.roas, 1)} return on ad spend</strong>) with{' '}
        <strong className={`font-bold ${isProfitable ? 'text-[#00B69B]' : 'text-rose-400'}`}>
          {fmt(outputs.netProfit, 0)} net profit
        </strong>{' '}
        after paying for ads.
      </div>

      {/* Visual Step-by-Step Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        
        {/* Step 1: Budget & Traffic */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 space-y-1.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Budget & Traffic</span>
              </span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-black text-white font-mono mt-1">
              ~{formatNumber(outputs.expectedTraffic)} <span className="text-xs font-normal text-slate-400">clicks</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            You pay <strong className="text-slate-200">{fmt(inputs.expectedCpc, 2)}</strong> per visitor click from targeted search/social.
          </div>
        </div>

        {/* Step 2: Leads & CVR */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 space-y-1.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Leads & CVR</span>
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-[#00B69B]" />
            </div>
            <div className="text-lg font-black text-white font-mono mt-1">
              ~{formatNumber(outputs.leads, 1)} <span className="text-xs font-normal text-slate-400">leads</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <strong className="text-[#00B69B]">{inputs.landingPageConversionRate}%</strong> of visitors fill out a form or call you (<strong className="text-slate-200">{fmt(outputs.costPerLead, 0)}</strong>/lead).
          </div>
        </div>

        {/* Step 3: Sales Pipeline */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 space-y-1.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Sales Pipeline</span>
              </span>
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-white font-mono mt-1">
              ~{formatNumber(outputs.qualifiedLeads, 1)} <span className="text-xs font-normal text-slate-400">calls</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <strong className="text-slate-200">{inputs.leadQualificationRate}%</strong> of leads are screened and qualify for a call (<strong className="text-slate-200">{fmt(outputs.costPerQualifiedLead, 0)}</strong>/call).
          </div>
        </div>

        {/* Step 4: Revenue & ROAS */}
        <div className="bg-gradient-to-br from-slate-900 to-[#181a30] rounded-xl p-3 border border-[#00B69B]/40 space-y-1.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#00B69B] font-medium">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <span className="w-4 h-4 rounded-full bg-[#00B69B] text-white flex items-center justify-center text-[10px]">4</span>
                <span>Revenue & ROAS</span>
              </span>
              <Trophy className="w-3.5 h-3.5 text-[#C59A27]" />
            </div>
            <div className="text-lg font-black text-[#00B69B] font-mono mt-1">
              ~{formatNumber(outputs.customers, 1)} <span className="text-xs font-normal text-slate-300">clients</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700/60">
            You close <strong className="text-white">{inputs.salesConversionRate}%</strong> of calls. At <strong className="text-white">{fmt(inputs.averageDealSize)}</strong> each = <strong className="text-[#00B69B]">{fmt(outputs.revenue, 0)}</strong>!
          </div>
        </div>

      </div>

      {/* Return On Investment Quick Takeaway */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Bottom Line:</span>
          <span>
            For every <strong className="text-white">{country.currencySymbol}1.00</strong> invested, you make{' '}
            <strong className="text-[#00B69B]">{formatMultiplier(outputs.roas, 2)}</strong> back in gross sales.
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Cost to acquire 1 client (CAC):</span>
          <span className="font-mono font-bold text-white">{fmt(outputs.cac, 0)}</span>
        </div>
      </div>
    </div>
  );
};
