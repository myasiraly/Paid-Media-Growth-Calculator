import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  HelpCircle, 
  Check, 
  TrendingUp, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { INDUSTRY_BENCHMARKS } from '../data/benchmarks';
import { FunnelInputs } from '../types';
import { formatCurrency } from '../utils/calculations';

interface BenchmarkReferenceModalProps {
  onSelectIndustry: (benchmarkId: string) => void;
  onClose: () => void;
}

export const BenchmarkReferenceModal: React.FC<BenchmarkReferenceModalProps> = ({
  onSelectIndustry,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'industries' | 'channels'>('industries');

  const channelBenchmarks = [
    {
      channel: 'Google Search Ads',
      intent: 'Highest Intent (Active Search)',
      cpcRange: '$2.50 – $12.00+',
      lpCvrRange: '5.0% – 12.0%',
      bestFor: 'High-intent lead generation, emergency services, B2B software, professional services.',
    },
    {
      channel: 'Meta Ads (Facebook & Instagram)',
      intent: 'High Visual / Latent Demand',
      cpcRange: '$0.80 – $3.50',
      lpCvrRange: '7.0% – 16.0%',
      bestFor: 'E-commerce, local clinics, high-ticket coaching, real estate, direct lead forms.',
    },
    {
      channel: 'LinkedIn Ads',
      intent: 'Targeted ICP Decision Makers',
      cpcRange: '$6.00 – $18.00',
      lpCvrRange: '4.0% – 9.0%',
      bestFor: 'Enterprise B2B, HR/Finance tools, ABM (Account-Based Marketing), C-suite targeting.',
    },
    {
      channel: 'Google Performance Max & Shopping',
      intent: 'Commercial High Intent',
      cpcRange: '$0.60 – $2.20',
      lpCvrRange: '2.5% – 5.5%',
      bestFor: 'E-commerce physical catalogs, high SKU stores, multi-channel automated bidding.',
    },
    {
      channel: 'YouTube Ads',
      intent: 'Top of Funnel Video Storytelling',
      cpcRange: '$0.10 – $0.40 (CPV)',
      lpCvrRange: '1.5% – 4.5%',
      bestFor: 'Brand authority, problem-aware demonstration, founder-led stories.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Paid Media Benchmark Reference Sheet</h2>
              <p className="text-xs text-slate-400">
                Industry standards to justify conversion rates and realistic unit costs during sales calls
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
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('industries')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'industries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            By Industry Verticals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'channels'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            By Paid Ad Platform
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {activeTab === 'industries' ? (
            <div className="space-y-4">
              {INDUSTRY_BENCHMARKS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
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
                      className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      Load into Funnel
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">{item.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Typical CPC</div>
                      <div className="font-mono font-bold text-slate-800">
                        ${item.benchmarks.cpc.low} – ${item.benchmarks.cpc.high}
                      </div>
                      <div className="text-[10px] text-slate-500">(Avg: ${item.benchmarks.cpc.avg})</div>
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
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {channelBenchmarks.map((chan, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{chan.channel}</h4>
                    <span className="text-[11px] font-semibold text-slate-500">{chan.intent}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{chan.bestFor}</p>

                  <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Expected CPC</span>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{chan.cpcRange}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Typical Landing Page CVR</span>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{chan.lpCvrRange}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end">
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
