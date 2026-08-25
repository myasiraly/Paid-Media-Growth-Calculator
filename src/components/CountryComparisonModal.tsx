import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  X, 
  Search, 
  ArrowUpDown, 
  Check, 
  Copy, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import { FunnelInputs, CountryConfig } from '../types';
import { COUNTRIES, getCountry, calculateCountryFunnel } from '../data/countries';
import { formatCurrency, formatNumber, formatMultiplier } from '../utils/calculations';

interface CountryComparisonModalProps {
  inputs: FunnelInputs;
  onSelectCountry: (country: CountryConfig, applyCpcAdjustment: boolean) => void;
  onClose: () => void;
}

type SortField = 'roas' | 'revenue' | 'customers' | 'cac' | 'cpc' | 'traffic';

export const CountryComparisonModal: React.FC<CountryComparisonModalProps> = ({
  inputs,
  onSelectCountry,
  onClose,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('roas');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeCountry = getCountry(inputs.countryCode || 'US');

  // Compute funnel projections for each country
  const countryResults = useMemo(() => {
    return COUNTRIES.map((c) => {
      const res = calculateCountryFunnel(c, inputs);
      return {
        country: c,
        outputs: res.outputs,
        cpcAdjusted: res.cpcAdjusted,
        isCurrent: c.code === activeCountry.code,
      };
    });
  }, [inputs, activeCountry]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let list = countryResults.filter((item) => {
      const matchesRegion = selectedRegion === 'All' || item.country.region === selectedRegion || (selectedRegion === 'Tier 1' && item.country.marketTier === 'Tier 1');
      const matchesSearch = item.country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.currency.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });

    list.sort((a, b) => {
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
        case 'customers':
          valA = a.outputs.customers;
          valB = b.outputs.customers;
          break;
        case 'cac':
          valA = a.outputs.cac;
          valB = b.outputs.cac;
          break;
        case 'cpc':
          valA = a.cpcAdjusted;
          valB = b.cpcAdjusted;
          break;
        case 'traffic':
          valA = a.outputs.expectedTraffic;
          valB = b.outputs.expectedTraffic;
          break;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [countryResults, selectedRegion, searchQuery, sortField, sortAsc]);

  const regions = ['All', 'Tier 1', 'North America', 'Europe', 'Asia-Pacific', 'Middle East', 'Latin America'];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const copyTableMarkdown = () => {
    let md = `### Country-Wise Paid Media Performance Comparison\n`;
    md += `Base Monthly Spend: ${formatCurrency(inputs.monthlyAdSpend, 0, activeCountry.currency, activeCountry.locale)} | Industry: ${inputs.industry || 'General'}\n\n`;
    md += `| Country | Market Tier | Currency | Est. CPC | Traffic | Leads | Deals | CAC | Projected Revenue | ROAS |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    filteredAndSorted.forEach(({ country, outputs, cpcAdjusted }) => {
      md += `| ${country.flag} ${country.name} | ${country.marketTier} | ${country.currency} | ${formatCurrency(cpcAdjusted, 2, country.currency, country.locale)} | ${formatNumber(outputs.expectedTraffic)} | ${formatNumber(outputs.leads, 1)} | ${formatNumber(outputs.customers, 1)} | ${formatCurrency(outputs.cac, 0, country.currency, country.locale)} | ${formatCurrency(outputs.revenue, 0, country.currency, country.locale)} | ${formatMultiplier(outputs.roas, 2)} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Country-Wise Results & Market Matrix</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold">
                  Global Geo Benchmark
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model how your budget performs across international auction markets with localized CPC indices and currencies
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          
          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Search & Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search country / currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={copyTableMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
              title="Copy comparison table in Markdown format"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Table!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Table</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Active Benchmark Summary Note */}
        <div className="bg-blue-50/70 border-b border-blue-200/70 px-5 py-2.5 flex items-center justify-between text-xs text-blue-950 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{activeCountry.flag}</span>
            <span>
              Active Target Market: <strong>{activeCountry.name} ({activeCountry.currency})</strong> · Budget: <strong>{formatCurrency(inputs.monthlyAdSpend, 0, activeCountry.currency, activeCountry.locale)}</strong>
            </span>
          </div>
          <span className="text-slate-500 hidden md:inline text-[11px]">
            Click <strong>"Set as Active"</strong> on any row to instantly simulate that country in your main funnel.
          </span>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3.5 whitespace-nowrap">Country / Region</th>
                  <th className="py-3 px-3 whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleSort('cpc')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Est. CPC</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleSort('traffic')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Traffic (Clicks)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 whitespace-nowrap">Leads / SQLs</th>
                  <th className="py-3 px-3 whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleSort('customers')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Deals Won</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleSort('cac')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Est. CAC</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleSort('revenue')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Projected Revenue</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleSort('roas')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer text-blue-700"
                    >
                      <span>Expected ROAS</span>
                      <ArrowUpDown className="w-3 h-3 text-blue-600" />
                    </button>
                  </th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSorted.map(({ country, outputs, cpcAdjusted, isCurrent }) => {
                  const isGreat = outputs.roas >= 3.0;
                  return (
                    <tr
                      key={country.code}
                      className={`hover:bg-slate-50 transition-colors ${
                        isCurrent ? 'bg-blue-50/50 font-medium' : ''
                      }`}
                    >
                      {/* Country Info */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{country.flag}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{country.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{country.region}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-600 font-semibold">{country.currency}</span>
                              <span>•</span>
                              <span className="text-[10px] px-1 bg-slate-100 rounded text-slate-600">{country.marketTier}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Est CPC */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-800">
                          {formatCurrency(cpcAdjusted, 2, country.currency, country.locale)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {(country.cpcIndex * 100).toFixed(0)}% US baseline
                        </div>
                      </td>

                      {/* Traffic */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-semibold text-slate-900">
                          {formatNumber(outputs.expectedTraffic)}
                        </div>
                        <div className="text-[10px] text-slate-500">clicks / mo</div>
                      </td>

                      {/* Leads / SQLs */}
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800 font-semibold">
                          {formatNumber(outputs.leads, 1)} leads
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {formatNumber(outputs.qualifiedLeads, 1)} SQLs
                        </div>
                      </td>

                      {/* Deals Won */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900">
                          {formatNumber(outputs.customers, 1)}
                        </div>
                        <div className="text-[10px] text-slate-500">deals / mo</div>
                      </td>

                      {/* CAC */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-800">
                          {formatCurrency(outputs.cac, 0, country.currency, country.locale)}
                        </div>
                        <div className="text-[10px] text-slate-500">per client</div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-emerald-700">
                          {formatCurrency(outputs.revenue, 0, country.currency, country.locale)}
                        </div>
                        <div className="text-[10px] text-slate-500">gross revenue</div>
                      </td>

                      {/* ROAS */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black font-mono border ${
                          isGreat 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : outputs.roas >= 1.5 
                            ? 'bg-blue-50 text-blue-800 border-blue-200' 
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {formatMultiplier(outputs.roas, 2)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3.5 text-right">
                        {isCurrent ? (
                          <span className="text-[11px] text-slate-400 font-semibold">Active</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCountry(country, true);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Set Active</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strategic Insight Box */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Cross-Border Geo Arbitrage Strategy</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Countries like the <strong>UK (0.82x)</strong>, <strong>Canada (0.78x)</strong>, and <strong>Germany (0.74x)</strong> deliver high conversion intent at <strong>18% to 26% lower CPCs</strong> than North American tier-1 auctions. Allocating budget across these geos lowers blended CAC significantly.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Emerging & High-Volume Markets</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Markets like <strong>India (0.22x)</strong> and <strong>Brazil (0.32x)</strong> generate immense top-of-funnel visitor volumes. Ensure your qualification form filters for genuine ICP buyers to protect sales rep closing capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Showing {filteredAndSorted.length} of {COUNTRIES.length} global markets
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
