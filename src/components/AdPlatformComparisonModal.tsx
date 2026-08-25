import React, { useState, useMemo } from 'react';
import { 
  X, 
  Check, 
  ArrowUpDown, 
  Sparkles, 
  TrendingUp, 
  Info, 
  Zap, 
  DollarSign, 
  Target, 
  Users, 
  ExternalLink,
  Layers,
  ArrowRight,
  Globe
} from 'lucide-react';
import { AdPlatform, FunnelInputs, PlatformId } from '../types';
import { AD_PLATFORMS, getPlatform, calculatePlatformFunnel } from '../data/platforms';
import { getCountry } from '../data/countries';
import { 
  formatCurrency, 
  formatNumber, 
  formatMultiplier 
} from '../utils/calculations';

interface AdPlatformComparisonModalProps {
  inputs: FunnelInputs;
  selectedPlatformId?: PlatformId;
  onSelectPlatform: (platformId: PlatformId) => void;
  onClose: () => void;
}

type SortField = 'roas' | 'revenue' | 'cac' | 'customers' | 'cpc' | 'leads';

export const AdPlatformComparisonModal: React.FC<AdPlatformComparisonModalProps> = ({
  inputs,
  selectedPlatformId = 'google',
  onSelectPlatform,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'deep-dive'>('matrix');
  const [selectedDeepDiveId, setSelectedDeepDiveId] = useState<PlatformId>(selectedPlatformId);
  const [sortField, setSortField] = useState<SortField>('roas');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const country = getCountry(inputs.countryCode || 'US');
  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  // Calculate funnel results for all 6 platforms
  const platformCalculations = useMemo(() => {
    return AD_PLATFORMS.map((platform) => {
      const result = calculatePlatformFunnel(platform, inputs, country);
      return result;
    });
  }, [inputs, country]);

  // Sorted list
  const sortedPlatforms = useMemo(() => {
    return [...platformCalculations].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      switch (sortField) {
        case 'roas':
          valA = a.outputs.roas;
          valB = b.outputs.roas;
          break;
        case 'revenue':
          valA = a.outputs.revenue;
          valB = b.outputs.revenue;
          break;
        case 'cac':
          valA = a.outputs.cac;
          valB = b.outputs.cac;
          break;
        case 'customers':
          valA = a.outputs.customers;
          valB = b.outputs.customers;
          break;
        case 'cpc':
          valA = a.cpcAdjusted;
          valB = b.cpcAdjusted;
          break;
        case 'leads':
          valA = a.outputs.leads;
          valB = b.outputs.leads;
          break;
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [platformCalculations, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const activePlatformDetail = getPlatform(selectedDeepDiveId);
  const activeDetailCalc = platformCalculations.find(p => p.platform.id === selectedDeepDiveId) || platformCalculations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Paid Ad Platforms: Authentic Estimations Matrix
                </h2>
                <span className="text-xs bg-slate-800 text-blue-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-semibold flex items-center gap-1">
                  <span>{country.flag}</span>
                  <span>{country.name} ({country.currency})</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic benchmarks for Meta Ads, Google Ads, LinkedIn Ads, Twitter Ads, Snapchat Ads & TikTok Ads
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Spend Context Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Side-by-Side Matrix (6 Channels)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deep-dive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'deep-dive'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Platform Deep Dive & Specs
            </button>
          </div>

          <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
            <span className="text-slate-500">Simulated Budget:</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {fmt(inputs.monthlyAdSpend)}/mo
            </span>
            <span className="text-slate-500">Deal Size:</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {fmt(inputs.averageDealSize)}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'matrix' ? (
            <div className="space-y-4">
              
              {/* Informational callout banner */}
              <div className="bg-blue-50/80 border border-blue-200/90 rounded-xl p-3.5 text-xs text-blue-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Authentic Estimation Methodology:</strong> These estimations model distinct auction mechanics, user intent levels (Search vs Social vs B2B Professional vs Viral Video), average CPM/CPCs, and downstream sales cycle qualification dynamics for {country.name}.
                </div>
              </div>

              {/* Matrix Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-3.5">Platform & Intent</th>
                        <th 
                          className="py-3 px-3 cursor-pointer hover:bg-slate-200 transition-colors"
                          onClick={() => handleSort('cpc')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Est. CPC</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th 
                          className="py-3 px-3 cursor-pointer hover:bg-slate-200 transition-colors"
                          onClick={() => handleSort('leads')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Leads (CPL)</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th 
                          className="py-3 px-3 cursor-pointer hover:bg-slate-200 transition-colors"
                          onClick={() => handleSort('customers')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Deals Won</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th 
                          className="py-3 px-3 cursor-pointer hover:bg-slate-200 transition-colors"
                          onClick={() => handleSort('cac')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Acq. Cost (CAC)</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th 
                          className="py-3 px-3 cursor-pointer hover:bg-slate-200 transition-colors"
                          onClick={() => handleSort('revenue')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Monthly Revenue</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th 
                          className="py-3 px-3 cursor-pointer hover:bg-slate-200 transition-colors"
                          onClick={() => handleSort('roas')}
                        >
                          <div className="flex items-center gap-1">
                            <span>ROAS</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th className="py-3 px-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sortedPlatforms.map(({ platform, inputs: plInputs, outputs, cpcAdjusted }) => {
                        const isCurrentActive = inputs.platformId === platform.id;
                        const isProfitable = outputs.netProfit > 0;
                        const isGreatRoas = outputs.roas >= 3.0;

                        return (
                          <tr 
                            key={platform.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isCurrentActive ? 'bg-blue-50/60 font-semibold' : ''
                            }`}
                          >
                            {/* Platform Name & Intent */}
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                                  style={{ backgroundColor: platform.brandColor }}
                                />
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{platform.name}</span>
                                    {isCurrentActive && (
                                      <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                                        ACTIVE
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-normal">
                                    {platform.audienceIntent}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Estimated CPC */}
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {fmt(cpcAdjusted, 2)}
                              <div className="text-[10px] text-slate-400 font-normal">
                                {formatNumber(outputs.expectedTraffic)} clicks
                              </div>
                            </td>

                            {/* Leads & CPL */}
                            <td className="py-3 px-3">
                              <div className="font-mono font-bold text-slate-900">
                                {formatNumber(outputs.leads, 1)}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {fmt(outputs.costPerLead, 2)} CPL ({plInputs.landingPageConversionRate}%)
                              </div>
                            </td>

                            {/* Deals Won */}
                            <td className="py-3 px-3">
                              <div className="font-mono font-bold text-slate-900">
                                {formatNumber(outputs.customers, 1)} deals
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {formatNumber(outputs.qualifiedLeads, 1)} SQLs
                              </div>
                            </td>

                            {/* CAC */}
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {fmt(outputs.cac, 0)}
                              <div className="text-[10px] text-slate-500 font-normal">
                                {((outputs.cac / Math.max(1, inputs.averageDealSize)) * 100).toFixed(0)}% deal
                              </div>
                            </td>

                            {/* Revenue */}
                            <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                              {fmt(outputs.revenue, 0)}
                              <div className="text-[10px] text-slate-500 font-mono">
                                Net: {fmt(outputs.netProfit, 0)}
                              </div>
                            </td>

                            {/* ROAS */}
                            <td className="py-3 px-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-black ${
                                isGreatRoas 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : isProfitable 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {formatMultiplier(outputs.roas, 2)}
                              </span>
                            </td>

                            {/* Action Button */}
                            <td className="py-3 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDeepDiveId(platform.id);
                                    setActiveTab('deep-dive');
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 rounded transition-colors cursor-pointer"
                                  title="View detailed platform specs"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectPlatform(platform.id);
                                    onClose();
                                  }}
                                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                    isCurrentActive
                                      ? 'bg-slate-200 text-slate-500 cursor-default'
                                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                                  }`}
                                >
                                  {isCurrentActive ? 'Loaded' : 'Apply'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Summary Cards for 6 Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {AD_PLATFORMS.map((plat) => {
                  const isCurrent = inputs.platformId === plat.id;
                  const plCalc = platformCalculations.find(p => p.platform.id === plat.id);
                  if (!plCalc) return null;

                  return (
                    <div 
                      key={plat.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-300' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: plat.brandColor }}
                          />
                          <h4 className="text-xs font-bold text-slate-900">{plat.name}</h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-blue-700">
                          {formatMultiplier(plCalc.outputs.roas, 2)} ROAS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                        {plat.tagline}
                      </p>
                      <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-slate-200 text-center text-[10px]">
                        <div>
                          <div className="text-slate-400 font-semibold">CPC</div>
                          <div className="font-mono font-bold text-slate-900">{fmt(plCalc.cpcAdjusted, 2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-semibold">Deals</div>
                          <div className="font-mono font-bold text-slate-900">{formatNumber(plCalc.outputs.customers, 1)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-semibold">CAC</div>
                          <div className="font-mono font-bold text-slate-900">{fmt(plCalc.outputs.cac, 0)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* DEEP DIVE TAB */
            <div className="space-y-4">
              
              {/* Platform Selector Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AD_PLATFORMS.map((plat) => {
                  const isSelected = selectedDeepDiveId === plat.id;
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setSelectedDeepDiveId(plat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: plat.brandColor }}
                      />
                      <span>{plat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Platform Detail Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-base shadow-xs"
                      style={{ backgroundColor: activePlatformDetail.brandColor }}
                    >
                      {activePlatformDetail.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{activePlatformDetail.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold">
                          {activePlatformDetail.audienceIntent}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{activePlatformDetail.tagline}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectPlatform(activePlatformDetail.id);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply {activePlatformDetail.name} to Funnel</span>
                  </button>
                </div>

                {/* Benchmark Metrics Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Authentic Industry Benchmark Ranges (US & {country.name})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
                    
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Cost Per Click (CPC)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {fmt(activePlatformDetail.benchmarks.cpc.avg * country.cpcIndex, 2)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {fmt(activePlatformDetail.benchmarks.cpc.low * country.cpcIndex, 2)} - {fmt(activePlatformDetail.benchmarks.cpc.high * country.cpcIndex, 2)}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">CPM (1k Impr.)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {fmt(activePlatformDetail.benchmarks.cpm.avg * country.cpcIndex, 2)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {fmt(activePlatformDetail.benchmarks.cpm.low * country.cpcIndex, 1)} - {fmt(activePlatformDetail.benchmarks.cpm.high * country.cpcIndex, 1)}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Click-Through (CTR)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activePlatformDetail.benchmarks.ctr.avg}%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {activePlatformDetail.benchmarks.ctr.low}% - {activePlatformDetail.benchmarks.ctr.high}%
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Landing Page CVR</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activePlatformDetail.benchmarks.lpCvr.avg}%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {activePlatformDetail.benchmarks.lpCvr.low}% - {activePlatformDetail.benchmarks.lpCvr.high}%
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Lead Qual. (MQL→SQL)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activePlatformDetail.benchmarks.leadQualRate.avg}%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {activePlatformDetail.benchmarks.leadQualRate.low}% - {activePlatformDetail.benchmarks.leadQualRate.high}%
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Sales Close Rate</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activePlatformDetail.benchmarks.salesCloseRate.avg}%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {activePlatformDetail.benchmarks.salesCloseRate.low}% - {activePlatformDetail.benchmarks.salesCloseRate.high}%
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Typical ROAS</div>
                      <div className="font-mono font-bold text-emerald-700 mt-0.5">
                        {activePlatformDetail.benchmarks.typicalRoas.avg}x
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Range: {activePlatformDetail.benchmarks.typicalRoas.low}x - {activePlatformDetail.benchmarks.typicalRoas.high}x
                      </div>
                    </div>

                  </div>
                </div>

                {/* Key Ad Formats & Ideal Verticals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Primary High-Converting Ad Formats</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activePlatformDetail.keyFormats.map((fmtItem, fIdx) => (
                        <span 
                          key={fIdx}
                          className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium border border-slate-200"
                        >
                          {fmtItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Best Suited Verticals & Use Cases</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {activePlatformDetail.bestSuitedFor.map((suit, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{suit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Tactics, Pros & Watchouts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  
                  <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-1.5">
                    <h5 className="font-bold text-blue-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      <span>Proven Tactical Levers</span>
                    </h5>
                    <ul className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                      {activePlatformDetail.keyTactics.map((tac, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold shrink-0">→</span>
                          <span>{tac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                    <h5 className="font-bold text-emerald-900 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Core Advantages</span>
                    </h5>
                    <ul className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                      {activePlatformDetail.pros.map((pro, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                    <h5 className="font-bold text-amber-900 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>Watch Outs & Cautions</span>
                    </h5>
                    <ul className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                      {activePlatformDetail.watchOuts.map((wo, wIdx) => (
                        <li key={wIdx} className="flex items-start gap-1">
                          <span className="text-amber-600 font-bold shrink-0">!</span>
                          <span>{wo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Selected Platform: <strong className="text-slate-900">{getPlatform(inputs.platformId || 'google').name}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
