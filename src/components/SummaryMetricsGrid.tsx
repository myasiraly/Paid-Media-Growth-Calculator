import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Percent, 
  ArrowUpRight, 
  CheckCircle,
  AlertTriangle,
  Flame,
  Scale
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';

interface SummaryMetricsGridProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onChangeInput: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
}

export const SummaryMetricsGrid: React.FC<SummaryMetricsGridProps> = ({
  inputs,
  outputs,
  onChangeInput,
}) => {
  const cacToDealRatio = inputs.averageDealSize > 0 
    ? (outputs.cac / inputs.averageDealSize) * 100 
    : 0;

  const isProfitable = outputs.netProfit > 0;
  const isGreatRoas = outputs.roas >= 3.0;

  return (
    <div className="space-y-4">
      {/* Top Executive Highlights Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Executive Economics Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Key performance indicators and client profitability breakdown
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isGreatRoas 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : outputs.roas >= 1.5 
                ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {isGreatRoas ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>High Return Campaign</span>
                </>
              ) : outputs.roas >= 1.0 ? (
                <>
                  <Scale className="w-3.5 h-3.5 text-blue-600" />
                  <span>Moderate Return</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Negative Return Risk</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* 4 Hero Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Revenue */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Monthly Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {formatCurrency(outputs.revenue, 0)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Pipeline from {formatNumber(outputs.customers, 1)} deals
            </div>
          </div>

          {/* ROAS */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-blue-900 mb-1">
              <span className="text-xs font-semibold">Expected ROAS</span>
              <Flame className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-black font-mono text-blue-950">
              {formatMultiplier(outputs.roas, 2)}
            </div>
            <div className="text-[11px] text-blue-800 mt-1 font-medium">
              {outputs.roasPercentage.toFixed(0)}% return on spend
            </div>
          </div>

          {/* CAC */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Cost Per Acquisition</span>
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {formatCurrency(outputs.cac, 0)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {cacToDealRatio.toFixed(0)}% of deal size
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Net Ad Profit</span>
              <TrendingUp className={`w-4 h-4 ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`} />
            </div>
            <div className={`text-xl font-bold font-mono ${isProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatCurrency(outputs.netProfit, 0)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {outputs.roi >= 0 ? `+${outputs.roi.toFixed(0)}% ROI` : `${outputs.roi.toFixed(0)}% ROI`}
            </div>
          </div>
        </div>

        {/* Micro-Funnel Benchmarks Table */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Unit Cost Breakdown Across Funnel
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Cost / Click (CPC)</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatCurrency(inputs.expectedCpc, 2)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{formatNumber(outputs.expectedTraffic)} total clicks</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Cost / Raw Lead (CPL)</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatCurrency(outputs.costPerLead, 2)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{formatNumber(outputs.leads, 1)} total leads</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Cost / SQL (CPQL)</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatCurrency(outputs.costPerQualifiedLead, 2)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{formatNumber(outputs.qualifiedLeads, 1)} qualified calls</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Cost / Customer (CAC)</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatCurrency(outputs.cac, 0)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{formatNumber(outputs.customers, 1)} closed won</div>
            </div>
          </div>
        </div>

        {/* Client Sales Pitch Talk Tracks */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-blue-900">
            <Flame className="w-3.5 h-3.5 text-blue-700" />
            <span>Sales Pitch Talk Track For This Model:</span>
          </div>
          <p className="leading-relaxed">
            &ldquo;At a <strong>{formatCurrency(inputs.monthlyAdSpend)}</strong> monthly spend, we drive approximately <strong>{formatNumber(outputs.expectedTraffic)}</strong> targeted visitors. With a conservative <strong>{inputs.landingPageConversionRate}%</strong> landing page conversion rate, that yields <strong>{formatNumber(outputs.leads, 0)}</strong> leads. Assuming your team qualifies <strong>{inputs.leadQualificationRate}%</strong> into sales discovery calls and closes <strong>{inputs.salesConversionRate}%</strong>, you will add <strong>{formatNumber(outputs.customers, 1)} new clients</strong> per month, generating <strong>{formatCurrency(outputs.revenue, 0)}</strong> at a <strong>{formatMultiplier(outputs.roas, 2)} ROAS</strong>.&rdquo;
          </p>
        </div>

      </div>
    </div>
  );
};
