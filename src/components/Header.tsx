import React, { useState } from 'react';
import { 
  RotateCcw, 
  Share2, 
  BookOpen, 
  Building2,
  Globe,
  Download,
  Check,
  Link2,
  ShieldCheck,
  Sparkles,
  FileText
} from 'lucide-react';
import { INDUSTRY_BENCHMARKS, getBenchmarkCategories, findBenchmark } from '../data/benchmarks';
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
  onSelectPlatform: (platformId: PlatformId | string) => void;
  onOpenPlatformModal: () => void;
  onReset: () => void;
  onOpenMethodologyModal?: () => void;
  onOpenPitchModal: () => void;
  onOpenBenchmarkModal: () => void;
  onOpenQuickStartTour?: () => void;
  onOpenPdfModal?: () => void;
  onToggleGoalSeeker?: () => void;
  isGoalSeekerOpen?: boolean;
  onToggleScenarios?: () => void;
  isScenariosOpen?: boolean;
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
  onOpenQuickStartTour,
  onOpenPdfModal,
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
  const currentPlatform = inputs.platformId ? getPlatform(inputs.platformId) : null;

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
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
          {/* Brand & Client context */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
              <GHLArmyLogo size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Paid Media Growth Calculator
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 whitespace-nowrap">
                  Sales Enablement
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-600 text-[11px] whitespace-nowrap">Prospect:</span>
                <input
                  id="client-name-input"
                  type="text"
                  value={inputs.clientName || ''}
                  onChange={(e) => onUpdateClientName(e.target.value)}
                  placeholder="e.g. Acme Corp / Dr. Miller"
                  className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#00B69B] focus:ring-1 focus:ring-[#00B69B] rounded-md text-xs font-medium text-slate-800 focus:outline-none transition-colors w-40"
                />
              </div>
            </div>
          </div>

          {/* Action Tools & Presets */}
          <div className="flex items-center flex-wrap gap-1.5 justify-start lg:justify-end">
            
            {/* Ad Platform Selector Dropdown */}
            <div className="relative flex items-center h-8">
              <span 
                className="w-2.5 h-2.5 rounded-full absolute left-2.5 pointer-events-none"
                style={{ 
                  backgroundColor: inputs.platformId ? getPlatform(inputs.platformId).brandColor : '#F59E0B' 
                }}
              />
              <select
                id="platform-select-header"
                value={inputs.platformId || 'none'}
                onChange={(e) => onSelectPlatform(e.target.value as PlatformId)}
                className={`pl-7 pr-6 h-8 text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B69B] transition-all cursor-pointer appearance-none max-w-[150px] truncate ${
                  inputs.platformId 
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200' 
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-400 font-bold shadow-xs'
                }`}
                title="Select Advertising Platform"
              >
                <option value="none">⚠️ Platform (Req.)</option>
                {AD_PLATFORMS.map((plat) => (
                  <option key={plat.id} value={plat.id}>
                    {plat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Industry Preset Selector */}
            <div className="relative flex items-center h-8">
              <Building2 className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none ${inputs.industry ? 'text-slate-400' : 'text-amber-600'}`} />
              <select
                id="industry-preset-select"
                value={findBenchmark(inputs.industry)?.id || 'none'}
                onChange={(e) => onSelectPreset(e.target.value)}
                className={`pl-8 pr-6 h-8 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B69B] transition-all cursor-pointer appearance-none max-w-[170px] truncate ${
                  inputs.industry
                    ? 'bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 border border-slate-200'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-400 font-bold shadow-xs'
                }`}
                title="Select benchmark preset from 60+ specialized industries"
              >
                <option value="none">⚠️ Industry (Req.)</option>
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
              <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Country / Market Selector */}
            <div className="relative flex items-center h-8">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                id="country-market-select"
                value={inputs.countryCode || 'US'}
                onChange={(e) => onSelectCountry(e.target.value)}
                className="pl-7 pr-6 h-8 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B69B] focus:border-[#00B69B] transition-colors cursor-pointer appearance-none max-w-[125px] truncate"
                title="Select target country / market"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.currency})
                  </option>
                ))}
              </select>
              <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Ad Platform Estimations Matrix Modal Button */}
            <button
              id="ad-platforms-matrix-btn"
              type="button"
              onClick={onOpenPlatformModal}
              className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              title="Compare authentic platform estimations for Google, Meta, LinkedIn, X, Snapchat & TikTok"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B69B] animate-pulse" />
              <span>Compare (6)</span>
            </button>

            {/* Quick Start Tour Button */}
            {onOpenQuickStartTour && (
              <button
                id="quick-start-tour-btn"
                type="button"
                onClick={onOpenQuickStartTour}
                className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 transition-colors cursor-pointer whitespace-nowrap"
                title="Open 3-step Quick Start guide on driving sales conversations"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Tour</span>
              </button>
            )}

            {/* Share / Copy Model Link Button */}
            <button
              id="share-link-btn"
              type="button"
              onClick={handleCopyShareLink}
              className={`inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                isLinkCopied
                  ? 'bg-[#00B69B] text-white border-[#00B69B] shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Copy link to share model"
            >
              {isLinkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Download PDF Report Button */}
            {onOpenPdfModal && (
              <button
                id="header-download-pdf-btn"
                type="button"
                onClick={onOpenPdfModal}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-bold bg-[#20223A] hover:bg-[#2c2f4f] text-white border border-slate-700 shadow-xs transition-all cursor-pointer whitespace-nowrap group"
                title="Generate clean, printable PDF report and executive summary for client presentations"
              >
                <FileText className="w-3.5 h-3.5 text-[#00B69B] group-hover:scale-110 transition-transform" />
                <span>PDF Report</span>
              </button>
            )}

            {/* Export Funnel to CSV Button */}
            <button
              id="export-csv-btn"
              type="button"
              onClick={handleExport}
              className={`inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                isExported
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
              title="Download CSV"
            >
              {isExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>CSV</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>CSV</span>
                </>
              )}
            </button>

            {/* Client Pitch Modal */}
            <button
              id="pitch-modal-btn"
              onClick={onOpenPitchModal}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold bg-[#00B69B] hover:bg-[#009e86] text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              title="Generate client-ready pitch summary and proposal copy"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-100" />
              <span>Pitch Deck</span>
            </button>

            {/* Reset */}
            <button
              id="reset-calculator-btn"
              onClick={onReset}
              className="p-1.5 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
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

