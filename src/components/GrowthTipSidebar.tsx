import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Target, 
  Layers, 
  Zap, 
  HelpCircle,
  Building2,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs, IndustryBenchmark } from '../types';
import { INDUSTRY_BENCHMARKS, getBenchmarkCategories } from '../data/benchmarks';
import { getCountry } from '../data/countries';

interface GrowthTipSidebarProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onSelectIndustry: (benchmarkId: string) => void;
  onOpenBenchmarkModal?: () => void;
  onOpenMethodologyModal?: () => void;
}

export const GrowthTipSidebar: React.FC<GrowthTipSidebarProps> = ({
  inputs,
  outputs,
  onSelectIndustry,
  onOpenBenchmarkModal,
  onOpenMethodologyModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const country = getCountry(inputs.countryCode || 'US');

  // Match the active benchmark
  const activeBenchmark: IndustryBenchmark | undefined = useMemo(() => {
    if (!inputs.industry) return undefined;
    const lower = inputs.industry.toLowerCase().trim();
    return (
      INDUSTRY_BENCHMARKS.find((b) => b.name.toLowerCase() === lower || b.id.toLowerCase() === lower) ||
      INDUSTRY_BENCHMARKS.find((b) => b.defaults.industry.toLowerCase() === lower) ||
      INDUSTRY_BENCHMARKS.find((b) => b.name.toLowerCase().includes(lower) || lower.includes(b.name.toLowerCase()))
    );
  }, [inputs.industry]);

  // Specific tactical conversion playbooks for selected industry categories
  const categoryConversionInsight = useMemo(() => {
    if (!activeBenchmark) return null;
    const cat = activeBenchmark.category;

    switch (cat) {
      case 'Professional & Legal':
        return 'High-ticket legal and corporate services achieve top CVR by offering 1-click consultation booking with direct calendar integration and immediate SMS confirmation within 60 seconds.';
      case 'Healthcare & Medical':
        return 'Healthcare and clinical funnels maximize conversion through verified credential badges, HIPAA trust badges, and frictionless appointment request widgets requiring minimal initial fields.';
      case 'Home Services & Construction':
        return 'Local emergency trades (HVAC, plumbing, roofing, electrical) see 40%+ CVR spikes when placing prominent click-to-call buttons and transparent same-day dispatch guarantees above the fold.';
      case 'Automotive & Transport':
        return 'Automotive and logistics conversion rates scale with transparent upfront vehicle inventory feeds, monthly payment calculators, and instant quote estimation tools.';
      case 'Food & Beverage':
        return 'Food and beverage campaigns convert best using high-resolution visual reels paired with limited-time tasting menus or instant table reservation confirmations.';
      case 'Retail & E-commerce':
        return 'Retail and D2C brands lift conversion by 25–35% by implementing 1-click Apple Pay/Shop Pay checkout, verified customer photo reviews, and tiered threshold free shipping bars.';
      case 'Hospitality & Travel':
        return 'Travel and hospitality experiences achieve peak bookings through scarcity countdown timers, bundle pricing, and virtual 360-degree tour previews.';
      case 'Personal Care & Consumer Services':
        return 'Personal care and beauty providers increase lead conversion by showcasing before-and-after galleries with direct client testimonial reels and introductory package discounts.';
      case 'Education & Community':
        return 'Educational programs boost inquiry-to-application CVR with transparent curriculum syllabi, alumni salary outcome statistics, and free introductory webinar registrations.';
      case 'Technology & Media':
        return 'SaaS and tech platforms convert 30–50% more visitors by replacing static PDF whitepapers with interactive product tour sandboxes and friction-free self-serve trials.';
      case 'Real Estate & Finance':
        return 'Mortgage, banking, and real estate funnels double conversion rates using instant pre-approval rate calculators and neighborhood market valuation tools.';
      case 'Industrial & Energy':
        return 'Industrial and manufacturing funnels convert technical procurement buyers by offering instant CAD/spec sheet downloads and transparent RFQ (Request for Quote) portals.';
      default:
        return 'Targeted message-to-market matching and removing secondary navigation links from landing pages universally lifts conversion rates across paid traffic by 20–35%.';
    }
  }, [activeBenchmark]);

  // Calculate CVR performance comparison against benchmark
  const cvrComparison = useMemo(() => {
    if (!activeBenchmark) return null;
    const currentCvr = inputs.landingPageConversionRate;
    const avgCvr = activeBenchmark.benchmarks.lpCvr.avg;
    const diff = currentCvr - avgCvr;
    const pctDiff = Math.round((diff / Math.max(0.1, avgCvr)) * 100);

    return {
      currentCvr,
      avgCvr,
      diff,
      pctDiff,
      status: diff > 0.5 ? 'above' : diff < -0.5 ? 'below' : 'on-par'
    };
  }, [activeBenchmark, inputs.landingPageConversionRate]);

  // Filtered industry benchmark list for the switcher
  const categories = useMemo(() => ['All', ...getBenchmarkCategories()], []);
  const displayedBenchmarks = useMemo(() => {
    if (selectedCategory === 'All') {
      return INDUSTRY_BENCHMARKS.slice(0, 12);
    }
    return INDUSTRY_BENCHMARKS.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div 
      id="industry-growth-tip-sidebar"
      className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all duration-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1e293b] text-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00B69B]/20 border border-[#00B69B]/40 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-[#00B69B]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00B69B]">Growth Tip</span>
                <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded font-medium">
                  {activeBenchmark ? activeBenchmark.category : 'Dynamic Playbook'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                {activeBenchmark ? activeBenchmark.name : (inputs.industry || 'Multi-Industry Strategy')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors cursor-pointer"
            title={isExpanded ? "Collapse growth tip details" : "Expand growth tip details"}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          
          {/* Main 1-2 Sentence Conversion Rate Growth Tip */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00927C] shrink-0" />
              <span>Conversion Rate Optimization Playbook</span>
            </div>
            
            {activeBenchmark ? (
              <div className="space-y-2 text-emerald-900 text-xs leading-relaxed">
                {activeBenchmark.tips.map((tip, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="text-[#00927C] font-bold shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </p>
                ))}
                {categoryConversionInsight && activeBenchmark.tips.length < 2 && (
                  <p className="flex items-start gap-2 text-emerald-950 font-medium">
                    <span className="text-[#00927C] font-bold shrink-0 mt-0.5">•</span>
                    <span>{categoryConversionInsight}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-emerald-900 leading-relaxed">
                Select any industry vertical below to load 1-2 battle-tested conversion rate growth tips and authentic performance benchmarks tailored to your target niche.
              </p>
            )}
          </div>

          {/* Key Metric Conversion Levers & Benchmark Comparison */}
          {activeBenchmark && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-500" />
                  <span>Industry Benchmark Targets</span>
                </span>
                <span className="text-slate-500 font-normal font-mono text-[10px]">
                  Niche Standard
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Landing Page CVR */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-medium">Target LP CVR</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeBenchmark.benchmarks.lpCvr.avg.toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    {activeBenchmark.benchmarks.lpCvr.low}% - {activeBenchmark.benchmarks.lpCvr.high}%
                  </div>
                </div>

                {/* Lead Qual Rate */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-medium">Lead Qual Rate</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeBenchmark.benchmarks.leadQualRate.avg.toFixed(0)}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    {activeBenchmark.benchmarks.leadQualRate.low}% - {activeBenchmark.benchmarks.leadQualRate.high}%
                  </div>
                </div>

                {/* Close Rate */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-medium">Sales Close</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeBenchmark.benchmarks.salesCloseRate.avg.toFixed(0)}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    {activeBenchmark.benchmarks.salesCloseRate.low}% - {activeBenchmark.benchmarks.salesCloseRate.high}%
                  </div>
                </div>
              </div>

              {/* Real-time comparison badge against user inputs */}
              {cvrComparison && (
                <div className="flex items-center justify-between bg-slate-100/80 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700">
                  <span className="text-slate-600">Your Current Funnel CVR:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 font-bold">{cvrComparison.currentCvr}%</strong>
                    {cvrComparison.status === 'above' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{Math.abs(cvrComparison.pctDiff)}% above avg
                      </span>
                    )}
                    {cvrComparison.status === 'below' && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {cvrComparison.pctDiff}% vs avg
                      </span>
                    )}
                    {cvrComparison.status === 'on-par' && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                        At Industry Avg
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actionable Conversion Catalysts Specific to Vertical */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Conversion Velocity Levers ({activeBenchmark ? activeBenchmark.name : 'All Verticals'})</span>
            </div>
            
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00B69B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Speed-to-Lead:</strong> Contacting inbound inquiries in under 5 minutes increases qualification conversion rates by <strong>391%</strong>.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00B69B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Mobile Friction Reduction:</strong> Single-column layouts with autofill address/email fields increase mobile landing page conversion by <strong>24%</strong>.
                </span>
              </li>
              {activeBenchmark && (
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B69B] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Offer Specificity:</strong> Framing copy around specific outcomes (e.g. "{activeBenchmark.name} ROI Guarantee") lowers cost per acquisition by <strong>18–30%</strong>.
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Industry Preset Quick Switcher */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Explore Other Industry Tips</span>
              </span>
              {onOpenBenchmarkModal && (
                <button
                  type="button"
                  onClick={onOpenBenchmarkModal}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-0.5"
                >
                  <span>All {INDUSTRY_BENCHMARKS.length} Verticals</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Industry quick items */}
            <div className="flex flex-wrap gap-1">
              {displayedBenchmarks.map((bench) => {
                const isSelected = inputs.industry === bench.name || activeBenchmark?.id === bench.id;
                return (
                  <button
                    key={bench.id}
                    type="button"
                    onClick={() => onSelectIndustry(bench.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer truncate max-w-[170px] text-left flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#00B69B] text-white shadow-2xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                    title={`Click to load growth tips for ${bench.name}`}
                  >
                    <span className="truncate">{bench.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
