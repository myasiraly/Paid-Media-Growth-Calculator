import React, { useState } from 'react';
import { 
  Building2, 
  Radio, 
  DollarSign, 
  Sliders, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  HelpCircle,
  TrendingUp,
  Target,
  Users,
  AlertCircle
} from 'lucide-react';
import { FunnelInputs, PlatformId } from '../types';
import { getCountry } from '../data/countries';
import { AD_PLATFORMS, getPlatform } from '../data/platforms';
import { INDUSTRY_BENCHMARKS, getBenchmarkCategories, findBenchmark } from '../data/benchmarks';
import { formatCurrency, calculateRequiredSpend } from '../utils/calculations';

interface SimpleStepSetupProps {
  inputs: FunnelInputs;
  onChangeInput: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
  onSelectPlatform: (platformId: PlatformId) => void;
  onSelectPreset: (presetId: string) => void;
  onOpenBenchmarkModal: () => void;
  onOpenPlatformModal: () => void;
  viewMode: 'simple' | 'expert';
  onToggleViewMode: (mode: 'simple' | 'expert') => void;
}

export const SimpleStepSetup: React.FC<SimpleStepSetupProps> = ({
  inputs,
  onChangeInput,
  onSelectPlatform,
  onSelectPreset,
  onOpenBenchmarkModal,
  onOpenPlatformModal,
  viewMode,
  onToggleViewMode,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const fmt = (val: number, precision: number = 0) =>
    formatCurrency(val, precision, country.currency, country.locale);

  // Popular high-frequency starter industries with verified matching benchmark IDs
  const popularIndustries = [
    { id: 'hvac-services', label: 'HVAC & Trades', icon: '🔧' },
    { id: 'dental-care', label: 'Dental & Medical', icon: '🦷' },
    { id: 'legal-services', label: 'Legal Services', icon: '⚖️' },
    { id: 'real-estate', label: 'Real Estate', icon: '🏡' },
    { id: 'saas-b2b-tech', label: 'SaaS / B2B Tech', icon: '💻' },
    { id: 'apparel-fashion', label: 'E-Commerce / Retail', icon: '🛍️' },
  ];

  const currentBenchmark = findBenchmark(inputs.industry);
  const currentBenchmarkId = currentBenchmark?.id || 'none';
  const isIndustrySelected = Boolean(inputs.industry && inputs.industry.trim() !== '');
  const isPlatformSelected = Boolean(inputs.platformId);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
      
      {/* Top Banner: Header + Simple vs Expert Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00B69B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Guided 3-Step Setup
                </h2>
                {(!isIndustrySelected || !isPlatformSelected) && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    Step 1 & 2 Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Choose your industry and ad platform to instantly calculate expected inquiries and revenue
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Simple vs Expert */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onToggleViewMode('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'simple'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00B69B]" />
            <span>Simple View</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleViewMode('expert')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'expert'
                ? 'bg-[#20223A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#00B69B]" />
            <span>Expert Tuner</span>
          </button>
        </div>
      </div>

      {/* 3 Step Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        
        {/* Step 1: Industry / Business (MANDATORY) */}
        <div className={`rounded-xl p-4 flex flex-col justify-between transition-all border ${
          !isIndustrySelected 
            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/50' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isIndustrySelected ? 'bg-[#00B69B]' : 'bg-amber-600'
                }`}>
                  1
                </span>
                <span>Your Industry</span>
              </div>
              {isIndustrySelected ? (
                <span className="text-[10px] text-[#00927C] bg-[#00B69B]/10 font-bold px-2 py-0.5 rounded-full border border-[#00B69B]/30 flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" />
                  <span>Selected</span>
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 bg-amber-200/80 font-bold px-2 py-0.5 rounded-full animate-pulse shrink-0">
                  *Required
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Sets verified industry CPCs, lead rates & deal sizes.
            </p>

            {/* Quick Industry Chips */}
            <div className="grid grid-cols-2 gap-1.5">
              {popularIndustries.map((ind) => {
                const targetBench = findBenchmark(ind.id);
                const isSelected = isIndustrySelected && (
                  currentBenchmarkId === ind.id ||
                  (targetBench && inputs.industry.toLowerCase() === targetBench.name.toLowerCase())
                );

                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => onSelectPreset(ind.id)}
                    className={`px-2 py-1.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#00B69B] text-white border-[#00B69B] shadow-2xs font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title={`Select ${ind.label}`}
                  >
                    <span className="text-xs shrink-0">{ind.icon}</span>
                    <span className="truncate text-[11px]">{ind.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Full Industry Dropdown */}
            <select
              id="simple-industry-select"
              value={currentBenchmarkId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B69B] cursor-pointer"
            >
              <option value="none">-- Or select from 60+ industries --</option>
              {getBenchmarkCategories().map((cat) => (
                <optgroup key={cat} label={cat}>
                  {INDUSTRY_BENCHMARKS.filter((b) => b.category === cat).map((benchmark) => (
                    <option key={benchmark.id} value={benchmark.id}>
                      {benchmark.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenBenchmarkModal}
            className="text-xs text-[#00927C] hover:underline font-bold flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/80 cursor-pointer h-7"
          >
            <span>Browse all 60+ industry profiles</span>
            <span>→</span>
          </button>
        </div>

        {/* Step 2: Ad Platform (MANDATORY) */}
        <div className={`rounded-xl p-4 flex flex-col justify-between transition-all border ${
          !isPlatformSelected 
            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/50' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isPlatformSelected ? 'bg-[#00B69B]' : 'bg-amber-600'
                }`}>
                  2
                </span>
                <span>Ad Platform</span>
              </div>
              {isPlatformSelected ? (
                <span className="text-[10px] text-[#00927C] bg-[#00B69B]/10 font-bold px-2 py-0.5 rounded-full border border-[#00B69B]/30 flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" />
                  <span>Selected</span>
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 bg-amber-200/80 font-bold px-2 py-0.5 rounded-full animate-pulse shrink-0">
                  *Required
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Select where ads run (Search vs Social vs B2B intent).
            </p>

            {/* Platform Selection Cards */}
            <div className="grid grid-cols-2 gap-1.5">
              {AD_PLATFORMS.map((plat) => {
                const isSelected = inputs.platformId === plat.id;
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => onSelectPlatform(plat.id)}
                    className={`p-2 rounded-lg text-left text-xs transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#20223A] text-white border-[#20223A] shadow-2xs font-bold ring-2 ring-[#00B69B]'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: plat.brandColor }}
                      />
                      <span className="font-bold truncate text-[11px]">{plat.name}</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plat.shortName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPlatformModal}
            className="text-xs text-[#00927C] hover:underline font-bold flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/80 cursor-pointer h-7"
          >
            <span>Compare all 6 platforms side-by-side</span>
            <span>→</span>
          </button>
        </div>

        {/* Step 3: Budget & Deal Size */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#00B69B] text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                <span>Budget & Deal Size</span>
              </div>
              <span className="text-xs font-mono text-[#00927C] font-bold">
                {fmt(inputs.monthlyAdSpend)}/mo
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Set how much you spend and what 1 paying customer is worth.
            </p>

            {/* Monthly Ad Budget Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Monthly Ad Budget</span>
                <span className="font-mono font-bold text-[#00927C]">{fmt(inputs.monthlyAdSpend)}</span>
              </div>
              <input
                id="simple-budget-slider"
                type="range"
                min="500"
                max="50000"
                step="500"
                value={inputs.monthlyAdSpend}
                onChange={(e) => onChangeInput('monthlyAdSpend', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$500</span>
                <span>$10k</span>
                <span>$25k</span>
                <span>$50k</span>
              </div>
            </div>

            {/* Average Deal Value / Customer Value */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Average Customer Value (Deal Size)</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  {country.currencySymbol}
                </span>
                <input
                  id="simple-dealsize-input"
                  type="number"
                  min="50"
                  step="100"
                  value={inputs.averageDealSize || ''}
                  onChange={(e) => onChangeInput('averageDealSize', Math.max(1, Number(e.target.value)))}
                  placeholder="e.g. 2500"
                  className="w-full pl-7 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00B69B] focus:outline-none"
                />
              </div>
            </div>

            {/* Growth Target Goal (Editable Client/Mo Goal) */}
            <div className="pt-2.5 border-t border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Target className="w-3.5 h-3.5 text-[#00B69B]" />
                  <span>Target Clients / Mo:</span>
                </div>
                <span className="text-xs font-bold font-mono text-[#00927C]">
                  {fmt((inputs.targetGoalValue || 10) * (inputs.averageDealSize || 2500), 0)}/mo target
                </span>
              </div>

              {/* Stepper + Presets Row (Flexibly sized to never wrap or squash) */}
              <div className="flex items-center gap-1.5">
                {/* Stepper [ - ] [ 10 ] [ + ] */}
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs shrink-0">
                  <button
                    id="decrease-target-clients-btn"
                    type="button"
                    onClick={() => {
                      const cur = inputs.targetGoalValue || 10;
                      onChangeInput('targetGoalType', 'customers');
                      onChangeInput('targetGoalValue', Math.max(1, cur - 1));
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors border-r border-slate-200 cursor-pointer"
                    title="Decrease target clients"
                  >
                    -
                  </button>
                  <input
                    id="growth-target-clients-input"
                    type="number"
                    min="1"
                    max="500"
                    step="1"
                    value={inputs.targetGoalValue || 10}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                      onChangeInput('targetGoalType', 'customers');
                      onChangeInput('targetGoalValue', val);
                    }}
                    className="w-9 text-center font-mono font-bold text-slate-900 text-xs py-1 focus:outline-none bg-transparent"
                    placeholder="10"
                  />
                  <button
                    id="increase-target-clients-btn"
                    type="button"
                    onClick={() => {
                      const cur = inputs.targetGoalValue || 10;
                      onChangeInput('targetGoalType', 'customers');
                      onChangeInput('targetGoalValue', cur + 1);
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors border-l border-slate-200 cursor-pointer"
                    title="Increase target clients"
                  >
                    +
                  </button>
                </div>

                {/* Presets (5, 10, 20, 50) */}
                <div className="flex items-center gap-1 flex-1">
                  {[5, 10, 20, 50].map((presetVal) => {
                    const isCurrent = (inputs.targetGoalValue || 10) === presetVal;
                    return (
                      <button
                        key={presetVal}
                        type="button"
                        onClick={() => {
                          onChangeInput('targetGoalType', 'customers');
                          onChangeInput('targetGoalValue', presetVal);
                        }}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-md border text-center transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#00B69B] text-white border-[#00B69B] shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title={`Set target to ${presetVal} clients/month`}
                      >
                        {presetVal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick 1-click Auto-set Budget for Target if calculable */}
              {isIndustrySelected && isPlatformSelected && (
                (() => {
                  const targetRev = (inputs.targetGoalValue || 10) * Math.max(1, inputs.averageDealSize || 1);
                  const calc = calculateRequiredSpend(targetRev, inputs);
                  const reqSpend = Math.round(calc.requiredSpend / 50) * 50;
                  const isMatching = Math.abs(inputs.monthlyAdSpend - reqSpend) < 50;

                  if (reqSpend > 0 && !isMatching) {
                    return (
                      <button
                        id="apply-target-spend-btn"
                        type="button"
                        onClick={() => onChangeInput('monthlyAdSpend', reqSpend)}
                        className="w-full py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                        title="Set your monthly budget to the calculated amount needed to hit this target"
                      >
                        <span className="text-[11px] flex items-center gap-1">
                          <span>🎯</span>
                          <span>Set Spend for {inputs.targetGoalValue || 10} clients:</span>
                        </span>
                        <span className="font-mono text-[#00927C] font-black underline shrink-0 ml-1">
                          {fmt(reqSpend)}/mo →
                        </span>
                      </button>
                    );
                  }
                  return null;
                })()
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/80 h-7">
            <span>Instant Live Recalculation</span>
            <span className="text-amber-500 font-bold">⚡ Active</span>
          </div>
        </div>

      </div>

    </div>
  );
};
