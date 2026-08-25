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
  Scale,
  Globe,
  ArrowRight,
  Zap
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs, PlatformId } from '../types';
import { getCountry, COUNTRIES, calculateCountryFunnel } from '../data/countries';
import { AD_PLATFORMS, getPlatform, calculatePlatformFunnel } from '../data/platforms';
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
  onOpenCountryModal?: () => void;
  onSelectCountry?: (countryCode: string) => void;
  onOpenPlatformModal?: () => void;
  onSelectPlatform?: (platformId: PlatformId) => void;
}

export const SummaryMetricsGrid: React.FC<SummaryMetricsGridProps> = ({
  inputs,
  outputs,
  onChangeInput,
  onOpenCountryModal,
  onSelectCountry,
  onOpenPlatformModal,
  onSelectPlatform,
}) => {
  const currentCountry = getCountry(inputs.countryCode || 'US');
  const currentPlatform = getPlatform(inputs.platformId || 'google');

  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, currentCountry.currency, currentCountry.locale);

  const cacToDealRatio = inputs.averageDealSize > 0 
    ? (outputs.cac / inputs.averageDealSize) * 100 
    : 0;

  const isProfitable = outputs.netProfit > 0;
  const isGreatRoas = outputs.roas >= 3.0;

  // Selected preview countries for quick comparison
  const previewCountries = ['US', 'GB', 'DE', 'AU', 'CA', 'SG', 'IN'].map(code => {
    const country = getCountry(code);
    const countryResult = calculateCountryFunnel(country, inputs);
    return countryResult;
  });

  // Calculate funnel results across all 6 ad networks
  const channelEstimations = AD_PLATFORMS.map((platform) => {
    return calculatePlatformFunnel(platform, inputs, currentCountry);
  });

  return (
    <div className="space-y-4">
      {/* Top Executive Highlights Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Executive Economics Overview
              </h2>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                <span>{currentCountry.flag}</span>
                <span>{currentCountry.name}</span>
                <span>({currentCountry.currency})</span>
              </span>
              <span 
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800 transition-colors shadow-2xs"
                onClick={onOpenPlatformModal}
                title="Click to view full 6-platform benchmark matrix"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentPlatform.brandColor }} />
                <span>{currentPlatform.name}</span>
              </span>
            </div>
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

        {/* 6 Key Executive Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Gross Revenue</span>
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {fmt(outputs.revenue, 0)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {formatNumber(outputs.customers, 1)} clients × {fmt(inputs.averageDealSize)}
            </div>
          </div>

          {/* Net Profit */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Net Ad Profit</span>
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className={`text-xl font-bold font-mono mt-1 ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
              {fmt(outputs.netProfit, 0)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              ROI: <span className="font-semibold text-slate-700">{formatPercent(outputs.roi)}</span>
            </div>
          </div>

          {/* ROAS Multiple */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between text-xs text-blue-800 font-bold">
              <span>ROAS Multiple</span>
              <Percent className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black font-mono text-blue-900 mt-1">
              {formatMultiplier(outputs.roas, 2)}
            </div>
            <div className="text-[11px] text-blue-700 font-mono mt-0.5">
              {outputs.roasPercentage.toFixed(0)}% return on spend
            </div>
          </div>

          {/* Customer Acquisition Cost (CAC) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>CAC (Cost Per Acq)</span>
              <Target className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {fmt(outputs.cac, 0)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {cacToDealRatio.toFixed(0)}% of {fmt(inputs.averageDealSize)} deal
            </div>
          </div>

          {/* Cost Per Lead (CPL) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Cost Per Lead (CPL)</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {fmt(outputs.costPerLead, 2)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              CPQL: {fmt(outputs.costPerQualifiedLead, 2)}
            </div>
          </div>

          {/* Funnel Efficiency */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Traffic to Deal %</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {formatPercent(outputs.trafficToCustomerRate, 3)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{formatNumber(outputs.customers, 1)} closed won</div>
          </div>
        </div>

        {/* Client Sales Pitch Talk Tracks */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-blue-900">
            <Flame className="w-3.5 h-3.5 text-blue-700" />
            <span>Sales Pitch Talk Track ({currentPlatform.name} in {currentCountry.name}):</span>
          </div>
          <p className="leading-relaxed">
            &ldquo;At a <strong>{fmt(inputs.monthlyAdSpend)}</strong> monthly spend on <strong>{currentPlatform.name}</strong> in <strong>{currentCountry.name}</strong>, we drive approximately <strong>{formatNumber(outputs.expectedTraffic)}</strong> targeted visitors. With a conservative <strong>{inputs.landingPageConversionRate}%</strong> landing page conversion rate, that yields <strong>{formatNumber(outputs.leads, 0)}</strong> leads. Assuming your team qualifies <strong>{inputs.leadQualificationRate}%</strong> into sales discovery calls and closes <strong>{inputs.salesConversionRate}%</strong>, you will add <strong>{formatNumber(outputs.customers, 1)} new clients</strong> per month, generating <strong>{fmt(outputs.revenue, 0)}</strong> at a <strong>{formatMultiplier(outputs.roas, 2)} ROAS</strong>.&rdquo;
          </p>
        </div>

        {/* 6-Platform Authentic Estimations Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Ad Network Comparison (Authentic Estimations)
              </span>
            </div>
            {onOpenPlatformModal && (
              <button
                type="button"
                onClick={onOpenPlatformModal}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Full Matrix & Strategy Specs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {channelEstimations.map(({ platform, outputs: plOutputs, cpcAdjusted }) => {
              const isSelected = platform.id === (inputs.platformId || 'google');
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => onSelectPlatform && onSelectPlatform(platform.id)}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 shadow-xs' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={`Switch active ad platform to ${platform.name}`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: platform.brandColor }} />
                      <span className="truncate">{platform.shortName.split(' ')[0]}</span>
                    </span>
                    <span className={`text-[10px] font-mono font-black ${plOutputs.roas >= 3 ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {formatMultiplier(plOutputs.roas, 1)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono mt-1 font-semibold">
                    {fmt(cpcAdjusted, 2)} CPC
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {formatNumber(plOutputs.customers, 1)} deals ({fmt(plOutputs.cac, 0)} CAC)
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Country-wise Results Preview Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Country-Wise Results Comparison
              </span>
            </div>
            {onOpenCountryModal && (
              <button
                type="button"
                onClick={onOpenCountryModal}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View all {COUNTRIES.length} Countries</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {previewCountries.map(({ country, outputs }) => {
              const isSelected = country.code === currentCountry.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => onSelectCountry && onSelectCountry(country.code)}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-400 shadow-xs' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={`Switch active calculator country to ${country.name}`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                    </span>
                    <span className={`text-[10px] font-mono font-black ${outputs.roas >= 3 ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {formatMultiplier(outputs.roas, 1)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono mt-1 font-semibold">
                    {formatNumber(outputs.customers, 1)} deals
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {formatCurrency(outputs.cac, 0, country.currency, country.locale)} CAC
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};


