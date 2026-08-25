import React from 'react';
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
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';

interface FunnelFlowViewProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onChangeInput: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
}

export const FunnelFlowView: React.FC<FunnelFlowViewProps> = ({
  inputs,
  outputs,
  onChangeInput,
}) => {
  return (
    <div className="space-y-4">
      {/* Visual Instruction Banner for Sales Call */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start justify-between gap-3 text-slate-700">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-slate-900">Interactive Prospect Funnel:</span>{' '}
            Adjust each stage live on your sales call. Walk prospective clients from top-of-funnel ad spend down to bottom-line ROAS and payback benchmarks.
          </div>
        </div>
        <div className="text-[11px] font-medium text-slate-500 hidden sm:block shrink-0">
          Flow: Spend → Traffic → Leads → Deals → CAC → ROAS
        </div>
      </div>

      {/* Funnel Pipeline Flow Container */}
      <div className="relative space-y-3">

        {/* STEP 1: Monthly Ad Spend */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                1
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Top of Funnel
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    Input
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Monthly Ad Spend</h3>
              </div>
            </div>

            {/* Quick Spend Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[2500, 5000, 10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onChangeInput('monthlyAdSpend', amt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    inputs.monthlyAdSpend === amt
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  ${amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <input
                id="spend-slider"
                type="range"
                min="500"
                max="100000"
                step="500"
                value={inputs.monthlyAdSpend}
                onChange={(e) => onChangeInput('monthlyAdSpend', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>$500/mo</span>
                <span>$25,000/mo</span>
                <span>$50,000/mo</span>
                <span>$100,000/mo</span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <div className="relative w-full max-w-[200px]">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="spend-number-input"
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.monthlyAdSpend || ''}
                  onChange={(e) => onChangeInput('monthlyAdSpend', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">/month</span>
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 1 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Divided by Expected Cost Per Click</span>
          </div>
        </div>

        {/* STEP 2: Expected CPC */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                2
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Paid Traffic Unit Cost
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    Input
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Expected CPC (Cost Per Click)</h3>
              </div>
            </div>

            {/* Quick CPC Benchmark helper */}
            <div className="text-xs text-slate-500">
              Typical: <span className="font-mono font-semibold text-slate-700">$1.50 - $8.00</span> depending on intent
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <input
                id="cpc-slider"
                type="range"
                min="0.20"
                max="25.00"
                step="0.10"
                value={inputs.expectedCpc}
                onChange={(e) => onChangeInput('expectedCpc', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>$0.20 (Social/Meta)</span>
                <span>$5.00 (Google Search)</span>
                <span>$15.00+ (High B2B)</span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <div className="relative w-full max-w-[180px]">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="cpc-number-input"
                  type="number"
                  min="0.05"
                  max="100"
                  step="0.10"
                  value={inputs.expectedCpc || ''}
                  onChange={(e) => onChangeInput('expectedCpc', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">/click</span>
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 2 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-800">
            <ArrowDown className="w-3 h-3 text-blue-600" />
            <span>Yields Expected Site Traffic</span>
          </div>
        </div>

        {/* STEP 3: Expected Traffic (Calculated Output) */}
        <div className="bg-gradient-to-r from-blue-50/70 to-slate-50/50 border border-blue-200 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                3
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Traffic Volume
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                    Calculated
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Expected Traffic (Clicks / Visitors)</h3>
              </div>
            </div>

            <div className="flex items-baseline gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-xs">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {formatNumber(outputs.expectedTraffic)}
              </span>
              <span className="text-xs font-semibold text-blue-700">targeted visitors / mo</span>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
            <span className="font-mono bg-white px-2.5 py-0.5 rounded border border-slate-200">
              {formatCurrency(inputs.monthlyAdSpend)} Spend ÷ {formatCurrency(inputs.expectedCpc, 2)} CPC = {formatNumber(outputs.expectedTraffic)} clicks
            </span>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 3 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Multiplied by Landing Page Conversion Rate</span>
          </div>
        </div>

        {/* STEP 4: Landing-page Conversion Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                4
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    On-Page Effectiveness
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    Input
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Landing-page Conversion Rate (LP CVR)</h3>
              </div>
            </div>

            {/* Quick CVR benchmarks */}
            <div className="flex items-center gap-1.5">
              {[3.0, 6.0, 10.0, 15.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChangeInput('landingPageConversionRate', rate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    inputs.landingPageConversionRate === rate
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <input
                id="lp-cvr-slider"
                type="range"
                min="0.5"
                max="30.0"
                step="0.5"
                value={inputs.landingPageConversionRate}
                onChange={(e) => onChangeInput('landingPageConversionRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>0.5% (Low)</span>
                <span>5% - 8% (Average)</span>
                <span>12%+ (Optimized LP)</span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <div className="relative w-full max-w-[180px]">
                <input
                  id="lp-cvr-number-input"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.5"
                  value={inputs.landingPageConversionRate || ''}
                  onChange={(e) => onChangeInput('landingPageConversionRate', Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <span className="text-xs text-slate-500 font-medium">CVR</span>
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 4 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[11px] font-semibold text-indigo-900">
            <ArrowDown className="w-3 h-3 text-indigo-600" />
            <span>Generates Raw Lead Volume</span>
          </div>
        </div>

        {/* STEP 5: Leads (Calculated Output) */}
        <div className="bg-gradient-to-r from-indigo-50/60 to-blue-50/40 border border-indigo-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                5
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Lead Generation
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                    Calculated
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Total Leads (Inquiries / Opt-ins)</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] font-medium text-slate-500">Cost Per Lead (CPL)</div>
                <div className="text-sm font-bold font-mono text-slate-800">
                  {formatCurrency(outputs.costPerLead, 2)}
                </div>
              </div>
              <div className="flex items-baseline gap-2 bg-white px-4 py-2 rounded-lg border border-indigo-200 shadow-xs">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {formatNumber(outputs.leads, 1)}
                </span>
                <span className="text-xs font-semibold text-indigo-700">leads / mo</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-600">
            <span className="font-mono bg-white px-2.5 py-0.5 rounded border border-slate-200">
              {formatNumber(outputs.expectedTraffic)} Visitors × {inputs.landingPageConversionRate}% CVR = {formatNumber(outputs.leads, 1)} Total Leads
            </span>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 5 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Filtered by Lead Qualification Rate</span>
          </div>
        </div>

        {/* STEP 6: Lead Qualification Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200">
                6
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Pipeline Quality
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    Input
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Lead Qualification Rate (MQL → SQL)</h3>
              </div>
            </div>

            {/* Quick qualification presets */}
            <div className="flex items-center gap-1.5">
              {[30.0, 45.0, 60.0, 75.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChangeInput('leadQualificationRate', rate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    inputs.leadQualificationRate === rate
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <input
                id="lead-qual-slider"
                type="range"
                min="5.0"
                max="95.0"
                step="1.0"
                value={inputs.leadQualificationRate}
                onChange={(e) => onChangeInput('leadQualificationRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>20% (Broad Form)</span>
                <span>45% (Typical B2B)</span>
                <span>70%+ (Strict ICP Filter)</span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <div className="relative w-full max-w-[180px]">
                <input
                  id="lead-qual-number-input"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={inputs.leadQualificationRate || ''}
                  onChange={(e) => onChangeInput('leadQualificationRate', Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <span className="text-xs text-slate-500 font-medium">Qualified</span>
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 6 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Yields Qualified Opportunities (SQLs)</span>
          </div>
        </div>

        {/* STEP 7: Qualified Leads (Calculated Intermediate) */}
        <div className="bg-gradient-to-r from-sky-50/60 to-blue-50/40 border border-sky-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                7
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                    Sales Pipeline
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-semibold">
                    Calculated
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Qualified Leads (Sales-Ready / Discovery Calls)</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] font-medium text-slate-500">Cost Per SQL (CPQL)</div>
                <div className="text-sm font-bold font-mono text-slate-800">
                  {formatCurrency(outputs.costPerQualifiedLead, 2)}
                </div>
              </div>
              <div className="flex items-baseline gap-2 bg-white px-4 py-2 rounded-lg border border-sky-200 shadow-xs">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {formatNumber(outputs.qualifiedLeads, 1)}
                </span>
                <span className="text-xs font-semibold text-sky-700">SQLs / mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 7 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Multiplied by Sales Conversion / Win Rate</span>
          </div>
        </div>

        {/* STEP 8: Sales Conversion Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200">
                8
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Sales Execution
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    Input
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Sales Conversion Rate (Close / Win Rate)</h3>
              </div>
            </div>

            {/* Quick close rate presets */}
            <div className="flex items-center gap-1.5">
              {[15.0, 20.0, 25.0, 35.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChangeInput('salesConversionRate', rate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    inputs.salesConversionRate === rate
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7">
              <input
                id="sales-close-slider"
                type="range"
                min="2.0"
                max="60.0"
                step="1.0"
                value={inputs.salesConversionRate}
                onChange={(e) => onChangeInput('salesConversionRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>10% (Challenging)</span>
                <span>22% (Average B2B)</span>
                <span>35%+ (Strong Sales Team)</span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <div className="relative w-full max-w-[180px]">
                <input
                  id="sales-close-number-input"
                  type="number"
                  min="0.5"
                  max="100"
                  step="1"
                  value={inputs.salesConversionRate || ''}
                  onChange={(e) => onChangeInput('salesConversionRate', Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <span className="text-xs text-slate-500 font-medium">Close %</span>
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 8 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-semibold text-teal-900">
            <ArrowDown className="w-3 h-3 text-teal-600" />
            <span>Delivers Closed Customers</span>
          </div>
        </div>

        {/* STEP 9: Customers (Calculated Output) */}
        <div className="bg-gradient-to-r from-teal-50/60 to-emerald-50/40 border border-teal-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                9
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                    Closed Deals
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">
                    Calculated
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">New Customers / Closed Won Deals</h3>
              </div>
            </div>

            <div className="flex items-baseline gap-2 bg-white px-4 py-2 rounded-lg border border-teal-200 shadow-xs">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {formatNumber(outputs.customers, 1)}
              </span>
              <span className="text-xs font-semibold text-teal-700">clients / mo</span>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-600">
            <span className="font-mono bg-white px-2.5 py-0.5 rounded border border-slate-200">
              {formatNumber(outputs.qualifiedLeads, 1)} SQLs × {inputs.salesConversionRate}% Close = {formatNumber(outputs.customers, 1)} Closed Deals
            </span>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 9 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Ad Spend Divided by New Customers</span>
          </div>
        </div>

        {/* STEP 10: CAC (Customer Acquisition Cost) */}
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                10
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Unit Economics
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                    Calculated
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">CAC (Customer Acquisition Cost)</h3>
              </div>
            </div>

            <div className="flex items-baseline gap-2 bg-slate-800/90 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
              <span className="text-2xl font-black text-blue-400 font-mono tracking-tight">
                {formatCurrency(outputs.cac, 0)}
              </span>
              <span className="text-xs font-medium text-slate-400">per won customer</span>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span className="font-mono">
              {formatCurrency(inputs.monthlyAdSpend)} Spend ÷ {formatNumber(outputs.customers, 1)} Customers = {formatCurrency(outputs.cac, 2)} CAC
            </span>
            {outputs.cac > 0 && inputs.averageDealSize > 0 && (
              <span className="text-[11px] text-slate-300">
                CAC is <strong className="text-blue-300">{((outputs.cac / inputs.averageDealSize) * 100).toFixed(0)}%</strong> of Deal Value
              </span>
            )}
          </div>
        </div>

        {/* FUNNEL CONNECTOR 10 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <ArrowDown className="w-3 h-3 text-slate-400" />
            <span>Multiplied by Average Deal Size / ACV</span>
          </div>
        </div>

        {/* STEP 11: Deal Size Input & Revenue (Calculated Output) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                11
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Deal Size & Total Value
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    Input + Output
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Average Deal Size (ACV / LTV) & Monthly Revenue</h3>
              </div>
            </div>

            {/* Quick Deal Size Presets */}
            <div className="flex items-center gap-1.5">
              {[1500, 3500, 7500, 15000].map((deal) => (
                <button
                  key={deal}
                  type="button"
                  onClick={() => onChangeInput('averageDealSize', deal)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    inputs.averageDealSize === deal
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  ${deal >= 1000 ? `${deal / 1000}k` : deal}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-4">
            <div className="md:col-span-7">
              <input
                id="deal-size-slider"
                type="range"
                min="100"
                max="50000"
                step="250"
                value={inputs.averageDealSize}
                onChange={(e) => onChangeInput('averageDealSize', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                <span>$250 (Mid Ecom)</span>
                <span>$5,000 (Services)</span>
                <span>$20,000+ (Enterprise)</span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2">
              <div className="relative w-full max-w-[200px]">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="deal-size-number-input"
                  type="number"
                  min="10"
                  step="100"
                  value={inputs.averageDealSize || ''}
                  onChange={(e) => onChangeInput('averageDealSize', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-1.5 text-right font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">/deal</span>
            </div>
          </div>

          {/* Revenue Output Highlight Box */}
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-emerald-900">Total Projected Monthly Revenue</div>
              <div className="text-[11px] text-emerald-700 font-mono">
                {formatNumber(outputs.customers, 1)} Customers × {formatCurrency(inputs.averageDealSize)} Deal Size
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-900 font-mono">
              {formatCurrency(outputs.revenue, 0)}
            </div>
          </div>
        </div>

        {/* FUNNEL CONNECTOR 11 */}
        <div className="flex items-center justify-center -my-1">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[11px] font-bold text-emerald-950">
            <ArrowDown className="w-3 h-3 text-emerald-700" />
            <span>Final Bottom Line Return On Ad Spend</span>
          </div>
        </div>

        {/* STEP 12: ROAS (Return On Ad Spend) */}
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                12
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Executive Benchmark
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {outputs.roas >= 4.0 ? 'Exceptional' : outputs.roas >= 2.5 ? 'Healthy' : outputs.roas >= 1.0 ? 'Break-even' : 'Unprofitable'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">ROAS (Return On Ad Spend)</h3>
              </div>
            </div>

            {/* Big ROAS Display */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Net Profit</div>
                <div className={`text-xl font-bold font-mono ${outputs.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(outputs.netProfit, 0)}
                </div>
              </div>

              <div className="bg-slate-800/90 px-5 py-2.5 rounded-xl border border-blue-500/40 text-right">
                <div className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">ROAS Multiple</div>
                <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                  {formatMultiplier(outputs.roas, 2)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <span className="font-mono">
              {formatCurrency(outputs.revenue, 0)} Revenue ÷ {formatCurrency(inputs.monthlyAdSpend)} Ad Spend = <strong>{outputs.roasPercentage.toFixed(0)}% ROAS</strong>
            </span>
            <span className="text-slate-400">
              For every <strong>$1.00</strong> spent, client generates <strong>{formatCurrency(outputs.roas, 2)}</strong> in revenue.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
