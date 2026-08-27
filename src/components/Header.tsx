import React, { useState } from 'react';
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
  Globe,
  Radio,
  Download,
  Check,
  Link2,
  ShieldCheck
} from 'lucide-react';
import { INDUSTRY_BENCHMARKS, getBenchmarkCategories } from '../data/benchmarks';
import { COUNTRIES, getCountry } from '../data/countries';
import { AD_PLATFORMS, getPlatform } from '../data/platforms';
import { FunnelInputs, CountryConfig, PlatformId } from '../types';
import { copyShareableLink } from '../utils/urlState';
import { GHLArmyLogo } from './GHLArmyLogo';

interface HeaderProps {
  inputs: FunnelInputs;
  onSelectPreset: (presetId: string) => void;
  onSelectCountry: (countryCode: string) => void;
  onOpenCountryModal: () => void;
  onSelectPlatform: (platformId: PlatformId) => void;
  onOpenPlatformModal: () => void;
  onReset: () => void;
  onOpenMethodologyModal?: () => void;
  onOpenPitchModal: () => void;
  onOpenBenchmarkModal: () => void;
  onToggleGoalSeeker: () => void;
  isGoalSeekerOpen: boolean;
  onToggleScenarios: () => void;
  isScenariosOpen: boolean;
  onUpdateClientName: (name: string) => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputs,
  onSelectPreset,
  onSelectCountry,
  onOpenCountryModal,
  onSelectPlatform,
  onOpenPlatformModal,
  onReset,
  onOpenMethodologyModal,
  onOpenPitchModal,
  onOpenBenchmarkModal,
  onToggleGoalSeeker,
  isGoalSeekerOpen,
  onToggleScenarios,
  isScenariosOpen,
  onUpdateClientName,
  onExportCsv,
}) => {
  const [isExported, setIsExported] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const currentCountry = getCountry(inputs.countryCode || 'US');
  const currentPlatform = getPlatform(inputs.platformId || 'google');

  const handleExport = () => {
    onExportCsv();
    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
  };

  const handleCopyShareLink = async () => {
    const success = await copyShareableLink(inputs);
    if (success) {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Brand & Client context */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
              <GHLArmyLogo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Paid Media Growth Calculator
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30">
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
                <span className="font-medium text-slate-600">Prospect:</span>
                <input
                  id="client-name-input"
                  type="text"
                  value={inputs.clientName || ''}
                  onChange={(e) => onUpdateClientName(e.target.value)}
                  placeholder="e.g. Acme Corp / Dr. Miller"
                  className="px-2.5 py-0.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#00B69B] focus:ring-1 focus:ring-[#00B69B] rounded-md text-xs font-medium text-slate-800 focus:outline-none transition-colors w-44"
                />
              </div>
            </div>
          </div>

          {/* Action Tools & Presets */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Ad Platform Selector Dropdown */}
            <div className="relative flex items-center">
              <span 
                className="w-2.5 h-2.5 rounded-full absolute left-2.5 pointer-events-none"
                style={{ backgroundColor: getPlatform(inputs.platformId || 'google').brandColor }}
              />
              <select
                id="platform-select-header"
                value={inputs.platformId || 'google'}
                onChange={(e) => onSelectPlatform(e.target.value as PlatformId)}
                className="pl-7 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B69B] focus:border-[#00B69B] transition-colors cursor-pointer appearance-none"
                title="Select Advertising Platform"
              >
                {AD_PLATFORMS.map((plat) => (
                  <option key={plat.id} value={plat.id}>
                    {plat.name} ({plat.shortName})
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Ad Platform Estimations Matrix Modal Button */}
            <button
              id="ad-platforms-matrix-btn"
              type="button"
              onClick={onOpenPlatformModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-colors cursor-pointer shadow-2xs"
              title="Compare authentic estimations for Meta, Google, LinkedIn, Twitter, Snapchat, TikTok"
            >
              <span className="w-2 h-2 rounded-full bg-[#00B69B] animate-pulse" />
              <span>Compare (6)</span>
            </button>

            {/* Country / Market Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                id="country-market-select"
                value={inputs.countryCode || 'US'}
                onChange={(e) => onSelectCountry(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B69B] focus:border-[#00B69B] transition-colors cursor-pointer appearance-none"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
              title="Compare performance across all global country markets"
            >
              <Globe className="w-3.5 h-3.5 text-[#00B69B]" />
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
                className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B69B] focus:border-[#00B69B] transition-colors cursor-pointer appearance-none max-w-[200px] truncate"
                title="Select benchmark preset from 50+ specialized industries"
              >
                <option value="custom" disabled>Select Industry ({INDUSTRY_BENCHMARKS.length})</option>
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
              <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Reverse Engineer Goal Seeker Button */}
            <button
              id="goal-seeker-toggle-btn"
              onClick={onToggleGoalSeeker}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isGoalSeekerOpen
                  ? 'bg-[#00B69B] text-white shadow-xs'
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isScenariosOpen
                  ? 'bg-[#20223A] text-white shadow-xs'
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

            {/* Why This Is Reliable / Methodology Proof */}
            {onOpenMethodologyModal && (
              <button
                id="methodology-proof-btn"
                type="button"
                onClick={onOpenMethodologyModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00B69B]/10 hover:bg-[#00B69B]/20 text-[#00927C] border border-[#00B69B]/30 transition-colors cursor-pointer"
                title="See why these numbers are reliable, formulas, proof, and data sources"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00B69B]" />
                <span>Why It's Reliable</span>
              </button>
            )}

            {/* Share / Copy Model Link Button */}
            <button
              id="share-link-btn"
              type="button"
              onClick={handleCopyShareLink}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isLinkCopied
                  ? 'bg-[#00B69B] text-white border-[#00B69B] shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Copy link with encoded inputs to share this model configuration with your team"
            >
              {isLinkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share Model</span>
                </>
              )}
            </button>

            {/* Export Funnel to CSV Button */}
            <button
              id="export-csv-btn"
              type="button"
              onClick={handleExport}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isExported
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
              title="Download full funnel model, 6-network matrix, and 3-scenario projections as a CSV file for client sales reports"
            >
              {isExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Export CSV</span>
                </>
              )}
            </button>

            {/* Client Pitch Modal */}
            <button
              id="pitch-modal-btn"
              onClick={onOpenPitchModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#00B69B] hover:bg-[#009e86] text-white shadow-xs transition-colors cursor-pointer"
              title="Generate client-ready pitch summary and proposal copy"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-100" />
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

