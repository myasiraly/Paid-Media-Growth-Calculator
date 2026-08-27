import React, { useState } from 'react';
import { 
  Target, 
  DollarSign, 
  Users, 
  ArrowRight, 
  Check, 
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { FunnelInputs } from '../types';
import { getCountry } from '../data/countries';
import { 
  calculateRequiredSpend, 
  formatCurrency, 
  formatNumber, 
  formatMultiplier 
} from '../utils/calculations';

interface GoalSeekerProps {
  inputs: FunnelInputs;
  onApplySpend: (spend: number) => void;
  onClose: () => void;
}

export const GoalSeeker: React.FC<GoalSeekerProps> = ({
  inputs,
  onApplySpend,
  onClose,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  const [goalType, setGoalType] = useState<'revenue' | 'customers'>('revenue');
  const [targetRevenue, setTargetRevenue] = useState<number>(50000);
  const [targetCustomers, setTargetCustomers] = useState<number>(10);

  // Compute effective target revenue
  const effectiveTargetRevenue = goalType === 'revenue' 
    ? targetRevenue 
    : targetCustomers * Math.max(1, inputs.averageDealSize);

  const results = calculateRequiredSpend(effectiveTargetRevenue, inputs);

  return (
    <div className="bg-[#20223A] text-white border border-slate-800 rounded-xl p-5 shadow-lg relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        title="Close Goal Seeker"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[#00B69B] text-white flex items-center justify-center font-bold">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Reverse Target Planner</h3>
            <span className="text-[10px] bg-slate-800 text-[#00B69B] px-2 py-0.5 rounded-full border border-slate-700 font-semibold">
              {country.flag} {country.currency}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Define the prospect's growth target to calculate required ad spend and milestone volumes
          </p>
        </div>
      </div>

      {/* Target Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Goal Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setGoalType('revenue')}
              className={`py-1 px-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
                goalType === 'revenue'
                  ? 'bg-[#00B69B] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Target Revenue ({country.currencySymbol})
            </button>
            <button
              type="button"
              onClick={() => setGoalType('customers')}
              className={`py-1 px-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
                goalType === 'customers'
                  ? 'bg-[#00B69B] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Target Clients (#)
            </button>
          </div>
        </div>

        {/* Target Value Input */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            {goalType === 'revenue' ? `Desired Monthly Revenue (${country.currency})` : 'Desired New Clients / Month'}
          </label>
          <div className="relative">
            {goalType === 'revenue' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                {country.currencySymbol}
              </span>
            )}
            <input
              type="number"
              min="1"
              step={goalType === 'revenue' ? 5000 : 1}
              value={goalType === 'revenue' ? targetRevenue : targetCustomers}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (goalType === 'revenue') {
                  setTargetRevenue(val);
                } else {
                  setTargetCustomers(val);
                }
              }}
              className={`w-full ${
                goalType === 'revenue' ? 'pl-8' : 'pl-3'
              } pr-3 py-1.5 text-right font-mono font-bold text-white bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-[#00B69B]`}
            />
          </div>
        </div>
      </div>

      {/* Target Result Outputs */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 mb-4">
        <div className="text-xs font-bold text-[#00B69B] uppercase tracking-wider mb-2.5 flex items-center justify-between flex-wrap gap-2">
          <span>Required Funnel Milestones (Based on Current Rates)</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Target: {fmt(effectiveTargetRevenue, 0)} ({formatNumber(results.targetCustomers, 1)} clients)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#20223A] p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Required Ad Spend</div>
            <div className="text-base font-bold font-mono text-[#00B69B] mt-0.5">
              {fmt(results.requiredSpend, 0)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">/ month</div>
          </div>

          <div className="bg-[#20223A] p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Traffic</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {formatNumber(results.requiredTraffic)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">clicks @ {fmt(inputs.expectedCpc, 2)}</div>
          </div>

          <div className="bg-[#20223A] p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Leads</div>
            <div className="text-base font-bold font-mono text-teal-300 mt-0.5">
              {formatNumber(results.requiredLeads, 1)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{formatNumber(results.requiredQualifiedLeads, 1)} SQLs</div>
          </div>

          <div className="bg-[#20223A] p-2.5 rounded-lg border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Target ROAS</div>
            <div className="text-base font-bold font-mono text-[#C59A27] mt-0.5">
              {formatMultiplier(results.expectedRoas, 2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Return multiple</div>
          </div>
        </div>
      </div>

      {/* Action to Apply */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-slate-400">
          Want to simulate this campaign? Load <strong>{fmt(Math.round(results.requiredSpend), 0)}</strong> spend into the main funnel.
        </div>
        <button
          type="button"
          onClick={() => {
            onApplySpend(Math.round(results.requiredSpend));
            onClose();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00B69B] hover:bg-[#009e86] text-white transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Spend ({fmt(Math.round(results.requiredSpend), 0)})</span>
        </button>
      </div>
    </div>
  );
};

