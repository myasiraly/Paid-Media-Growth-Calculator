import { FunnelInputs, PlatformId } from '../types';

export const PARAM_KEYS = {
  monthlyAdSpend: 'spend',
  expectedCpc: 'cpc',
  landingPageConversionRate: 'lpcvr',
  leadQualificationRate: 'qual',
  salesConversionRate: 'sales',
  averageDealSize: 'deal',
  grossMarginRate: 'margin',
  clientName: 'client',
  industry: 'ind',
  channel: 'chan',
  countryCode: 'country',
  platformId: 'plat',
  targetGoalType: 'gtype',
  targetGoalValue: 'gval',
} as const;

/**
 * Encodes funnel inputs into a clean URL hash string (e.g., "spend=10000&cpc=4.50&...")
 */
export function encodeInputsToHash(inputs: FunnelInputs): string {
  const params = new URLSearchParams();

  if (inputs.monthlyAdSpend !== undefined) params.set(PARAM_KEYS.monthlyAdSpend, String(inputs.monthlyAdSpend));
  if (inputs.expectedCpc !== undefined) params.set(PARAM_KEYS.expectedCpc, String(inputs.expectedCpc));
  if (inputs.landingPageConversionRate !== undefined) params.set(PARAM_KEYS.landingPageConversionRate, String(inputs.landingPageConversionRate));
  if (inputs.leadQualificationRate !== undefined) params.set(PARAM_KEYS.leadQualificationRate, String(inputs.leadQualificationRate));
  if (inputs.salesConversionRate !== undefined) params.set(PARAM_KEYS.salesConversionRate, String(inputs.salesConversionRate));
  if (inputs.averageDealSize !== undefined) params.set(PARAM_KEYS.averageDealSize, String(inputs.averageDealSize));
  if (inputs.grossMarginRate !== undefined) params.set(PARAM_KEYS.grossMarginRate, String(inputs.grossMarginRate));
  if (inputs.clientName) params.set(PARAM_KEYS.clientName, inputs.clientName.trim());
  if (inputs.industry) params.set(PARAM_KEYS.industry, inputs.industry);
  if (inputs.channel) params.set(PARAM_KEYS.channel, inputs.channel);
  if (inputs.countryCode) params.set(PARAM_KEYS.countryCode, inputs.countryCode);
  if (inputs.platformId) params.set(PARAM_KEYS.platformId, inputs.platformId);
  if (inputs.targetGoalType) params.set(PARAM_KEYS.targetGoalType, inputs.targetGoalType);
  if (inputs.targetGoalValue !== undefined) params.set(PARAM_KEYS.targetGoalValue, String(inputs.targetGoalValue));

  return params.toString();
}

/**
 * Decodes funnel inputs from a URL hash string
 */
export function decodeInputsFromHash(hashString?: string): Partial<FunnelInputs> | null {
  const rawHash = hashString !== undefined ? hashString : (typeof window !== 'undefined' ? window.location.hash : '');
  if (!rawHash) return null;

  const cleanHash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  if (!cleanHash) return null;

  try {
    const params = new URLSearchParams(cleanHash);
    const result: Partial<FunnelInputs> = {};

    const parseNum = (val: string | null, min = 0, max = Infinity): number | undefined => {
      if (!val) return undefined;
      const parsed = parseFloat(val);
      if (isNaN(parsed)) return undefined;
      return Math.max(min, Math.min(max, parsed));
    };

    const spend = parseNum(params.get(PARAM_KEYS.monthlyAdSpend) || params.get('monthlyAdSpend'), 0);
    if (spend !== undefined) result.monthlyAdSpend = spend;

    const cpc = parseNum(params.get(PARAM_KEYS.expectedCpc) || params.get('cpc') || params.get('expectedCpc'), 0.01);
    if (cpc !== undefined) result.expectedCpc = cpc;

    const lpcvr = parseNum(params.get(PARAM_KEYS.landingPageConversionRate) || params.get('landingPageConversionRate'), 0, 100);
    if (lpcvr !== undefined) result.landingPageConversionRate = lpcvr;

    const qual = parseNum(params.get(PARAM_KEYS.leadQualificationRate) || params.get('leadQualificationRate'), 0, 100);
    if (qual !== undefined) result.leadQualificationRate = qual;

    const sales = parseNum(params.get(PARAM_KEYS.salesConversionRate) || params.get('salesConversionRate'), 0, 100);
    if (sales !== undefined) result.salesConversionRate = sales;

    const deal = parseNum(params.get(PARAM_KEYS.averageDealSize) || params.get('averageDealSize'), 0);
    if (deal !== undefined) result.averageDealSize = deal;

    const margin = parseNum(params.get(PARAM_KEYS.grossMarginRate) || params.get('grossMarginRate'), 0, 100);
    if (margin !== undefined) result.grossMarginRate = margin;

    const client = params.get(PARAM_KEYS.clientName) || params.get('clientName');
    if (client !== null && client !== undefined) result.clientName = client;

    const industry = params.get(PARAM_KEYS.industry) || params.get('industry');
    if (industry) result.industry = industry;

    const channel = params.get(PARAM_KEYS.channel) || params.get('channel');
    if (channel) result.channel = channel;

    const country = params.get(PARAM_KEYS.countryCode) || params.get('countryCode') || params.get('country');
    if (country) result.countryCode = country.toUpperCase();

    const platform = params.get(PARAM_KEYS.platformId) || params.get('platformId') || params.get('plat');
    if (platform) result.platformId = platform as PlatformId;

    const gtype = params.get(PARAM_KEYS.targetGoalType) || params.get('targetGoalType') || params.get('gtype');
    if (gtype === 'revenue' || gtype === 'customers') result.targetGoalType = gtype;

    const gval = parseNum(params.get(PARAM_KEYS.targetGoalValue) || params.get('targetGoalValue') || params.get('gval'), 1);
    if (gval !== undefined) result.targetGoalValue = gval;

    return Object.keys(result).length > 0 ? result : null;
  } catch (err) {
    console.warn('Failed to parse funnel inputs from URL hash:', err);
    return null;
  }
}

/**
 * Updates the browser's URL hash seamlessly without triggering page reloads or adding excess history entries
 */
export function updateBrowserUrlHash(inputs: FunnelInputs): void {
  if (typeof window === 'undefined') return;
  const hash = encodeInputsToHash(inputs);
  const newUrl = `${window.location.pathname}${window.location.search}#${hash}`;
  window.history.replaceState(null, '', newUrl);
}

/**
 * Generates the full shareable URL for the current funnel configuration
 */
export function getShareableUrl(inputs: FunnelInputs): string {
  if (typeof window === 'undefined') return '';
  const hash = encodeInputsToHash(inputs);
  return `${window.location.origin}${window.location.pathname}${window.location.search}#${hash}`;
}

/**
 * Copies the shareable model link to the user's clipboard
 */
export async function copyShareableLink(inputs: FunnelInputs): Promise<boolean> {
  const url = getShareableUrl(inputs);
  updateBrowserUrlHash(inputs);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // fallback
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
