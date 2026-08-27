import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  TrendingUp, 
  ArrowUpRight,
  ExternalLink,
  Zap,
  Target,
  Building2,
  Filter
} from 'lucide-react';
import { INDUSTRY_BENCHMARKS, getBenchmarkCategories } from '../data/benchmarks';
import { AD_PLATFORMS, getPlatform } from '../data/platforms';
import { FunnelInputs, PlatformId } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface BenchmarkReferenceModalProps {
  onSelectIndustry: (benchmarkId: string) => void;
  onSelectPlatform?: (platformId: PlatformId) => void;
  onClose: () => void;
}

export const BenchmarkReferenceModal: React.FC<BenchmarkReferenceModalProps> = ({
  onSelectIndustry,
  onSelectPlatform,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'industries' | 'channels'>('industries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => ['All', ...getBenchmarkCategories()], []);

  const filteredIndustries = useMemo(() => {
    return INDUSTRY_BENCHMARKS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.defaults.channel?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Paid Media Benchmark Reference Sheet</h2>
              <p className="text-xs text-slate-400">
                Authentic benchmarks for {INDUSTRY_BENCHMARKS.length} industry verticals and 6 major ad networks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4 shrink-0 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('industries')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'industries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Industry Verticals ({INDUSTRY_BENCHMARKS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'channels'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>6 Major Ad Networks ({AD_PLATFORMS.length})</span>
          </button>
        </div>

        {/* Search & Category Filter Toolbar (for industries tab) */}
        {activeTab === 'industries' && (
          <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all industries, sub-sectors, or keywords (e.g. Legal, Dental, Accounting, Roofing, Farming, Fashion...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? INDUSTRY_BENCHMARKS.length 
                  : INDUSTRY_BENCHMARKS.filter(b => b.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} <span className={`ml-1 text-[10px] opacity-80 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'industries' ? (
            <div className="space-y-4">
              {filteredIndustries.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm font-semibold text-slate-600">No industries found matching "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for a different keyword or reset category filter.</p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-xs hover:bg-blue-100 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredIndustries.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectIndustry(item.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-xs transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Load into Funnel</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mb-3">{item.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Typical CPC</div>
                        <div className="font-mono font-bold text-slate-800">
                          ${item.benchmarks.cpc.low.toFixed(2)} – ${item.benchmarks.cpc.high.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">(Avg: ${item.benchmarks.cpc.avg.toFixed(2)})</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">LP Conv. Rate</div>
                        <div className="font-mono font-bold text-slate-800">
                          {item.benchmarks.lpCvr.low}% – {item.benchmarks.lpCvr.high}%
                        </div>
                        <div className="text-[10px] text-slate-500">(Avg: {item.benchmarks.lpCvr.avg}%)</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Lead Qual. Rate</div>
                        <div className="font-mono font-bold text-slate-800">
                          {item.benchmarks.leadQualRate.low}% – {item.benchmarks.leadQualRate.high}%
                        </div>
                        <div className="text-[10px] text-slate-500">(Avg: {item.benchmarks.leadQualRate.avg}%)</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Sales Close Rate</div>
                        <div className="font-mono font-bold text-slate-800">
                          {item.benchmarks.salesCloseRate.low}% – {item.benchmarks.salesCloseRate.high}%
                        </div>
                        <div className="text-[10px] text-slate-500">(Avg: {item.benchmarks.salesCloseRate.avg}%)</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-col gap-1">
                      {item.tips.map((tip, tIdx) => (
                        <div key={tIdx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {AD_PLATFORMS.map((plat) => (
                <div
                  key={plat.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: plat.brandColor }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{plat.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {plat.audienceIntent}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{plat.tagline}</p>
                      </div>
                    </div>

                    {onSelectPlatform && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPlatform(plat.id);
                          onClose();
                        }}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Load Platform</span>
                      </button>
                    )}
                  </div>

                  {/* Benchmark Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-xs mt-2">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Typical CPC</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        ${plat.benchmarks.cpc.low.toFixed(2)} – ${plat.benchmarks.cpc.high.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-blue-600 font-semibold">(Avg: ${plat.benchmarks.cpc.avg.toFixed(2)})</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Typical CPM</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        ${plat.benchmarks.cpm.low.toFixed(2)} – ${plat.benchmarks.cpm.high.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">(Avg: ${plat.benchmarks.cpm.avg.toFixed(2)})</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">CTR</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {plat.benchmarks.ctr.low}% – {plat.benchmarks.ctr.high}%
                      </div>
                      <div className="text-[10px] text-slate-500">(Avg: {plat.benchmarks.ctr.avg}%)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Landing Page CVR</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {plat.benchmarks.lpCvr.low}% – {plat.benchmarks.lpCvr.high}%
                      </div>
                      <div className="text-[10px] text-slate-500">(Avg: {plat.benchmarks.lpCvr.avg}%)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Benchmark ROAS</div>
                      <div className="font-mono font-black text-emerald-700 mt-0.5">
                        {plat.benchmarks.typicalRoas.low}x – {plat.benchmarks.typicalRoas.high}x
                      </div>
                      <div className="text-[10px] text-slate-500">Qual: {plat.benchmarks.leadQualRate.avg}%</div>
                    </div>
                  </div>

                  {/* Tactics */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-700">Winning Formats:</span>{' '}
                      <span className="text-slate-600">{plat.keyFormats.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Best Suited For:</span>{' '}
                      <span className="text-slate-600">{plat.bestSuitedFor.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{activeTab === 'industries' ? filteredIndustries.length : AD_PLATFORMS.length}</span> benchmark models
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
