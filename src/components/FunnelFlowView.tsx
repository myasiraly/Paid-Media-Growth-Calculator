import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  Globe,
  Zap,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building2,
  Target,
  Layers,
  ShieldAlert,
  Sliders,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs, PlatformId } from '../types';
import { getCountry } from '../data/countries';
import { AD_PLATFORMS, getPlatform } from '../data/platforms';
import { INDUSTRY_BENCHMARKS, getBenchmarkCategories } from '../data/benchmarks';
import { 
  calculateFunnel,
  calculateRequiredSpend,
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';
import { MetricTooltip } from './MetricTooltip';
import { SimpleStepSetup } from './SimpleStepSetup';
import { PlainEnglishStory } from './PlainEnglishStory';

interface FunnelFlowViewProps {
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onChangeInput: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
  onSelectPlatform?: (platformId: PlatformId) => void;
  onOpenPlatformModal?: () => void;
  onOpenMethodologyModal?: () => void;
  onOpenBenchmarkModal?: () => void;
  onSelectPreset?: (presetId: string) => void;
  onApplyScenario?: (scenarioInputs: FunnelInputs) => void;
  viewMode?: 'simple' | 'expert';
  onToggleViewMode?: (mode: 'simple' | 'expert') => void;
}

export const FunnelFlowView: React.FC<FunnelFlowViewProps> = ({
  inputs,
  outputs,
  onChangeInput,
  onSelectPlatform,
  onOpenPlatformModal,
  onOpenMethodologyModal,
  onOpenBenchmarkModal,
  onSelectPreset,
  onApplyScenario,
  viewMode = 'simple',
  onToggleViewMode,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const currentPlatform = inputs.platformId ? getPlatform(inputs.platformId) : null;
  const isIndustrySelected = Boolean(inputs.industry && inputs.industry.trim() !== '');
  const isPlatformSelected = Boolean(inputs.platformId);
  const isCalculable = isIndustrySelected && isPlatformSelected;
  
  // Local view mode state if not provided externally
  const [internalViewMode, setInternalViewMode] = useState<'simple' | 'expert'>('simple');
  const activeViewMode = onToggleViewMode ? viewMode : internalViewMode;
  const handleToggleMode = (mode: 'simple' | 'expert') => {
    if (onToggleViewMode) {
      onToggleViewMode(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // Inline adjuster states for Simple Mode
  const [showAdjustStage1, setShowAdjustStage1] = useState(false);
  const [showAdjustStage2, setShowAdjustStage2] = useState(false);
  const [showAdjustStage3, setShowAdjustStage3] = useState(false);
  const [showAdjustStage4, setShowAdjustStage4] = useState(false);

  // Collapsible rationale states per stage
  const [openWhyStage1, setOpenWhyStage1] = useState(false);
  const [openWhyStage2, setOpenWhyStage2] = useState(false);
  const [openWhyStage3, setOpenWhyStage3] = useState(false);
  const [openWhyStage4, setOpenWhyStage4] = useState(false);

  const fmt = (val: number, precision: number = 0) => 
    formatCurrency(val, precision, country.currency, country.locale);

  const getMissingPrompt = () => {
    const missing: string[] = [];
    if (!isIndustrySelected) missing.push('Industry');
    if (!isPlatformSelected) missing.push('Platform');
    if (missing.length === 2) return 'Select Industry & Platform';
    return `Select ${missing.join(' & ')}`;
  };

  // Compute effective target revenue for Goal Seeker calculations
  const effectiveTargetRevenue = useMemo(() => {
    if (!inputs.targetGoalValue) return 0;
    if (inputs.targetGoalType === 'customers') {
      return inputs.targetGoalValue * Math.max(1, inputs.averageDealSize || 1);
    }
    return inputs.targetGoalValue;
  }, [inputs.targetGoalType, inputs.targetGoalValue, inputs.averageDealSize]);

  const goalSeekResults = useMemo(() => {
    if (!isIndustrySelected || !isPlatformSelected || effectiveTargetRevenue <= 0) {
      return { requiredSpend: 0, requiredTraffic: 0, requiredLeads: 0, requiredQualifiedLeads: 0, targetCustomers: 0, expectedRoas: 0 };
    }
    return calculateRequiredSpend(effectiveTargetRevenue, inputs);
  }, [effectiveTargetRevenue, inputs, isIndustrySelected, isPlatformSelected]);

  // 3-Tier Scenarios for side-by-side comparison
  const conservativeInputs: FunnelInputs = useMemo(() => ({
    ...inputs,
    expectedCpc: Number((inputs.expectedCpc * 1.15).toFixed(2)),
    landingPageConversionRate: Math.max(0.5, Number((inputs.landingPageConversionRate * 0.8).toFixed(1))),
    leadQualificationRate: Math.max(5, Number((inputs.leadQualificationRate * 0.85).toFixed(1))),
    salesConversionRate: Math.max(2, Number((inputs.salesConversionRate * 0.85).toFixed(1))),
  }), [inputs]);
  const conservativeOutputs = useMemo(() => calculateFunnel(conservativeInputs), [conservativeInputs]);

  const realisticOutputs = outputs;

  const optimizedInputs: FunnelInputs = useMemo(() => ({
    ...inputs,
    expectedCpc: Math.max(0.1, Number((inputs.expectedCpc * 0.85).toFixed(2))),
    landingPageConversionRate: Math.min(40, Number((inputs.landingPageConversionRate * 1.25).toFixed(1))),
    leadQualificationRate: Math.min(95, Number((inputs.leadQualificationRate * 1.15).toFixed(1))),
    salesConversionRate: Math.min(80, Number((inputs.salesConversionRate * 1.15).toFixed(1))),
  }), [inputs]);
  const optimizedOutputs = useMemo(() => calculateFunnel(optimizedInputs), [optimizedInputs]);

  const handleApplyPlatform = (platformId: PlatformId) => {
    if (onSelectPlatform) {
      onSelectPlatform(platformId);
    } else {
      const plat = getPlatform(platformId);
      const cpc = Number((plat.recommendedDefaults.expectedCpc * country.cpcIndex).toFixed(2));
      onChangeInput('platformId', platformId);
      onChangeInput('channel', plat.name);
      onChangeInput('expectedCpc', Math.max(0.05, cpc));
      onChangeInput('landingPageConversionRate', plat.recommendedDefaults.landingPageConversionRate);
      onChangeInput('leadQualificationRate', plat.recommendedDefaults.leadQualificationRate);
      onChangeInput('salesConversionRate', plat.recommendedDefaults.salesConversionRate);
    }
  };

  const handleApplyIndustry = (presetId: string) => {
    if (onSelectPreset) {
      onSelectPreset(presetId);
    } else {
      const preset = INDUSTRY_BENCHMARKS.find((b) => b.id === presetId);
      if (preset) {
        onChangeInput('industry', preset.name);
        onChangeInput('expectedCpc', Number((preset.defaults.expectedCpc * country.cpcIndex).toFixed(2)));
        onChangeInput('landingPageConversionRate', preset.defaults.landingPageConversionRate);
        onChangeInput('leadQualificationRate', preset.defaults.leadQualificationRate);
        onChangeInput('salesConversionRate', preset.defaults.salesConversionRate);
        onChangeInput('averageDealSize', preset.defaults.averageDealSize);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Quick 3-Step Setup Bar */}
      <SimpleStepSetup
        inputs={inputs}
        onChangeInput={onChangeInput}
        onSelectPlatform={handleApplyPlatform}
        onSelectPreset={handleApplyIndustry}
        onOpenBenchmarkModal={onOpenBenchmarkModal || (() => {})}
        onOpenPlatformModal={onOpenPlatformModal || (() => {})}
        viewMode={activeViewMode}
        onToggleViewMode={handleToggleMode}
      />

      {/* 2. Plain English Growth Pipeline Story */}
      <PlainEnglishStory
        inputs={inputs}
        outputs={outputs}
        isCalculable={isCalculable}
      />

      {/* 3. 4-Stage Interactive Pipeline Header */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>The 4-Step Money Pipeline</span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
              {activeViewMode === 'simple' ? 'Simple Mode' : 'Expert Tuner'}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            See how your marketing investment flows step-by-step into paying clients
          </p>
        </div>

        {onOpenMethodologyModal && (
          <button
            type="button"
            onClick={onOpenMethodologyModal}
            className="text-xs font-bold text-[#00927C] hover:text-[#007b68] flex items-center gap-1 cursor-pointer bg-[#00B69B]/10 px-2.5 py-1 rounded-lg border border-[#00B69B]/30 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>How is this calculated?</span>
          </button>
        )}
      </div>

      {/* STEP 1: Budget & Traffic */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">
                  Step 1: Budget & Traffic
                </h4>
                <MetricTooltip metricKey="monthlyAdSpend" />
              </div>
              <p className="text-xs text-slate-500">
                Monthly ad spend and targeted website clicks from your {currentPlatform?.name || 'online'} campaign
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Step 1 Output</span>
            <span className="text-lg font-black font-mono text-slate-900">
              {isCalculable ? (
                <span>~{formatNumber(outputs.expectedTraffic)} <span className="text-xs font-medium text-slate-500">Visitors / mo</span></span>
              ) : (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-semibold">-- (Complete Setup)</span>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Monthly Ad Budget</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {fmt(inputs.monthlyAdSpend)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Total ad investment</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Cost Per Click (CPC)</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? fmt(inputs.expectedCpc, 2) : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isCalculable ? `${currentPlatform?.shortName} benchmark in ${inputs.industry}` : 'Select Industry & Platform'}
            </div>
          </div>

          <div className="p-3 bg-[#00B69B]/5 border border-[#00B69B]/30 rounded-xl">
            <div className="text-[11px] text-[#00927C] font-semibold">Total Targeted Clicks</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? `~${formatNumber(outputs.expectedTraffic)}` : <span className="text-slate-400 font-mono">--</span>}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Arrive on your landing page</div>
          </div>
        </div>

        {/* Granular Slider Accordion or Expert Mode */}
        {isCalculable && (activeViewMode === 'expert' || showAdjustStage1) && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Custom Cost Per Click (CPC Override)
              </label>
              <span className="font-mono text-xs font-bold text-[#00927C]">{fmt(inputs.expectedCpc, 2)}</span>
            </div>
            <input
              id="expert-cpc-slider"
              type="range"
              min="0.10"
              max="50.00"
              step="0.10"
              value={inputs.expectedCpc}
              onChange={(e) => onChangeInput('expectedCpc', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$0.10</span>
              <span>$10.00</span>
              <span>$25.00</span>
              <span>$50.00</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <MousePointer className="w-3.5 h-3.5 text-[#00927C]" />
            <span>
              {isCalculable ? (
                <>Math: {fmt(inputs.monthlyAdSpend)} spend ÷ {fmt(inputs.expectedCpc, 2)} per click = <strong>{formatNumber(outputs.expectedTraffic)} visitors</strong></>
              ) : (
                <>Math: Select Industry (Step 1) and Platform (Step 2) to calculate visitors</>
              )}
            </span>
          </div>

          {isCalculable && (
            <button
              type="button"
              onClick={() => setShowAdjustStage1(!showAdjustStage1)}
              className="text-[11px] font-bold text-[#00927C] hover:underline cursor-pointer"
            >
              {showAdjustStage1 ? 'Hide Click Price Slider' : '⚙️ Adjust Click Price (CPC)'}
            </button>
          )}
        </div>

      </div>

      {/* FLOW CONNECTOR 1 -> 2 */}
      <div className="flex items-center justify-center -my-3">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
          <ArrowDown className="w-3.5 h-3.5 text-[#00B69B]" />
          <span>
            {isCalculable ? (
              <><strong>{inputs.landingPageConversionRate}%</strong> of visitors fill out your form or call</>
            ) : (
              <>Step 2: Conversion to inquiries & quote requests</>
            )}
          </span>
        </div>
      </div>

      {/* STEP 2: Leads & CVR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 flex items-center justify-center font-black text-sm shrink-0">
              2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">
                  Step 2: Leads & CVR
                </h4>
                <MetricTooltip metricKey="landingPageConversionRate" />
              </div>
              <p className="text-xs text-slate-500">
                Landing page conversion rate and inbound inquiries generated from traffic
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Step 2 Output</span>
            <span className="text-lg font-black font-mono text-slate-900">
              {isCalculable ? (
                <span>~{formatNumber(outputs.leads, 1)} <span className="text-xs font-medium text-slate-500">Leads / mo</span></span>
              ) : (
                <span className="text-slate-400 font-mono text-xs">--</span>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Visitor to Lead Rate (CVR)</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? `${inputs.landingPageConversionRate}%` : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Landing page conversion benchmark</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Cost Per Lead (CPL)</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? fmt(outputs.costPerLead, 0) : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">What each inquiry costs in ads</div>
          </div>

          <div className="p-3 bg-[#00B69B]/5 border border-[#00B69B]/30 rounded-xl">
            <div className="text-[11px] text-[#00927C] font-semibold">Total Monthly Inquiries</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? `~${formatNumber(outputs.leads, 1)}` : <span className="text-slate-400 font-mono">--</span>}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Forms submitted & calls received</div>
          </div>
        </div>

        {/* Granular Slider Accordion or Expert Mode */}
        {isCalculable && (activeViewMode === 'expert' || showAdjustStage2) && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Visitor-to-Lead Conversion Rate (%)
              </label>
              <span className="font-mono text-xs font-bold text-[#00927C]">{inputs.landingPageConversionRate}%</span>
            </div>
            <input
              id="expert-cvr-slider"
              type="range"
              min="0.5"
              max="30.0"
              step="0.5"
              value={inputs.landingPageConversionRate}
              onChange={(e) => onChangeInput('landingPageConversionRate', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.5% (Weak)</span>
              <span>5-8% (Average)</span>
              <span>12-15%+ (High Converting Funnel)</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <MessageSquare className="w-3.5 h-3.5 text-[#00927C]" />
            <span>
              {isCalculable ? (
                <>Math: {formatNumber(outputs.expectedTraffic)} visitors × {inputs.landingPageConversionRate}% = <strong>{formatNumber(outputs.leads, 1)} leads</strong></>
              ) : (
                <>Math: Calculated once Industry & Platform are selected</>
              )}
            </span>
          </div>

          {isCalculable && (
            <button
              type="button"
              onClick={() => setShowAdjustStage2(!showAdjustStage2)}
              className="text-[11px] font-bold text-[#00927C] hover:underline cursor-pointer"
            >
              {showAdjustStage2 ? 'Hide Conversion Slider' : '⚙️ Adjust Lead Conversion Rate (%)'}
            </button>
          )}
        </div>

      </div>

      {/* FLOW CONNECTOR 2 -> 3 */}
      <div className="flex items-center justify-center -my-3">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
          <ArrowDown className="w-3.5 h-3.5 text-[#00B69B]" />
          <span>
            {isCalculable ? (
              <><strong>{inputs.leadQualificationRate}%</strong> of leads are qualified serious buyers who attend a call</>
            ) : (
              <>Step 3: Screening for qualified sales calls</>
            )}
          </span>
        </div>
      </div>

      {/* STEP 3: Sales Pipeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30 flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">
                  Step 3: Sales Pipeline
                </h4>
                <MetricTooltip metricKey="leadQualificationRate" />
              </div>
              <p className="text-xs text-slate-500">
                Lead qualification rate and discovery consultation calls booked with real buyers
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Step 3 Output</span>
            <span className="text-lg font-black font-mono text-slate-900">
              {isCalculable ? (
                <span>~{formatNumber(outputs.qualifiedLeads, 1)} <span className="text-xs font-medium text-slate-500">Sales Calls / mo</span></span>
              ) : (
                <span className="text-slate-400 font-mono text-xs">--</span>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Lead Qualification Rate</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? `${inputs.leadQualificationRate}%` : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Screened for fit & serious intent</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Cost Per Sales Call</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? fmt(outputs.costPerQualifiedLead, 0) : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Ad cost per booked consultation</div>
          </div>

          <div className="p-3 bg-[#00B69B]/5 border border-[#00B69B]/30 rounded-xl">
            <div className="text-[11px] text-[#00927C] font-semibold">Total Sales Calls Held</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? `~${formatNumber(outputs.qualifiedLeads, 1)}` : <span className="text-slate-400 font-mono">--</span>}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">One-on-one sales conversations</div>
          </div>
        </div>

        {/* Granular Slider Accordion or Expert Mode */}
        {isCalculable && (activeViewMode === 'expert' || showAdjustStage3) && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Lead-to-Sales-Call Qualification Rate (%)
              </label>
              <span className="font-mono text-xs font-bold text-[#00927C]">{inputs.leadQualificationRate}%</span>
            </div>
            <input
              id="expert-qual-slider"
              type="range"
              min="5.0"
              max="95.0"
              step="5.0"
              value={inputs.leadQualificationRate}
              onChange={(e) => onChangeInput('leadQualificationRate', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20% (Broad Leads)</span>
              <span>45% (Typical B2B/Local)</span>
              <span>75%+ (Strict High Intent)</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <PhoneCall className="w-3.5 h-3.5 text-[#00927C]" />
            <span>
              {isCalculable ? (
                <>Math: {formatNumber(outputs.leads, 1)} leads × {inputs.leadQualificationRate}% = <strong>{formatNumber(outputs.qualifiedLeads, 1)} sales calls</strong></>
              ) : (
                <>Math: Calculated once Industry & Platform are selected</>
              )}
            </span>
          </div>

          {isCalculable && (
            <button
              type="button"
              onClick={() => setShowAdjustStage3(!showAdjustStage3)}
              className="text-[11px] font-bold text-[#00927C] hover:underline cursor-pointer"
            >
              {showAdjustStage3 ? 'Hide Qualification Slider' : '⚙️ Adjust Qualification Rate (%)'}
            </button>
          )}
        </div>

      </div>

      {/* FLOW CONNECTOR 3 -> 4 */}
      <div className="flex items-center justify-center -my-3">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
          <ArrowDown className="w-3.5 h-3.5 text-[#00B69B]" />
          <span>
            {isCalculable ? (
              <><strong>{inputs.salesConversionRate}%</strong> of sales calls turn into closed paying clients</>
            ) : (
              <>Step 4: Deal closing & revenue realization</>
            )}
          </span>
        </div>
      </div>

      {/* STEP 4: Revenue & ROAS */}
      <div className="bg-white border-2 border-[#00B69B]/40 rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B69B] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">
                  Step 4: Revenue & ROAS
                </h4>
                <MetricTooltip metricKey="customers" />
              </div>
              <p className="text-xs text-slate-500">
                Sales close rate, new paying clients won, gross revenue, and campaign return
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-[#00927C] uppercase tracking-wider block">Step 4 Output</span>
            <span className="text-lg font-black font-mono text-[#00B69B]">
              {isCalculable ? (
                <span>{fmt(outputs.revenue, 0)} <span className="text-xs font-bold text-slate-700">({formatMultiplier(outputs.roas, 1)} ROAS)</span></span>
              ) : (
                <span className="text-slate-400 font-mono text-xs">--</span>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Sales Close Rate</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? `${inputs.salesConversionRate}%` : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Win rate on sales calls</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">New Paying Clients</div>
            <div className="text-base font-bold font-mono text-[#00927C] mt-0.5">
              {isCalculable ? `~${formatNumber(outputs.customers, 1)}` : <span className="text-slate-400 font-mono">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Closed deals / month</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Cost Per Client (CAC)</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {isCalculable ? fmt(outputs.cac, 0) : <span className="text-slate-400">--</span>}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Ad cost to acquire 1 client</div>
          </div>

          <div className="p-3 bg-[#20223A] text-white rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-300 font-medium">Net Profit (After Ads)</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${isCalculable ? (outputs.netProfit >= 0 ? 'text-[#00B69B]' : 'text-rose-400') : 'text-slate-400'}`}>
              {isCalculable ? fmt(outputs.netProfit, 0) : '--'}
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">{isCalculable ? (outputs.netProfit >= 0 ? '✓ Profitable Return' : 'Review deal size') : 'After ad investment'}</div>
          </div>
        </div>

        {/* Granular Slider Accordion or Expert Mode */}
        {isCalculable && (activeViewMode === 'expert' || showAdjustStage4) && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Sales Win / Close Rate (%)
              </label>
              <span className="font-mono text-xs font-bold text-[#00927C]">{inputs.salesConversionRate}%</span>
            </div>
            <input
              id="expert-close-slider"
              type="range"
              min="5.0"
              max="80.0"
              step="5.0"
              value={inputs.salesConversionRate}
              onChange={(e) => onChangeInput('salesConversionRate', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B69B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Cold Sales)</span>
              <span>25% (Standard Discovery)</span>
              <span>45%+ (Warm Referrals/High Intent)</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Trophy className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>
              {isCalculable ? (
                <>Math: {formatNumber(outputs.qualifiedLeads, 1)} calls × {inputs.salesConversionRate}% close × {fmt(inputs.averageDealSize)} deal = <strong>{fmt(outputs.revenue, 0)}</strong></>
              ) : (
                <>Math: Calculated once Industry & Platform are selected</>
              )}
            </span>
          </div>

          {isCalculable && (
            <button
              type="button"
              onClick={() => setShowAdjustStage4(!showAdjustStage4)}
              className="text-[11px] font-bold text-[#00927C] hover:underline cursor-pointer"
            >
              {showAdjustStage4 ? 'Hide Sales Close Slider' : '⚙️ Adjust Sales Close Rate (%)'}
            </button>
          )}
        </div>

      </div>

      {/* 3-Tier Scenario Comparison Forecast */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#20223A] text-[#00B69B] flex items-center justify-center font-black text-sm shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">
                  3-Scenario Forecast (Floor vs Baseline vs Agency Upside)
                </h4>
                <span className="text-[11px] bg-[#00B69B]/10 text-[#00927C] font-bold px-2 py-0.5 rounded border border-[#00B69B]/20">
                  Side-by-Side
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Compare conservative stress-test vs realistic benchmark vs optimized high-converting funnel
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Forecast Status</span>
            <span className="text-xs font-bold text-slate-700">
              {isCalculable ? (
                <span className="text-[#00927C] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3 Scenarios Ready</span>
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  {getMissingPrompt()}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* 1. Conservative (Floor Case) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>Conservative (Floor Case)</span>
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  Stress-Test
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Models +15% higher ad costs and -20% lower conversion rates.
              </p>

              {/* Key Numbers */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Monthly Spend</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(conservativeInputs.monthlyAdSpend)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Visitors</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? formatNumber(conservativeOutputs.expectedTraffic) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Inquiries (Leads)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? formatNumber(conservativeOutputs.leads, 1) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Closed Clients</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? `~${formatNumber(conservativeOutputs.customers, 1)}` : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 font-semibold border-t border-slate-200/80 pt-2">
                  <span>Gross Revenue</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? fmt(conservativeOutputs.revenue, 0) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Net Profit</span>
                  <span className={`font-mono ${isCalculable ? (conservativeOutputs.netProfit >= 0 ? 'text-[#00927C]' : 'text-rose-600') : 'text-slate-400'}`}>
                    {isCalculable ? fmt(conservativeOutputs.netProfit, 0) : '--'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="w-full py-1.5 px-3 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg text-center border border-slate-200">
                Stress-Test Reference
              </div>
            </div>
          </div>

          {/* 2. Realistic (Base Target) */}
          <div className="border-2 border-[#00B69B] rounded-xl p-4 bg-[#00B69B]/5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B69B]" />
                  <span>Realistic (Active Baseline)</span>
                </span>
                <span className="text-[10px] bg-[#00B69B] text-white px-2 py-0.5 rounded font-bold">
                  Active Model
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">
                Anchored to verified industry benchmarks and your deal size.
              </p>

              {/* Key Numbers */}
              <div className="space-y-2 text-xs border-t border-[#00B69B]/20 pt-3">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Monthly Spend</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(inputs.monthlyAdSpend)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Visitors</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? formatNumber(outputs.expectedTraffic) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Inquiries (Leads)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? formatNumber(outputs.leads, 1) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Closed Clients</span>
                  <span className="font-mono font-bold text-[#00927C]">
                    {isCalculable ? `~${formatNumber(outputs.customers, 1)}` : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-800 font-bold border-t border-[#00B69B]/20 pt-2">
                  <span>Gross Revenue</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCalculable ? fmt(outputs.revenue, 0) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Net Profit</span>
                  <span className={`font-mono ${isCalculable ? (outputs.netProfit >= 0 ? 'text-[#00927C]' : 'text-rose-600') : 'text-slate-400'}`}>
                    {isCalculable ? fmt(outputs.netProfit, 0) : '--'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#00B69B]/20">
              <div className="w-full py-1.5 px-3 bg-[#00B69B] text-white text-xs font-bold rounded-lg text-center shadow-2xs">
                ✓ Current Active Calculations
              </div>
            </div>
          </div>

          {/* 3. Optimized (Upside Case) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-[#20223A] text-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B69B]" />
                  <span>Optimized (Agency Upside)</span>
                </span>
                <span className="text-[10px] bg-[#00B69B]/20 text-[#00B69B] border border-[#00B69B]/40 px-2 py-0.5 rounded font-bold">
                  High-Converting
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Achieved with dedicated landing page CRO and instant lead follow-up.
              </p>

              {/* Key Numbers */}
              <div className="space-y-2 text-xs border-t border-slate-700 pt-3">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Monthly Spend</span>
                  <span className="font-mono font-bold text-white">{fmt(optimizedInputs.monthlyAdSpend)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Visitors</span>
                  <span className="font-mono font-bold text-white">
                    {isCalculable ? formatNumber(optimizedOutputs.expectedTraffic) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Inquiries (Leads)</span>
                  <span className="font-mono font-bold text-white">
                    {isCalculable ? formatNumber(optimizedOutputs.leads, 1) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Closed Clients</span>
                  <span className="font-mono font-bold text-[#00B69B]">
                    {isCalculable ? `~${formatNumber(optimizedOutputs.customers, 1)}` : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-200 font-bold border-t border-slate-700 pt-2">
                  <span>Gross Revenue</span>
                  <span className="font-mono font-bold text-white">
                    {isCalculable ? fmt(optimizedOutputs.revenue, 0) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Net Profit</span>
                  <span className="font-mono text-[#00B69B]">
                    {isCalculable ? fmt(optimizedOutputs.netProfit, 0) : '--'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700">
              <div className="w-full py-1.5 px-3 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg text-center border border-slate-700">
                CRO Upside Projection
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
