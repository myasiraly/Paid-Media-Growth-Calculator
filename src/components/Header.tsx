import React from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  Share2, 
  Target, 
  BookOpen, 
  Layers,
  Building2,
  Globe
} from 'lucide-react';
import { INDUSTRY_BENCHMARKS } from '../data/benchmarks';
import { COUNTRIES, getCountry } from '../data/countries';
import { AD_PLATFORMS, getPlatform } from '../data/platforms';
import { FunnelInputs, CountryConfig, PlatformId } from '../types';

interface HeaderProps {
  inputs: FunnelInputs;
  onSelectPreset: (presetId: string) => void;
  onSelectCountry: (countryCode: string) => void;
  onOpenCountryModal: () => void;
  onSelectPlatform: (platformId: PlatformId) => void;
  onOpenPlatformModal: () => void;
  onReset: () => void;
  onOpenPitchModal: () => void;
  onOpenBenchmarkModal: () => void;
  onToggleGoalSeeker: () => void;
  isGoalSeekerOpen: boolean;
  onToggleScenarios: () => void;
  isScenariosOpen: boolean;
  onUpdateClientName: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputs,
  onSelectPreset,
  onSelectCountry,
  onOpenCountryModal,
  onSelectPlatform,
  onOpenPlatformModal,
  onReset,
  onOpenPitchModal,
  onOpenBenchmarkModal,
  onToggleGoalSeeker,
  isGoalSeekerOpen,
  onToggleScenarios,
  isScenariosOpen,
  onUpdateClientName,
}) => {
  const currentCountry = getCountry(inputs.countryCode || 'US');
  const currentPlatform = getPlatform(inputs.platformId || 'google');

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Brand & Client context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shadow-xs shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Paid Media Growth Calculator
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Sales Enablement
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span>{currentCountry.flag}</span>
                  <span>{currentCountry.currency}</span>
                </span>
                <span 
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-2xs cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={onOpenPlatformModal}
                  title="Click to compare authentic platform estimations"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentPlatform.brandColor }} />
                  <span>{currentPlatform.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span>Prospect:</span>
                <input
                  id="client-name-input"
                  type="text"
                  value={inputs.clientName || ''}
                  onChange={(e) => onUpdateClientName(e.target.value)}
                  placeholder="e.g. Acme Corp / Dr. Miller"
                  className="px-2.5 py-0.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-xs font-medium text-slate-800 focus:outline-none transition-colors w-44"
                />
              </div>
            </div>
          </div>

          {/* Action Tools & Presets */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Ad Platform Estimations Matrix Modal Button */}
            <button
              id="ad-platforms-matrix-btn"
              type="button"
              onClick={onOpenPlatformModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition-colors cursor-pointer"
              title="Compare authentic estimations for Meta, Google, LinkedIn, Twitter, Snapchat, TikTok"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Ad Channels (6)</span>
            </button>

            {/* Country / Market Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                id="country-market-select"
                value={inputs.countryCode || 'US'}
                onChange={(e) => onSelectCountry(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                title="Select target country / market"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Country Matrix Comparison Modal Button */}
            <button
              id="country-matrix-btn"
              type="button"
              onClick={onOpenCountryModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer"
              title="Compare performance across all global country markets"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Countries</span>
            </button>

            {/* Industry Preset Selector */}
            <div className="relative flex items-center">
              <Building2 className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                id="industry-preset-select"
                value={
                  INDUSTRY_BENCHMARKS.find((b) => b.name === inputs.industry)?.id ||
                  'custom'
                }
                onChange={(e) => onSelectPreset(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="custom" disabled>Select Benchmark Preset</option>
                {INDUSTRY_BENCHMARKS.map((benchmark) => (
                  <option key={benchmark.id} value={benchmark.id}>
                    {benchmark.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Reverse Engineer Goal Seeker Button */}
            <button
              id="goal-seeker-toggle-btn"
              onClick={onToggleGoalSeeker}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isGoalSeekerOpen
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Reverse engineer required ad spend from a target revenue or customer goal"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Goal Target</span>
            </button>

            {/* Scenarios Comparison Button */}
            <button
              id="scenarios-toggle-btn"
              onClick={onToggleScenarios}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isScenariosOpen
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Compare Conservative, Realistic, and Aggressive campaign scenarios"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3 Scenarios</span>
            </button>

            {/* Industry Benchmarks Guide */}
            <button
              id="benchmark-guide-btn"
              onClick={onOpenBenchmarkModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="View industry benchmark reference sheet"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Benchmarks</span>
            </button>

            {/* Client Pitch Modal */}
            <button
              id="pitch-modal-btn"
              onClick={onOpenPitchModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Generate client-ready pitch summary and proposal copy"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-100" />
              <span>Pitch Summary</span>
            </button>

            {/* Reset */}
            <button
              id="reset-calculator-btn"
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset to default values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

