import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  Check, 
  Sparkles, 
  Building2, 
  User, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Layers, 
  ShieldCheck, 
  Calendar,
  Globe,
  Share2
} from 'lucide-react';
import { FunnelInputs, FunnelOutputs } from '../types';
import { getCountry } from '../data/countries';
import { getPlatform } from '../data/platforms';
import { exportFunnelToPdf } from '../utils/exportPdf';
import { exportFunnelToCsv } from '../utils/exportCsv';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier 
} from '../utils/calculations';
import { GHLArmyLogo } from './GHLArmyLogo';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  onChangeInput?: <K extends keyof FunnelInputs>(key: K, value: FunnelInputs[K]) => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  outputs,
  onChangeInput,
}) => {
  const country = getCountry(inputs.countryCode || 'US');
  const platform = inputs.platformId ? getPlatform(inputs.platformId) : null;
  const isCalculable = Boolean(inputs.platformId && inputs.industry);

  const [clientName, setClientName] = useState(inputs.clientName || 'Acme Dental & Wellness');
  const [preparedBy, setPreparedBy] = useState('Growth & Media Strategy Team');
  const [executiveNotes, setExecutiveNotes] = useState(
    `1. Launch targeted advertising campaign on ${platform?.name || 'Search & Social'} in ${country.name}.\n` +
    `2. Deploy dedicated landing page optimized for ${inputs.landingPageConversionRate || 8.5}% conversion.\n` +
    `3. Track weekly SQL acquisition against target CAC of ${formatCurrency(outputs.cac || 500, 0, country.currency, country.locale)}.`
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const fmt = (val: number, precision: number = 0) =>
    formatCurrency(val, precision, country.currency, country.locale);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      exportFunnelToPdf(inputs, outputs, {
        clientName,
        preparedBy,
        executiveNotes,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="pdf-report-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="pdf-report-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#20223A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00B69B]/20 border border-[#00B69B]/40 text-[#00B69B]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Client Presentation PDF Report
                </h3>
                <span className="text-[10px] bg-[#00B69B] text-white px-2 py-0.5 rounded font-bold">
                  Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Generate an executive 1-page proposal with unit economics and deterministic math proof
              </p>
            </div>
          </div>

          <button
            id="close-pdf-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Client / Prospect Name
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="pdf-client-name-input"
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (onChangeInput) onChangeInput('clientName', e.target.value);
                }}
                placeholder="e.g. Apex Legal Partners"
                className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00B69B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Prepared By / Agency Name
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="pdf-prepared-by-input"
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="e.g. Growth & Acquisition Advisory"
                className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00B69B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Body / Live Document Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-100/60">
          
          {/* Document Sheet Simulation */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-md max-w-3xl mx-auto space-y-5">
            
            {/* Sheet Header */}
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest text-[#00927C] uppercase font-mono">
                    GHL ARMY • EXECUTIVE FORECAST
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Paid Media Growth & Unit Economics Report
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prepared for <strong className="text-slate-900">{clientName}</strong> • {inputs.industry || 'General Industry'}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Report Date</span>
                <span className="text-xs font-bold text-slate-800">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="text-[11px] text-[#00927C] font-semibold mt-0.5">
                  {country.flag} {country.name} ({country.currency})
                </div>
              </div>
            </div>

            {/* Scorecard Hero KPIs (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Monthly Revenue</span>
                <span className="text-base font-extrabold font-mono text-slate-900 block mt-0.5">
                  {isCalculable ? fmt(outputs.revenue, 0) : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isCalculable ? `${formatNumber(outputs.customers, 1)} deals @ ${fmt(inputs.averageDealSize)}` : 'Select Industry'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#00B69B]/10 border border-[#00B69B]/30">
                <span className="text-[10px] font-bold text-[#00927C] uppercase block">Net Ad Profit</span>
                <span className="text-base font-extrabold font-mono text-[#00927C] block mt-0.5">
                  {isCalculable ? `${outputs.netProfit >= 0 ? '+' : ''}${fmt(outputs.netProfit, 0)}` : '--'}
                </span>
                <span className="text-[10px] text-slate-600 block">
                  {isCalculable ? `${formatMultiplier(outputs.roas, 2)} Return On Spend` : 'Select Platform'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Target ROAS</span>
                <span className="text-base font-extrabold font-mono text-slate-900 block mt-0.5">
                  {isCalculable ? formatMultiplier(outputs.roas, 2) : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isCalculable ? `${outputs.roasPercentage.toFixed(0)}% ROAS` : '--'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Cost Per Client (CAC)</span>
                <span className="text-base font-extrabold font-mono text-slate-900 block mt-0.5">
                  {isCalculable ? fmt(outputs.cac, 0) : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Break-even: {fmt(inputs.averageDealSize)}
                </span>
              </div>
            </div>

            {/* 4-Step Funnel Pipeline Table Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4-Step Inbound Acquisition Funnel
                </h5>
                <span className="text-[10px] text-slate-500 font-mono">
                  Channel: {platform?.name || 'Search & Social Ads'}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Step Name</th>
                      <th className="p-2.5">Conversion Formula</th>
                      <th className="p-2.5">Monthly Volume</th>
                      <th className="p-2.5">Unit Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">Step 1: Budget & Traffic</td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {fmt(inputs.monthlyAdSpend)} Spend ÷ {fmt(inputs.expectedCpc, 2)} CPC
                      </td>
                      <td className="p-2.5 font-bold font-mono">
                        {isCalculable ? `${formatNumber(outputs.expectedTraffic)} Clicks` : '--'}
                      </td>
                      <td className="p-2.5 text-[#00927C] font-semibold">
                        CPC: {fmt(inputs.expectedCpc, 2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">Step 2: Leads & CVR</td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {formatNumber(outputs.expectedTraffic)} Visitors × {inputs.landingPageConversionRate}% CVR
                      </td>
                      <td className="p-2.5 font-bold font-mono">
                        {isCalculable ? `${formatNumber(outputs.leads, 1)} Leads` : '--'}
                      </td>
                      <td className="p-2.5 text-[#00927C] font-semibold">
                        CPL: {fmt(outputs.costPerLead, 2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">Step 3: Sales Pipeline</td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {formatNumber(outputs.leads, 1)} Leads × {inputs.leadQualificationRate}% Qual
                      </td>
                      <td className="p-2.5 font-bold font-mono">
                        {isCalculable ? `${formatNumber(outputs.qualifiedLeads, 1)} Discovery Calls` : '--'}
                      </td>
                      <td className="p-2.5 text-[#00927C] font-semibold">
                        CPQL: {fmt(outputs.costPerQualifiedLead, 2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/40">
                      <td className="p-2.5 font-bold text-slate-900">Step 4: Revenue & ROAS</td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {formatNumber(outputs.qualifiedLeads, 1)} Calls × {inputs.salesConversionRate}% Close
                      </td>
                      <td className="p-2.5 font-bold font-mono text-[#00927C]">
                        {isCalculable ? `~${formatNumber(outputs.customers, 1)} Clients Won` : '--'}
                      </td>
                      <td className="p-2.5 text-[#00927C] font-bold">
                        {isCalculable ? `${fmt(outputs.revenue, 0)} (${formatMultiplier(outputs.roas, 1)} ROAS)` : '--'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Notes Customizer */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Executive Notes & Recommendations (Appears in PDF footer)
              </label>
              <textarea
                id="pdf-executive-notes-textarea"
                rows={3}
                value={executiveNotes}
                onChange={(e) => setExecutiveNotes(e.target.value)}
                className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00B69B] focus:outline-none"
              />
            </div>

            {/* Footer Notice */}
            <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
              CONFIDENTIAL • PREPARED BY {preparedBy.toUpperCase()} • POWERED BY GHL ARMY
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="export-csv-from-modal-btn"
              type="button"
              onClick={() => exportFunnelToCsv(inputs, outputs)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Export CSV
            </button>
            <button
              id="print-summary-btn"
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              id="cancel-pdf-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              id="confirm-download-pdf-btn"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00B69B] to-[#00927C] hover:opacity-95 text-white transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
