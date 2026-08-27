import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Percent, 
  ArrowUpRight, 
  CheckCircle,
  AlertTriangle,
  Flame,
  Scale,
  Globe,
  ArrowRight,
  Zap,
  Sparkles,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Calculator
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs, PlatformId } from '../types';
import { getCountry, COUNTRIES } from '../data/countries';
import { AD_PLATFORMS, getPlatform, calculatePlatformFunnel } from '../data/platforms';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';
import { MetricTooltip } from './MetricTooltip';

interface SummaryMetricsGridProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onChangeInput: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
  onOpenCountryModal?: () => void;
  onSelectCountry?: (countryCode: string) => void;
  onOpenPlatformModal?: () => void;
  onSelectPlatform?: (platformId: PlatformId) => void;
  onOpenMethodologyModal?: () => void;
}

export const SummaryMetricsGrid: React.FC<SummaryMetricsGridProps> = ({
  inputs,
  outputs,
  onChangeInput,
  onOpenCountryModal,
  onSelectCountry,
  onOpenPlatformModal,
  onSelectPlatform,
  onOpenMethodologyModal,
}) => {
  const currentCountry = getCountry(inputs.countryCode || 'US');
  const currentPlatform = getPlatform(inputs.platformId || 'google');
  const [showMathProof, setShowMathProof] = useState(false);

  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, currentCountry.currency, currentCountry.locale);

  const isProfitable = outputs.netProfit > 0;
  const isGreatRoas = outputs.roas >= 3.0;

  // CAC to Deal Size ratio
  const cacPercentage = inputs.averageDealSize > 0 
    ? Math.min(100, Math.round((outputs.cac / inputs.averageDealSize) * 100))
    : 0;

  return (
    <div className="space-y-4">
      
      {/* 1. Plain English Executive Result Story Box */}
      <div className="bg-[#20223A] text-white rounded-2xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00B69B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              The Plain English Bottom Line
            </h3>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            inputs.monthlyAdSpend === 0
              ? 'bg-slate-700/60 text-slate-300 border border-slate-600'
              : isProfitable 
                ? 'bg-[#00B69B]/20 text-[#00B69B] border border-[#00B69B]/40' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {inputs.monthlyAdSpend === 0 ? 'Ready to Model (Spend $0)' : isProfitable ? 'Profitable Campaign' : 'Needs Optimization'}
          </span>
        </div>

        {/* Big Narrative Explanation */}
        {inputs.monthlyAdSpend === 0 ? (
          <p className="text-sm text-slate-200 leading-relaxed">
            Enter your monthly ad spend in <strong className="text-[#00B69B]">Stage 1</strong> or select an ad platform to project website visitors, inquiries, qualified sales calls, and revenue.
          </p>
        ) : (
          <p className="text-sm text-slate-200 leading-relaxed">
            For every <strong className="text-white">{countryCurrencyUnit(currentCountry.currencySymbol)}1.00</strong> you spend on ads, you generate <strong className="text-[#00B69B]">{fmt(outputs.roas, 2).replace(currentCountry.currencySymbol, '')}</strong> in gross revenue.
          </p>
        )}

        <div className="mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Monthly Investment:</span>
            <span className="font-mono font-bold text-white">{fmt(inputs.monthlyAdSpend)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Expected Client Revenue:</span>
            <span className="font-mono font-bold text-[#00B69B]">{fmt(outputs.revenue, 0)}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span className="text-slate-200 font-bold">Net Profit After Ads:</span>
            <span className={`font-mono font-bold ${isProfitable ? 'text-[#00B69B]' : 'text-rose-400'}`}>
              {outputs.netProfit >= 0 ? '+' : ''}{fmt(outputs.netProfit, 0)}
            </span>
          </div>
        </div>

        {/* Inline Math Proof Toggle */}
        <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowMathProof(!showMathProof)}
            className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Calculator className="w-3.5 h-3.5 text-[#00B69B]" />
            <span>{showMathProof ? 'Hide step-by-step math' : 'Show step-by-step arithmetic proof'}</span>
            {showMathProof ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {onOpenMethodologyModal && (
            <button
              type="button"
              onClick={onOpenMethodologyModal}
              className="text-[#00B69B] hover:text-[#00d4b5] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Why is this reliable?</span>
            </button>
          )}
        </div>

        {/* Expanded Mathematical Arithmetic Breakdown */}
        {showMathProof && (
          <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1.5 animate-in fade-in duration-150">
            <div className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider mb-1">
              Exact Arithmetic Chain (100% Deterministic):
            </div>
            <div className="flex justify-between text-slate-400">
              <span>1. Visitors:</span>
              <span className="text-slate-200">{fmt(inputs.monthlyAdSpend)} ÷ {fmt(inputs.expectedCpc, 2)} = <strong>{formatNumber(outputs.expectedTraffic)}</strong></span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>2. Leads:</span>
              <span className="text-slate-200">{formatNumber(outputs.expectedTraffic)} × {inputs.landingPageConversionRate}% = <strong>{formatNumber(outputs.leads, 1)}</strong></span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>3. Qualified Calls:</span>
              <span className="text-slate-200">{formatNumber(outputs.leads, 1)} × {inputs.leadQualificationRate}% = <strong>{formatNumber(outputs.qualifiedLeads, 1)}</strong></span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>4. Closed Clients:</span>
              <span className="text-slate-200">{formatNumber(outputs.qualifiedLeads, 1)} × {inputs.salesConversionRate}% = <strong>{formatNumber(outputs.customers, 1)}</strong></span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-[#00B69B] font-bold">
              <span>5. Gross Revenue:</span>
              <span>{formatNumber(outputs.customers, 1)} × {fmt(inputs.averageDealSize)} = {fmt(outputs.revenue, 0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Key Scorecard Metrics (4 Clean Cards) */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Gross Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Gross Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {fmt(outputs.revenue, 0)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {formatNumber(outputs.customers, 1)} clients × {fmt(inputs.averageDealSize)}
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Net Ad Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className={`text-xl font-bold font-mono mt-1 ${isProfitable ? 'text-[#00927C]' : 'text-rose-600'}`}>
            {outputs.netProfit >= 0 ? '+' : ''}{fmt(outputs.netProfit, 0)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Revenue minus ad spend
          </div>
        </div>

        {/* ROAS Multiplier */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Return On Spend (ROAS)</span>
            <Target className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[#00927C] mt-1">
            {formatMultiplier(outputs.roas, 2)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {formatPercent(outputs.roasPercentage, 0)} Return
          </div>
        </div>

        {/* Cost Per Client (CAC) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Cost To Acquire 1 Client</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {fmt(outputs.cac, 0)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Break-even max: {fmt(inputs.averageDealSize)}
          </div>
        </div>

      </div>

      {/* 3. Customer Acquisition Cushion Bar (Very intuitive for laymen) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
          <span>Customer Acquisition Margin</span>
          <span className="font-mono text-[#00927C]">{100 - cacPercentage}% Profit Margin</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden flex">
          <div 
            className="bg-[#20223A] h-full transition-all duration-300"
            style={{ width: `${Math.max(5, Math.min(100, cacPercentage))}%` }}
            title={`CAC is ${fmt(outputs.cac, 0)} (${cacPercentage}% of deal size)`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#20223A]" />
            <span>Ad Cost to win client: <strong>{fmt(outputs.cac, 0)}</strong> ({cacPercentage}%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Client Value: <strong>{fmt(inputs.averageDealSize)}</strong></span>
          </span>
        </div>
      </div>

    </div>
  );
};

function countryCurrencyUnit(symbol: string): string {
  return symbol || '$';
}
