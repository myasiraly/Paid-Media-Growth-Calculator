import React from 'react';
import { 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  X
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';
import { 
  calculateFunnel, 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';

interface ScenarioComparisonProps {
  inputs: FunnelInputs;
  onApplyScenario: (scenarioInputs: FunnelInputs) => void;
  onClose: () => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  inputs,
  onApplyScenario,
  onClose,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  // Scenario 1: Conservative (15% higher CPC, 20% lower conversion rates)
  const conservativeInputs: FunnelInputs = {
    ...inputs,
    expectedCpc: Number((inputs.expectedCpc * 1.15).toFixed(2)),
    landingPageConversionRate: Math.max(0.5, Number((inputs.landingPageConversionRate * 0.8).toFixed(1))),
    leadQualificationRate: Math.max(5, Number((inputs.leadQualificationRate * 0.85).toFixed(1))),
    salesConversionRate: Math.max(2, Number((inputs.salesConversionRate * 0.85).toFixed(1))),
  };
  const conservativeOutputs = calculateFunnel(conservativeInputs);

  // Scenario 2: Realistic (Current)
  const realisticOutputs = calculateFunnel(inputs);

  // Scenario 3: Optimized / Agency-Boosted (15% lower CPC via Quality Score, +25% LP CVR, +20% qualification & sales)
  const optimizedInputs: FunnelInputs = {
    ...inputs,
    expectedCpc: Math.max(0.1, Number((inputs.expectedCpc * 0.85).toFixed(2))),
    landingPageConversionRate: Math.min(40, Number((inputs.landingPageConversionRate * 1.25).toFixed(1))),
    leadQualificationRate: Math.min(95, Number((inputs.leadQualificationRate * 1.15).toFixed(1))),
    salesConversionRate: Math.min(80, Number((inputs.salesConversionRate * 1.15).toFixed(1))),
  };
  const optimizedOutputs = calculateFunnel(optimizedInputs);

  const scenarios = [
    {
      title: 'Conservative (Stress-Test)',
      badge: 'Floor Case',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      description: 'Accounts for ramp-up volatility, higher auction CPCs, and cautious close rates.',
      inputs: conservativeInputs,
      outputs: conservativeOutputs,
      highlight: false,
    },
    {
      title: 'Realistic (Base Model)',
      badge: 'Expected Case',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Standard benchmark performance with steady traffic and team closing cadence.',
      inputs: inputs,
      outputs: realisticOutputs,
      highlight: true,
    },
    {
      title: 'Optimized (Agency High-Intent)',
      badge: 'Optimized Upside',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Optimized landing page copy, negative keyword scrubbing, and fast sales response.',
      inputs: optimizedInputs,
      outputs: optimizedOutputs,
      highlight: false,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
        title="Close Scenarios"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">3-Tier Scenario Forecast</h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-semibold">
              {country.flag} {country.name} ({country.currency})
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Compare Conservative vs Expected vs Optimized campaign performance side-by-side
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {scenarios.map((sc, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 border transition-all ${
              sc.highlight
                ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300 shadow-xs'
                : 'bg-slate-50/70 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h4 className="text-xs font-bold text-slate-900">{sc.title}</h4>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.badgeClass}`}>
                {sc.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 min-h-[30px] leading-relaxed">
              {sc.description}
            </p>

            {/* Core Outputs in Card */}
            <div className="space-y-2 bg-white rounded-lg p-3 border border-slate-200/80 mb-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Monthly Ad Spend</span>
                <span className="font-mono font-bold text-slate-900">{fmt(sc.inputs.monthlyAdSpend)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Expected Traffic</span>
                <span className="font-mono">{formatNumber(sc.outputs.expectedTraffic)} clicks</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Leads</span>
                <span className="font-mono">{formatNumber(sc.outputs.leads, 1)} leads</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Qualified Opportunities</span>
                <span className="font-mono">{formatNumber(sc.outputs.qualifiedLeads, 1)} SQLs</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 pt-1.5 border-t border-slate-100">
                <span className="font-semibold text-slate-900">New Customers</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(sc.outputs.customers, 1)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Customer Acquisition Cost</span>
                <span className="font-mono font-bold text-slate-900">{fmt(sc.outputs.cac, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold text-emerald-900">Projected Revenue</span>
                <span className="font-mono font-bold text-emerald-800">{fmt(sc.outputs.revenue, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 pt-1.5 border-t border-slate-100">
                <span className="font-bold text-blue-900">Expected ROAS</span>
                <span className="font-mono font-black text-blue-900 text-sm">{formatMultiplier(sc.outputs.roas, 2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onApplyScenario(sc.inputs)}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Load this Scenario</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

