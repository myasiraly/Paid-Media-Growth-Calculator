import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  Target, 
  Building2, 
  Share2, 
  DollarSign, 
  Users, 
  Calculator, 
  ShieldCheck, 
  ChevronRight,
  Sliders,
  Globe,
  Award
} from 'lucide-react';
import { GHLArmyLogo } from './GHLArmyLogo';

interface QuickStartTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndustryClick?: () => void;
}

export const QuickStartTourModal: React.FC<QuickStartTourModalProps> = ({
  isOpen,
  onClose,
  onSelectIndustryClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight') {
        if (currentSlide < 2) setCurrentSlide((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, dontShowAgain]);

  if (!isOpen) return null;

  const handleComplete = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('has_seen_quickstart_tour', 'true');
      } catch {
        // ignore
      }
    }
    onClose();
  };

  const slides = [
    {
      step: 'Step 1 of 3',
      badge: 'Groundwork & Benchmarks',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Establish Instant Market Credibility',
      tagline: 'Stop guessing costs in sales meetings. Ground every projection in verified data.',
      description:
        'Select your prospect’s exact niche and target ad platform to load authentic industry Cost-per-Click (CPC) and baseline conversion rates.',
      highlights: [
        {
          icon: Building2,
          title: '60+ Specialized Industries',
          desc: 'From MedSpa and Legal to SaaS, B2B, and E-Commerce with authentic CPC benchmarks.',
        },
        {
          icon: Target,
          title: '6 Major Ad Platforms',
          desc: 'Compare Google Search, Meta, LinkedIn, TikTok, YouTube, and Pinterest multipliers.',
        },
        {
          icon: Globe,
          title: 'Global Currency & Country Indexes',
          desc: 'Instantly calibrate purchasing power across 10+ international markets.',
        },
      ],
      proTip: 'Sales Tip: Never pitch ad spend without verified industry CPCs. It immediately disarms pricing skepticism.',
    },
    {
      step: 'Step 2 of 3',
      badge: 'The 4-Step Funnel Journey',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Walk the Client from Click to Cash',
      tagline: 'Transform abstract media spend into concrete booked sales calls and gross revenue.',
      description:
        'Walk through the 4 steps with your prospect. Involve them by asking for their average deal size and sales closing rate.',
      highlights: [
        {
          icon: DollarSign,
          title: 'Step 1: Budget & Traffic',
          desc: 'Ad Spend ÷ Expected CPC = High-intent website visitors arriving on the page.',
        },
        {
          icon: Users,
          title: 'Step 2: Leads & CVR',
          desc: 'Visitors × Landing Page Conversion Rate = Inbound quote requests and leads.',
        },
        {
          icon: Sliders,
          title: 'Step 3: Sales Pipeline',
          desc: 'Leads × Qualification Rate = Confirmed discovery consultations with real buyers.',
        },
        {
          icon: Award,
          title: 'Step 4: Revenue & ROAS',
          desc: 'Discovery Calls × Close Rate × Deal Size = Closed Clients, Gross Revenue, and Net Profit.',
        },
      ],
      proTip: 'Sales Tip: When prospects specify their own close rate and deal size, they take psychological ownership of the revenue projection.',
    },
    {
      step: 'Step 3 of 3',
      badge: 'Closing the Deal',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      title: 'De-Risk Decisions & Close with Confidence',
      tagline: 'Handle "What If?" objections on the fly with reverse goal seeking and proposal decks.',
      description:
        'Use built-in sales enablement tools during your live pitch to answer client questions with mathematically sound clarity.',
      highlights: [
        {
          icon: Target,
          title: 'Reverse Goal Seeker',
          desc: 'Client has a $50k revenue target? Click Goal Seeker to reverse-engineer the required budget in 1 second.',
        },
        {
          icon: TrendingUp,
          title: '3-Way Scenario Modeling',
          desc: 'Present Conservative, Realistic, and Aggressive forecasts to anchor expectations and mitigate risk.',
        },
        {
          icon: Share2,
          title: 'Client Pitch Deck & Share Link',
          desc: 'Open the Pitch Summary for boardroom-ready talking points, or copy a 1-click shareable link.',
        },
      ],
      proTip: 'Sales Tip: Send the encoded shareable URL immediately after your meeting so stakeholders can verify the math themselves.',
    },
  ];

  const current = slides[currentSlide];

  return (
    <div 
      id="quick-start-tour-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleComplete();
      }}
    >
      <div 
        id="quick-start-tour-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header bar */}
        <div className="bg-gradient-to-r from-slate-900 via-[#181a30] to-slate-900 px-6 py-5 text-white flex items-center justify-between relative border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-[#00B69B] shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Quick Start: Driving Sales with Paid Media
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                30-second guide to presenting unit economics that close clients
              </p>
            </div>
          </div>

          <button
            id="close-tour-btn"
            type="button"
            onClick={handleComplete}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Slide Navigation Pills */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-[#00B69B] text-white shadow-xs'
                    : currentSlide > idx
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                <span>{idx + 1}</span>
                <span className="hidden sm:inline">
                  {idx === 0 ? 'Benchmarks' : idx === 1 ? '4-Step Funnel' : 'Closing Deals'}
                </span>
                {currentSlide > idx && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500 font-medium">
            {currentSlide + 1} of {slides.length}
          </span>
        </div>

        {/* Modal Body / Slide Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Headline and Tagline */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.badgeColor}`}>
                {current.badge}
              </span>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {current.step}
              </span>
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {current.title}
            </h4>
            <p className="text-sm font-medium text-[#00927C]">
              {current.tagline}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
              {current.description}
            </p>
          </div>

          {/* 3 or 4 Feature Highlights */}
          <div className={`grid gap-2.5 ${currentSlide === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {current.highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#00B69B] shrink-0 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pro Sales Tip callout */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start gap-3">
            <div className="p-1 rounded-md bg-amber-500 text-white shrink-0 mt-0.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-medium text-amber-950 leading-relaxed">
              {current.proTip}
            </p>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              id="dont-show-tour-checkbox"
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#00B69B] focus:ring-[#00B69B] cursor-pointer"
            />
            <span>Don't show this tour on next visit</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentSlide > 0 ? (
              <button
                id="tour-prev-btn"
                type="button"
                onClick={() => setCurrentSlide((prev) => prev - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                id="tour-skip-btn"
                type="button"
                onClick={handleComplete}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>
            )}

            {currentSlide < slides.length - 1 ? (
              <button
                id="tour-next-btn"
                type="button"
                onClick={() => setCurrentSlide((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00B69B] hover:bg-[#009e86] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Next Slide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="tour-finish-btn"
                type="button"
                onClick={() => {
                  handleComplete();
                  if (onSelectIndustryClick) {
                    onSelectIndustryClick();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00B69B] to-[#00927C] hover:opacity-95 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Start Calculating</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
