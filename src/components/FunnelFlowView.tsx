import React, { useState } from 'react';
import { 
  DollarSign, 
  MousePointer, 
  Users, 
  Filter, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Percent, 
  ArrowDown,
  Info,
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs, PlatformId } from '../types';
import { getCountry } from '../data/countries';
import { AD_PLATFORMS, getPlatform } from '../data/platforms';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';
import { MetricTooltip } from './MetricTooltip';

interface FunnelFlowViewProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onChangeInput: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
  onSelectPlatform?: (platformId: PlatformId) => void;
  onOpenPlatformModal?: () => void;
  onOpenMethodologyModal?: () => void;
}

export const FunnelFlowView: React.FC<FunnelFlowViewProps> = ({
  inputs,
  outputs,
  onChangeInput,
  onSelectPlatform,
  onOpenPlatformModal,
  onOpenMethodologyModal,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const currentPlatform = getPlatform(inputs.platformId || 'google');
  
  // Collapsible rationale states per stage
  const [openWhyStage1, setOpenWhyStage1] = useState(false);
  const [openWhyStage2, setOpenWhyStage2] = useState(false);
  const [openWhyStage3, setOpenWhyStage3] = useState(false);
  const [openWhyStage4, setOpenWhyStage4] = useState(false);

  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  const handleApplyPlatform = (platformId: PlatformId) => {
    if (onSelectPlatform) {
      onSelectPlatform(platformId);
    } else {
      const plat = getPlatform(platformId);
      const cpc = Number((plat.recommendedDefaults.expectedCpc * country.cpcIndex).toFixed(2));
      onChangeInput('platformId', platformId);
      onChangeInput('channel', plat.name);
      onChangeInput('expectedCpc', Math.max(0.05, cpc));
      onChangeInput('landingPageConversionRate', plat.recommendedDefaults.landingPageConversionRate);
      onChangeInput('leadQualificationRate', plat.recommendedDefaults.leadQualificationRate);
      onChangeInput('salesConversionRate', plat.recommendedDefaults.salesConversionRate);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 4-Step Interactive Visual Journey Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00B69B] text-white flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4-Stage Funnel Flow At A Glance
            </span>
          </div>

          {onOpenMethodologyModal && (
            <button
              type="button"
              onClick={onOpenMethodologyModal}
              className="text-[11px] font-bold text-[#00927C] hover:text-[#007b68] flex items-center gap-1 cursor-pointer bg-[#00B69B]/10 px-2.5 py-1 rounded-full border border-[#00B69B]/30 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>How is this calculated? (See Proof)</span>
            </button>
          )}
        </div>

        {/* Responsive 4-Stage Connected Breadcrumbs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Step 1 Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">1</span>
                <span>Traffic</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{fmt(inputs.monthlyAdSpend)}</span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {formatNumber(outputs.expectedTraffic)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Clicks @ {fmt(inputs.expectedCpc, 2)}
            </div>
          </div>

          {/* Step 2 Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
                <span>Inquiries</span>
              </span>
              <span className="text-[10px] text-[#00927C] font-bold">{inputs.landingPageConversionRate}% CVR</span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {formatNumber(outputs.leads, 1)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Leads @ {fmt(outputs.costPerLead, 0)} CPL
            </div>
          </div>

          {/* Step 3 Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">3</span>
                <span>Sales Calls</span>
              </span>
              <span className="text-[10px] text-slate-600 font-bold">{inputs.leadQualificationRate}% Qual</span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {formatNumber(outputs.qualifiedLeads, 1)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Calls @ {fmt(outputs.costPerQualifiedLead, 0)} CPQL
            </div>
          </div>

          {/* Step 4 Pill */}
          <div className="bg-[#20223A] border border-slate-800 text-white rounded-xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium mb-1">
              <span className="flex items-center gap-1 font-bold text-white">
                <span className="w-4 h-4 rounded-full bg-[#00B69B] text-white flex items-center justify-center text-[10px]">4</span>
                <span>Clients Won</span>
              </span>
              <span className="text-[10px] text-[#C59A27] font-bold">{inputs.salesConversionRate}% Close</span>
            </div>
            <div className="text-lg font-black text-[#00B69B] font-mono">
              {formatNumber(outputs.customers, 1)} <span className="text-xs font-normal text-slate-300">clients</span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              {fmt(outputs.revenue, 0)} ({formatMultiplier(outputs.roas, 1)} ROAS)
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 1: Ad Budget & Visitors */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Stage 1: Ad Budget & Targeted Visitors
                </h3>
                <MetricTooltip metricKey="monthlyAdSpend" />
              </div>
              <p className="text-xs text-slate-500">
                How much you invest per month and the auction cost per click (CPC) on your chosen network
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Stage 1 Output</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {formatNumber(outputs.expectedTraffic)} <span className="text-xs font-medium text-slate-500">Visitors</span>
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          {/* 1A: Monthly Ad Spend */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Monthly Ad Budget</span>
                <span className="text-[11px] text-slate-400 font-normal">({country.currency})</span>
              </label>
              
              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 2500, 5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => onChangeInput('monthlyAdSpend', amt)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      inputs.monthlyAdSpend === amt
                        ? 'bg-[#00B69B] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {amt === 0 ? `${country.currencySymbol}0` : `${country.currencySymbol}${amt >= 1000 ? `${amt / 1000}k` : amt}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  id="spend-slider"
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={inputs.monthlyAdSpend}
                  onChange={(e) => onChangeInput('monthlyAdSpend', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                  <span>{fmt(0)}</span>
                  <span>{fmt(25000)}/mo</span>
                  <span>{fmt(50000)}/mo</span>
                  <span>{fmt(100000)}/mo</span>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    {country.currencySymbol}
                  </span>
                  <input
                    id="spend-number-input"
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.monthlyAdSpend === 0 ? 0 : (inputs.monthlyAdSpend || '')}
                    onChange={(e) => onChangeInput('monthlyAdSpend', Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">/mo</span>
              </div>
            </div>
          </div>

          {/* 1B: Ad Channel Selection & CPC */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Select Advertising Platform</span>
                <span className="text-[11px] text-[#00927C] font-semibold bg-[#00B69B]/10 px-2 py-0.5 rounded border border-[#00B69B]/20">
                  Active: {currentPlatform.name}
                </span>
              </label>

              {onOpenPlatformModal && (
                <button
                  type="button"
                  onClick={onOpenPlatformModal}
                  className="text-[11px] font-bold text-[#00927C] hover:text-[#007b68] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Compare All 6 Channels</span>
                  <span>→</span>
                </button>
              )}
            </div>

            {/* Quick 6-Platform Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
              {AD_PLATFORMS.map((plat) => {
                const isSelected = (inputs.platformId || 'google') === plat.id;
                const platformCpc = Number((plat.recommendedDefaults.expectedCpc * country.cpcIndex).toFixed(2));

                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => handleApplyPlatform(plat.id)}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#20223A] text-white border-[#20223A] shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: plat.brandColor }}
                      />
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#00B69B]' : 'text-slate-500'}`}>
                        {fmt(platformCpc, 2)}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate">
                      {plat.shortName || plat.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Manual CPC Slider */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Custom Cost Per Click (CPC)</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {country.name} typical: <strong>{country.typicalCpcRange}</strong>
                  </span>
                </div>
                <input
                  id="cpc-slider"
                  type="range"
                  min="0.10"
                  max="30.00"
                  step="0.10"
                  value={inputs.expectedCpc}
                  onChange={(e) => onChangeInput('expectedCpc', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    {country.currencySymbol}
                  </span>
                  <input
                    id="cpc-number-input"
                    type="number"
                    min="0.01"
                    max="500"
                    step="0.10"
                    value={inputs.expectedCpc || ''}
                    onChange={(e) => onChangeInput('expectedCpc', Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">/click</span>
              </div>
            </div>
          </div>

        </div>

        {/* Stage 1 Visual Arithmetic Callout */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-[#00927C]" />
            <span>
              <strong>{fmt(inputs.monthlyAdSpend)}</strong> budget ÷ <strong>{fmt(inputs.expectedCpc, 2)}</strong> CPC = <strong>{formatNumber(outputs.expectedTraffic)}</strong> visitors
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => setOpenWhyStage1(!openWhyStage1)}
            className="text-[11px] font-semibold text-[#00927C] hover:text-[#007b68] flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why this click price?</span>
            {openWhyStage1 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Layman Rationale for Stage 1 */}
        {openWhyStage1 && (
          <div className="mt-2.5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-150">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Real-World Ad Auction Reasoning (Stage 1):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Cost per click depends on buyer intent: Google Search costs more because people are typing exactly what they need right now. Meta (Facebook/Instagram) and TikTok cost less because ads are shown as users scroll their feed. You can adjust this slider to match your account's exact historical CPC.
            </p>
          </div>
        )}

      </div>

      {/* FLOW CONNECTOR 1 -> 2 */}
      <div className="flex items-center justify-center -my-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600">
          <ArrowDown className="w-3.5 h-3.5 text-[#00B69B]" />
          <span>Visitors arrive on your landing page</span>
        </div>
      </div>

      {/* STAGE 2: Website Inquiries (Leads) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 flex items-center justify-center font-black text-sm shrink-0">
              2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Stage 2: Website Inquiries & Leads
                </h3>
                <MetricTooltip metricKey="landingPageConversionRate" />
              </div>
              <p className="text-xs text-slate-500">
                Percentage of visitors who fill out your form, request a quote, or call your business
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Stage 2 Output</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {formatNumber(outputs.leads, 1)} <span className="text-xs font-medium text-slate-500">Total Leads</span>
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Landing Page Conversion Rate (CVR)</span>
              </label>

              {/* Quick CVR Benchmarks */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 3.0, 6.0, 8.0, 12.0, 15.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onChangeInput('landingPageConversionRate', rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      inputs.landingPageConversionRate === rate
                        ? 'bg-[#00B69B] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  id="lp-cvr-slider"
                  type="range"
                  min="0"
                  max="30.0"
                  step="0.5"
                  value={inputs.landingPageConversionRate}
                  onChange={(e) => onChangeInput('landingPageConversionRate', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                  <span>0% (Inactive)</span>
                  <span>1-3% (Unoptimized)</span>
                  <span>5-8% (Average)</span>
                  <span>10-15%+ (High Funnel)</span>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <div className="relative w-full">
                  <input
                    id="lp-cvr-number-input"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={inputs.landingPageConversionRate === 0 ? 0 : (inputs.landingPageConversionRate || '')}
                    onChange={(e) => onChangeInput('landingPageConversionRate', Math.max(0, Number(e.target.value)))}
                    className="w-full pl-3 pr-8 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                  />
                  <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">CVR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 2 Visual Arithmetic Callout */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00927C]" />
            <span>
              <strong>{inputs.landingPageConversionRate}%</strong> of {formatNumber(outputs.expectedTraffic)} visitors = <strong>{formatNumber(outputs.leads, 1)}</strong> inquiries (Cost Per Lead: <strong>{fmt(outputs.costPerLead, 2)}</strong>)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpenWhyStage2(!openWhyStage2)}
            className="text-[11px] font-semibold text-[#00927C] hover:text-[#007b68] flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>What's normal?</span>
            {openWhyStage2 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Layman Rationale for Stage 2 */}
        {openWhyStage2 && (
          <div className="mt-2.5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-150">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Conversion Rate Benchmark Reality (Stage 2):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Standard corporate websites with many links convert only 1–3% of visitors. Dedicated landing pages with a clear headline, social proof, and a single form convert 5–10%. High-converting direct response funnels can achieve 12–18%.
            </p>
          </div>
        )}

      </div>

      {/* FLOW CONNECTOR 2 -> 3 */}
      <div className="flex items-center justify-center -my-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600">
          <ArrowDown className="w-3.5 h-3.5 text-[#00B69B]" />
          <span>Leads get filtered for quality & intent</span>
        </div>
      </div>

      {/* STAGE 3: Sales Conversations (Qualification) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Stage 3: Sales Conversations & Discovery Calls
                </h3>
                <MetricTooltip metricKey="leadQualificationRate" />
              </div>
              <p className="text-xs text-slate-500">
                Percentage of inquiries that meet your criteria, have real budget, and book a discovery call
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Stage 3 Output</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {formatNumber(outputs.qualifiedLeads, 1)} <span className="text-xs font-medium text-slate-500">Qualified Calls</span>
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Lead Qualification Rate (Serious Buyers)</span>
              </label>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 30.0, 45.0, 60.0, 75.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onChangeInput('leadQualificationRate', rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      inputs.leadQualificationRate === rate
                        ? 'bg-[#00B69B] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  id="lead-qual-slider"
                  type="range"
                  min="0"
                  max="95.0"
                  step="1.0"
                  value={inputs.leadQualificationRate}
                  onChange={(e) => onChangeInput('leadQualificationRate', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                  <span>0% (Inactive)</span>
                  <span>20% (Broad)</span>
                  <span>45% (Typical B2B)</span>
                  <span>70%+ (Strict)</span>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <div className="relative w-full">
                  <input
                    id="lead-qual-number-input"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={inputs.leadQualificationRate === 0 ? 0 : (inputs.leadQualificationRate || '')}
                    onChange={(e) => onChangeInput('leadQualificationRate', Math.max(0, Number(e.target.value)))}
                    className="w-full pl-3 pr-8 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                  />
                  <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">Qual %</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3 Visual Arithmetic Callout */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#00927C]" />
            <span>
              <strong>{inputs.leadQualificationRate}%</strong> of {formatNumber(outputs.leads, 1)} leads = <strong>{formatNumber(outputs.qualifiedLeads, 1)}</strong> high-intent calls (Cost Per Call: <strong>{fmt(outputs.costPerQualifiedLead, 2)}</strong>)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpenWhyStage3(!openWhyStage3)}
            className="text-[11px] font-semibold text-[#00927C] hover:text-[#007b68] flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why filter leads?</span>
            {openWhyStage3 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Layman Rationale for Stage 3 */}
        {openWhyStage3 && (
          <div className="mt-2.5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-150">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Why We Factor Lead Qualification (Stage 3):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every sales agency knows that 100% of leads do not turn into real sales calls. People make typos in their phone numbers, don't have enough budget, or are outside your geographic service area. Setting a 40–50% qualification rate keeps the sales forecast honest and reliable.
            </p>
          </div>
        )}

      </div>

      {/* FLOW CONNECTOR 3 -> 4 */}
      <div className="flex items-center justify-center -my-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600">
          <ArrowDown className="w-3.5 h-3.5 text-[#00B69B]" />
          <span>Calls convert into paying customers</span>
        </div>
      </div>

      {/* STAGE 4: Closed Clients & Revenue (The Bottom Line) */}
      <div className="bg-white border-2 border-[#00B69B]/40 rounded-2xl p-5 shadow-sm transition-all">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Stage 4: Closed Deals, Revenue & Return
                </h3>
                <MetricTooltip metricKey="customers" />
              </div>
              <p className="text-xs text-slate-500">
                Your sales win rate and average deal size to calculate final revenue, CAC, and return
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-[#00927C] uppercase tracking-wider block">Final Output</span>
            <span className="text-base font-black font-mono text-[#00B69B]">
              {formatNumber(outputs.customers, 1)} <span className="text-xs font-bold text-slate-700">Paying Clients</span>
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          {/* 4A: Sales Close Rate */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Sales Win / Close Rate (%)</span>
              </label>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 15.0, 20.0, 25.0, 35.0, 50.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onChangeInput('salesConversionRate', rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      inputs.salesConversionRate === rate
                        ? 'bg-[#00B69B] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  id="sales-close-slider"
                  type="range"
                  min="0"
                  max="70.0"
                  step="1.0"
                  value={inputs.salesConversionRate}
                  onChange={(e) => onChangeInput('salesConversionRate', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                  <span>0% (Inactive)</span>
                  <span>10% (Cold)</span>
                  <span>25% (Standard)</span>
                  <span>40%+ (Warm)</span>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <div className="relative w-full">
                  <input
                    id="sales-close-number-input"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={inputs.salesConversionRate === 0 ? 0 : (inputs.salesConversionRate || '')}
                    onChange={(e) => onChangeInput('salesConversionRate', Math.max(0, Number(e.target.value)))}
                    className="w-full pl-3 pr-8 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                  />
                  <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">Close %</span>
              </div>
            </div>
          </div>

          {/* 4B: Average Deal Size / Price */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Average Deal Size / Price Per Client</span>
                <span className="text-[11px] text-slate-400 font-normal">({country.currency})</span>
              </label>

              {/* Quick Deal Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 1000, 2500, 4500, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => onChangeInput('averageDealSize', amt)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      inputs.averageDealSize === amt
                        ? 'bg-[#00B69B] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {amt === 0 ? `${country.currencySymbol}0` : `${country.currencySymbol}${amt >= 1000 ? `${amt / 1000}k` : amt}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  id="deal-size-slider"
                  type="range"
                  min="0"
                  max="50000"
                  step="250"
                  value={inputs.averageDealSize}
                  onChange={(e) => onChangeInput('averageDealSize', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                  <span>{country.currencySymbol}0</span>
                  <span>{country.currencySymbol}10k</span>
                  <span>{country.currencySymbol}25k</span>
                  <span>{country.currencySymbol}50k</span>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    {country.currencySymbol}
                  </span>
                  <input
                    id="deal-size-number-input"
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.averageDealSize === 0 ? 0 : (inputs.averageDealSize || '')}
                    onChange={(e) => onChangeInput('averageDealSize', Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">/client</span>
              </div>
            </div>
          </div>

        </div>

        {/* Stage 4 Final Financial Summary Card */}
        <div className="mt-5 p-4 bg-[#20223A] text-white rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-700/80 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <Award className="w-4 h-4 text-[#00B69B]" />
              <span>Bottom-Line Financial Performance</span>
            </span>
            <span className="text-[11px] font-mono text-[#C59A27] font-bold">
              {formatMultiplier(outputs.roas, 2)} ROAS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">New Clients</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {formatNumber(outputs.customers, 1)}
              </div>
              <div className="text-[10px] text-slate-400">won / mo</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Cost Per Client (CAC)</div>
              <div className="text-base font-bold font-mono text-[#00B69B] mt-0.5">
                {fmt(outputs.cac, 0)}
              </div>
              <div className="text-[10px] text-slate-400">to win 1 client</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Gross Revenue</div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {fmt(outputs.revenue, 0)}
              </div>
              <div className="text-[10px] text-slate-400">projected sales</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Ad Profit</div>
              <div className={`text-base font-bold font-mono mt-0.5 ${outputs.netProfit >= 0 ? 'text-[#00B69B]' : 'text-rose-400'}`}>
                {fmt(outputs.netProfit, 0)}
              </div>
              <div className="text-[10px] text-slate-400">after ad spend</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
