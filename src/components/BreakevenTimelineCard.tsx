import React from 'react';
import { Clock, TrendingUp, CheckCircle2, AlertCircle, ArrowRight, Zap, Calendar, Target, DollarSign } from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';

interface BreakevenTimelineCardProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
}

export function BreakevenTimelineCard({ inputs, outputs }: BreakevenTimelineCardProps) {
  const currentCountry = getCountry(inputs.countryCode || 'US');

  const fmt = (val: number, maxFraction = 0) => {
    return val.toLocaleString(currentCountry.locale, {
      style: 'currency',
      currency: currentCountry.currency,
      maximumFractionDigits: maxFraction,
    });
  };

  const monthlySpend = Math.max(1, inputs.monthlyAdSpend || 1000);
  const dealSize = Math.max(1, inputs.averageDealSize || 1);
  const monthlyRevenue = outputs.revenue || 0;
  const customersPerMonth = outputs.customers || 0;
  const roas = outputs.roas || 0;

  // Exact deals needed to cover 100% of ad spend
  const exactDealsNeeded = monthlySpend / dealSize;
  const wholeDealsNeeded = Math.max(1, Math.ceil(exactDealsNeeded));

  // Days in a standard month to reach breakeven
  // If ROAS > 0, Days = (Spend / Revenue) * 30.4 = 30.4 / ROAS
  const daysToBreakeven = roas > 0 ? (monthlySpend / Math.max(1, monthlyRevenue)) * 30.4 : 999;
  const isProfitableInMonth = roas >= 1.0 && daysToBreakeven <= 30.4;
  const daysRounded = Math.min(30, Math.max(1, Math.round(daysToBreakeven * 10) / 10));

  // Expected day of the 1st closed client
  const daysToFirstClient = customersPerMonth > 0 ? Math.min(30, Math.max(1, Math.round((30.4 / customersPerMonth) * 10) / 10)) : null;

  // Daily run rates
  const dailySpend = monthlySpend / 30.4;
  const dailyRevenue = monthlyRevenue / 30.4;
  const dailyNetProfit = (monthlyRevenue - monthlySpend) / 30.4;

  // Calculate percentage of the month that is pure profit
  const profitableDaysInMonth = Math.max(0, 30.4 - daysToBreakeven);
  const profitableMonthPct = Math.min(100, Math.max(0, (profitableDaysInMonth / 30.4) * 100));

  return (
    <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#00B69B]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              <span>Time to Breakeven</span>
              <span className="text-[10px] font-normal text-slate-500 font-sans">
                (Payback Velocity)
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              When campaigns turn profitable based on spend & deal size
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isProfitableInMonth ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Day {daysRounded <= 1 ? '1' : daysRounded} Payoff</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>&gt;30 Days Payback</span>
          </span>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Metric 1: Days to Breakeven */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Breakeven Time
          </span>
          <div className="mt-1">
            <div className="text-base font-extrabold text-slate-900 font-mono flex items-baseline gap-1">
              {isProfitableInMonth ? (
                <>
                  <span>{daysRounded}</span>
                  <span className="text-xs font-medium text-slate-500">days</span>
                </>
              ) : (
                <span className="text-amber-700 text-xs font-bold font-sans">30+ days</span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 leading-none">
              {isProfitableInMonth ? `Day ${Math.ceil(daysRounded)} of 30` : 'Requires repeat sales'}
            </span>
          </div>
        </div>

        {/* Metric 2: Deals needed */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Deals to Pay Off
          </span>
          <div className="mt-1">
            <div className="text-base font-extrabold text-slate-900 font-mono flex items-baseline gap-1">
              <span>{exactDealsNeeded < 1 ? exactDealsNeeded.toFixed(1) : wholeDealsNeeded}</span>
              <span className="text-xs font-medium text-slate-500">
                {wholeDealsNeeded === 1 ? 'sale' : 'sales'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 leading-none truncate">
              @ {fmt(dealSize)} each
            </span>
          </div>
        </div>

        {/* Metric 3: Daily Net Profit Run-Rate */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Daily Net Pace
          </span>
          <div className="mt-1">
            <div className={`text-base font-extrabold font-mono flex items-baseline gap-1 ${
              dailyNetProfit >= 0 ? 'text-[#00927C]' : 'text-rose-600'
            }`}>
              <span>{dailyNetProfit >= 0 ? `+${fmt(dailyNetProfit, 0)}` : fmt(dailyNetProfit, 0)}</span>
              <span className="text-[10px] font-medium text-slate-500">/day</span>
            </div>
            <span className="text-[10px] text-slate-500 leading-none">
              {dailyNetProfit >= 0 ? 'Net profit run-rate' : 'Net loss pace'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Payback Timeline Bar */}
      <div className="space-y-1.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>30-Day Payback Horizon:</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-600">
            {isProfitableInMonth
              ? `${profitableMonthPct.toFixed(0)}% of month in pure profit`
              : 'Negative in-month return'}
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
          {isProfitableInMonth ? (
            <>
              {/* Cost Recovery Zone (Amber/Slate) */}
              <div
                style={{ width: `${Math.min(100, Math.max(6, (daysToBreakeven / 30.4) * 100))}%` }}
                className="bg-amber-400/90 h-full flex items-center justify-center text-[8px] font-bold text-amber-950 truncate px-1"
                title={`Cost Recovery Phase: First ${daysRounded} days (${fmt(monthlySpend)} total ad spend)`}
              >
                Cost Recovery
              </div>
              {/* Pure Profit Zone (Green) */}
              <div
                style={{ width: `${Math.max(0, 100 - (daysToBreakeven / 30.4) * 100)}%` }}
                className="bg-[#00B69B] h-full flex items-center justify-center text-[8px] font-bold text-white truncate px-1"
                title={`Pure Profit Phase: Remaining ${profitableDaysInMonth.toFixed(1)} days (generating ${fmt(Math.max(0, outputs.netProfit))} net profit)`}
              >
                Pure Profit (+{fmt(outputs.netProfit, 0)})
              </div>
            </>
          ) : (
            <div
              className="w-full bg-rose-400 h-full flex items-center justify-center text-[9px] font-bold text-white px-2"
              title="Campaign spend exceeds projected single-purchase deal revenue in a 30-day window"
            >
              Spend Exceeds Month 1 Revenue
            </div>
          )}
        </div>

        {/* Timeline Axis Labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Day 1 (Ad Launch)</span>
          {isProfitableInMonth && (
            <span className="text-emerald-700 font-bold">
              ★ Day {daysRounded} (Breakeven)
            </span>
          )}
          <span>Day 30 (+{fmt(monthlyRevenue, 0)})</span>
        </div>
      </div>

      {/* Dynamic Narrative Summary Box */}
      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-slate-700 space-y-1">
        <div className="flex items-start gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#00927C] shrink-0 mt-0.5" />
          <div className="leading-snug">
            {isProfitableInMonth ? (
              <span>
                At a monthly spend of <strong className="text-slate-900">{fmt(monthlySpend)}</strong> ({fmt(dailySpend, 0)}/day) and an average customer deal size of <strong className="text-slate-900">{fmt(dealSize)}</strong>, you need just{' '}
                <strong className="text-[#00927C] font-bold">
                  {exactDealsNeeded <= 1 ? '1 closed deal' : `${wholeDealsNeeded} closed deals`}
                </strong>{' '}
                to break even. You are projected to hit breakeven around{' '}
                <strong className="text-slate-900 font-bold">Day {daysRounded}</strong> of each monthly cycle, leaving{' '}
                <strong className="text-[#00927C] font-bold">{profitableDaysInMonth.toFixed(1)} days</strong> to accumulate{' '}
                <strong className="text-slate-900 font-bold">+{fmt(outputs.netProfit, 0)}</strong> in net campaign profit.
              </span>
            ) : (
              <span>
                With <strong className="text-slate-900">{fmt(monthlySpend)}</strong> monthly spend and <strong className="text-slate-900">{fmt(dealSize)}</strong> deal size, the campaign requires{' '}
                <strong className="text-amber-800 font-bold">{exactDealsNeeded.toFixed(1)} deals/mo</strong> to break even (currently projected for {customersPerMonth.toFixed(1)} deals). Increasing your average deal size or optimizing landing page conversion rate will shorten your breakeven timeline.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
