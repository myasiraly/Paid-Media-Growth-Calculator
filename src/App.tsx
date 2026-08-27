/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Layers, 
  Share2, 
  BookOpen, 
  HelpCircle,
  BarChart3,
  Sliders,
  DollarSign,
  Users,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs, PlatformId } from './types';
import { calculateFunnel } from './utils/calculations';
import { exportFunnelToCsv } from './utils/exportCsv';
import { decodeInputsFromHash, updateBrowserUrlHash } from './utils/urlState';
import { INDUSTRY_BENCHMARKS } from './data/benchmarks';
import { getCountry, COUNTRIES } from './data/countries';
import { AD_PLATFORMS, getPlatform } from './data/platforms';
import { Header } from './components/Header';
import { FunnelFlowView } from './components/FunnelFlowView';
import { SummaryMetricsGrid } from './components/SummaryMetricsGrid';
import { GoalSeeker } from './components/GoalSeeker';
import { ScenarioComparison } from './components/ScenarioComparison';
import { ClientPitchModal } from './components/ClientPitchModal';
import { BenchmarkReferenceModal } from './components/BenchmarkReferenceModal';
import { CountryComparisonModal } from './components/CountryComparisonModal';
import { AdPlatformComparisonModal } from './components/AdPlatformComparisonModal';
import { MethodologyExplainerModal } from './components/MethodologyExplainerModal';
import { GHLArmyLogo } from './components/GHLArmyLogo';

const DEFAULT_INPUTS: FunnelInputs = {
  monthlyAdSpend: 0,
  expectedCpc: 4.50,
  landingPageConversionRate: 8.0,
  leadQualificationRate: 45.0,
  salesConversionRate: 25.0,
  averageDealSize: 4500,
  grossMarginRate: 80,
  clientName: '',
  industry: 'B2B SaaS & Tech',
  channel: 'Google Ads (Search & PMax)',
  countryCode: 'US',
  platformId: 'google',
};

export default function App() {
  const [inputs, setInputs] = useState<FunnelInputs>(() => {
    // 1. Check URL hash first (for shared team links)
    const fromHash = decodeInputsFromHash();
    if (fromHash && Object.keys(fromHash).length > 0) {
      return { ...DEFAULT_INPUTS, ...fromHash };
    }

    // 2. Default to zero ad spend
    return DEFAULT_INPUTS;
  });

  const [isGoalSeekerOpen, setIsGoalSeekerOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  // Save to local storage and update URL hash on change
  useEffect(() => {
    try {
      localStorage.setItem('paid_media_calc_state', JSON.stringify(inputs));
    } catch {
      // ignore
    }
    updateBrowserUrlHash(inputs);
  }, [inputs]);

  // Listen for browser hash changes (e.g. forward/back button navigation or direct hash edits)
  useEffect(() => {
    const handleHashChange = () => {
      const fromHash = decodeInputsFromHash();
      if (fromHash && Object.keys(fromHash).length > 0) {
        setInputs((prev) => ({ ...prev, ...fromHash }));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Real-time calculation of complete funnel
  const outputs: FunnelOutputs = useMemo(() => {
    return calculateFunnel(inputs);
  }, [inputs]);

  const currentCountry = useMemo(() => {
    return getCountry(inputs.countryCode || 'US');
  }, [inputs.countryCode]);

  const currentPlatform = useMemo(() => {
    return getPlatform(inputs.platformId || 'google');
  }, [inputs.platformId]);

  const handleInputChange = <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectCountry = (countryCode: string) => {
    const prevCountry = getCountry(inputs.countryCode || 'US');
    const newCountry = getCountry(countryCode);
    
    // Scale the baseline CPC according to relative country index
    const baseUsCpc = prevCountry.cpcIndex > 0 ? inputs.expectedCpc / prevCountry.cpcIndex : inputs.expectedCpc;
    const adjustedCpc = Number((baseUsCpc * newCountry.cpcIndex).toFixed(2));

    setInputs((prev) => ({
      ...prev,
      countryCode,
      expectedCpc: Math.max(0.05, adjustedCpc),
    }));
  };

  const handleSelectPlatform = (platformId: PlatformId) => {
    const platform = getPlatform(platformId);
    const country = getCountry(inputs.countryCode || 'US');
    const scaledCpc = Number((platform.recommendedDefaults.expectedCpc * country.cpcIndex).toFixed(2));

    setInputs((prev) => ({
      ...prev,
      platformId,
      channel: platform.name,
      expectedCpc: Math.max(0.05, scaledCpc),
      landingPageConversionRate: platform.recommendedDefaults.landingPageConversionRate,
      leadQualificationRate: platform.recommendedDefaults.leadQualificationRate,
      salesConversionRate: platform.recommendedDefaults.salesConversionRate,
    }));
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = INDUSTRY_BENCHMARKS.find((b) => b.id === presetId);
    if (preset) {
      const country = getCountry(inputs.countryCode || 'US');
      const scaledCpc = Number((preset.defaults.expectedCpc * country.cpcIndex).toFixed(2));
      
      setInputs((prev) => ({
        ...prev,
        ...preset.defaults,
        expectedCpc: scaledCpc,
        countryCode: prev.countryCode, // preserve active country
        platformId: prev.platformId, // preserve active platform
        clientName: prev.clientName, // preserve client name
      }));
    }
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      try {
        localStorage.removeItem('paid_media_calc_state');
      } catch {
        // ignore
      }
    }
  };

  const handleApplySpend = (spend: number) => {
    setInputs((prev) => ({
      ...prev,
      monthlyAdSpend: spend,
    }));
  };

  const handleApplyScenario = (scenarioInputs: FunnelInputs) => {
    setInputs(scenarioInputs);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-[#00B69B]/20 selection:text-slate-900">
      {/* App Header */}
      <Header
        inputs={inputs}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
        onOpenBenchmarkModal={() => setIsBenchmarkModalOpen(true)}
        onOpenCountryModal={() => setIsCountryModalOpen(true)}
        onSelectCountry={handleSelectCountry}
        onOpenPlatformModal={() => setIsPlatformModalOpen(true)}
        onSelectPlatform={handleSelectPlatform}
        onToggleGoalSeeker={() => setIsGoalSeekerOpen((prev) => !prev)}
        isGoalSeekerOpen={isGoalSeekerOpen}
        onToggleScenarios={() => setIsScenariosOpen((prev) => !prev)}
        isScenariosOpen={isScenariosOpen}
        onUpdateClientName={(name) => handleInputChange('clientName', name)}
        onExportCsv={() => exportFunnelToCsv(inputs, outputs)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Optional Active Tool Drawers (Goal Seeker or 3 Scenarios) */}
        {isGoalSeekerOpen && (
          <GoalSeeker
            inputs={inputs}
            onApplySpend={handleApplySpend}
            onClose={() => setIsGoalSeekerOpen(false)}
          />
        )}

        {isScenariosOpen && (
          <ScenarioComparison
            inputs={inputs}
            onApplyScenario={handleApplyScenario}
            onClose={() => setIsScenariosOpen(false)}
          />
        )}

        {/* Core Layout: Left Funnel Stages, Right Executive Scorecard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Funnel Pipeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Interactive 4-Step Growth Funnel</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Follow the step-by-step flow from ad budget down to closed clients and revenue
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsPlatformModalOpen(true)}
                  className="text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Compare Meta, Google, LinkedIn, Twitter, Snapchat, TikTok estimations"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentPlatform.brandColor }} />
                  <span>{currentPlatform.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Compare results across 20+ global countries"
                >
                  <Globe className="w-3.5 h-3.5 text-[#00927C]" />
                  <span>{currentCountry.flag} {currentCountry.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({currentCountry.currency})</span>
                </button>

                <div className="text-xs font-semibold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-300/60">
                  <span className="text-slate-900 font-bold">{inputs.industry || 'Custom'}</span>
                </div>
              </div>
            </div>

            <FunnelFlowView
              inputs={inputs}
              outputs={outputs}
              onChangeInput={handleInputChange}
              onSelectPlatform={handleSelectPlatform}
              onOpenPlatformModal={() => setIsPlatformModalOpen(true)}
              onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
            />
          </div>

          {/* Right Summary & Enablement Scorecard (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            <SummaryMetricsGrid
              inputs={inputs}
              outputs={outputs}
              onChangeInput={handleInputChange}
              onOpenCountryModal={() => setIsCountryModalOpen(true)}
              onSelectCountry={handleSelectCountry}
              onOpenPlatformModal={() => setIsPlatformModalOpen(true)}
              onSelectPlatform={handleSelectPlatform}
              onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
            />

            {/* Quick Industry Presets Pill Strip */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Quick Benchmark Presets
                </span>
                <button
                  type="button"
                  onClick={() => setIsBenchmarkModalOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View All Specs →
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {INDUSTRY_BENCHMARKS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      inputs.industry === preset.name
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity Quick Insight Card */}
            <div className="bg-[#20223A] text-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2 border border-slate-800">
              <div className="flex items-center justify-between font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00B69B]" />
                  <span>Growth Sensitivity Levers</span>
                </span>
                <span className="text-[10px] text-[#C59A27] font-mono font-bold bg-[#C59A27]/10 px-2 py-0.5 rounded border border-[#C59A27]/30">{currentCountry.currency} Market</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#00B69B] font-bold">1.</span>
                  <span>
                    A <strong className="text-white">+2%</strong> lift in Landing Page CVR adds approximately{' '}
                    <strong className="text-white">
                      +{((outputs.expectedTraffic * 0.02 * (inputs.leadQualificationRate / 100) * (inputs.salesConversionRate / 100))).toFixed(1)} new clients
                    </strong>{' '}
                    ({((outputs.expectedTraffic * 0.02 * (inputs.leadQualificationRate / 100) * (inputs.salesConversionRate / 100) * inputs.averageDealSize)).toLocaleString(currentCountry.locale, { style: 'currency', currency: currentCountry.currency, maximumFractionDigits: 0 })} revenue) without spending an extra dollar on ads.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#C59A27] font-bold">2.</span>
                  <span>
                    Current Break-even CAC is <strong className="text-white">{inputs.averageDealSize.toLocaleString(currentCountry.locale, { style: 'currency', currency: currentCountry.currency, maximumFractionDigits: 0 })}</strong>. Your projected CAC of <strong className="text-[#00B69B]">{Math.round(outputs.cac).toLocaleString(currentCountry.locale, { style: 'currency', currency: currentCountry.currency, maximumFractionDigits: 0 })}</strong> yields a healthy <strong className="text-teal-300">{((outputs.cac / Math.max(1, inputs.averageDealSize)) * 100).toFixed(0)}%</strong> CAC-to-revenue ratio in {currentCountry.name}.
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GHLArmyLogo size={20} />
            <span className="font-semibold text-slate-700">Paid Media Growth Systems & Funnel Architecture</span>
          </div>
          <span className="text-slate-400">Multi-Channel Sales Enablement & Unit Economics Calculator</span>
        </div>
      </footer>

      {/* Modals */}
      {isPitchModalOpen && (
        <ClientPitchModal
          inputs={inputs}
          outputs={outputs}
          onClose={() => setIsPitchModalOpen(false)}
        />
      )}

      {isBenchmarkModalOpen && (
        <BenchmarkReferenceModal
          onSelectIndustry={handleSelectPreset}
          onSelectPlatform={(platId) => {
            handleSelectPlatform(platId);
            setIsBenchmarkModalOpen(false);
          }}
          onClose={() => setIsBenchmarkModalOpen(false)}
        />
      )}

      {isCountryModalOpen && (
        <CountryComparisonModal
          inputs={inputs}
          selectedCountryCode={inputs.countryCode || 'US'}
          onSelectCountry={(code) => {
            handleSelectCountry(code);
            setIsCountryModalOpen(false);
          }}
          onClose={() => setIsCountryModalOpen(false)}
        />
      )}

      {isPlatformModalOpen && (
        <AdPlatformComparisonModal
          inputs={inputs}
          selectedPlatformId={inputs.platformId || 'google'}
          onSelectPlatform={(platId) => {
            handleSelectPlatform(platId);
            setIsPlatformModalOpen(false);
          }}
          onClose={() => setIsPlatformModalOpen(false)}
        />
      )}

      {/* Why This Is Reliable / Methodology Proof Modal */}
      <MethodologyExplainerModal
        inputs={inputs}
        outputs={outputs}
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />
    </div>
  );
}


