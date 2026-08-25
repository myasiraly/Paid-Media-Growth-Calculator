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
  CheckCircle2
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from './types';
import { calculateFunnel } from './utils/calculations';
import { INDUSTRY_BENCHMARKS } from './data/benchmarks';
import { Header } from './components/Header';
import { FunnelFlowView } from './components/FunnelFlowView';
import { SummaryMetricsGrid } from './components/SummaryMetricsGrid';
import { GoalSeeker } from './components/GoalSeeker';
import { ScenarioComparison } from './components/ScenarioComparison';
import { ClientPitchModal } from './components/ClientPitchModal';
import { BenchmarkReferenceModal } from './components/BenchmarkReferenceModal';

const DEFAULT_INPUTS: FunnelInputs = {
  monthlyAdSpend: 10000,
  expectedCpc: 4.50,
  landingPageConversionRate: 8.0,
  leadQualificationRate: 45.0,
  salesConversionRate: 25.0,
  averageDealSize: 4500,
  grossMarginRate: 80,
  clientName: '',
  industry: 'B2B SaaS & Tech',
  channel: 'Google Search + Paid Social',
};

export default function App() {
  const [inputs, setInputs] = useState<FunnelInputs>(() => {
    try {
      const saved = localStorage.getItem('paid_media_calc_state');
      if (saved) {
        return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_INPUTS;
  });

  const [isGoalSeekerOpen, setIsGoalSeekerOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('paid_media_calc_state', JSON.stringify(inputs));
    } catch {
      // ignore
    }
  }, [inputs]);

  // Real-time calculation of complete funnel
  const outputs: FunnelOutputs = useMemo(() => {
    return calculateFunnel(inputs);
  }, [inputs]);

  const handleInputChange = <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = INDUSTRY_BENCHMARKS.find((b) => b.id === presetId);
    if (preset) {
      setInputs((prev) => ({
        ...prev,
        ...preset.defaults,
        clientName: prev.clientName, // preserve client name
      }));
    }
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-200 selection:text-slate-900">
      {/* App Header */}
      <Header
        inputs={inputs}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
        onOpenBenchmarkModal={() => setIsBenchmarkModalOpen(true)}
        onToggleGoalSeeker={() => setIsGoalSeekerOpen((prev) => !prev)}
        isGoalSeekerOpen={isGoalSeekerOpen}
        onToggleScenarios={() => setIsScenariosOpen((prev) => !prev)}
        isScenariosOpen={isScenariosOpen}
        onUpdateClientName={(name) => handleInputChange('clientName', name)}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Campaign Conversion Pipeline
                </h2>
                <p className="text-xs text-slate-500">
                  Step-by-step unit economics from ad impression to closed client
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-300/60">
                Industry: <span className="text-slate-900 font-bold">{inputs.industry || 'Custom'}</span>
              </div>
            </div>

            <FunnelFlowView
              inputs={inputs}
              outputs={outputs}
              onChangeInput={handleInputChange}
            />
          </div>

          {/* Right Summary & Enablement Scorecard (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            <SummaryMetricsGrid
              inputs={inputs}
              outputs={outputs}
              onChangeInput={handleInputChange}
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
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
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
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2 border border-slate-800">
              <div className="flex items-center justify-between font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Growth Sensitivity Levers</span>
                </span>
                <span className="text-[10px] text-blue-400 font-mono">Impact Analysis</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span>
                    A <strong className="text-white">+2%</strong> lift in Landing Page CVR adds approximately{' '}
                    <strong className="text-white">
                      +{((outputs.expectedTraffic * 0.02 * (inputs.leadQualificationRate / 100) * (inputs.salesConversionRate / 100))).toFixed(1)} new clients
                    </strong>{' '}
                    ({(outputs.expectedTraffic * 0.02 * (inputs.leadQualificationRate / 100) * (inputs.salesConversionRate / 100) * inputs.averageDealSize).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} revenue) without spending an extra dollar on ads.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>
                    Current Break-even CAC is <strong className="text-white">${inputs.averageDealSize.toLocaleString()}</strong>. Your projected CAC of <strong className="text-emerald-400">${Math.round(outputs.cac).toLocaleString()}</strong> yields a healthy <strong className="text-blue-300">{((outputs.cac / Math.max(1, inputs.averageDealSize)) * 100).toFixed(0)}%</strong> CAC-to-revenue ratio.
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Paid Media Growth Calculator · Sales Enablement & Benchmark Simulator</span>
          <span className="text-slate-400">Deterministic Mathematical Funnel Engine</span>
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
          onClose={() => setIsBenchmarkModalOpen(false)}
        />
      )}
    </div>
  );
}
