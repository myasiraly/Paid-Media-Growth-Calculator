import { CountryConfig, FunnelInputs, FunnelOutputs } from '../types';
import { calculateFunnel } from '../utils/calculations';

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    cpcIndex: 1.00,
    region: 'North America',
    marketTier: 'Tier 1',
    typicalCpcRange: '$2.50 – $9.50',
    description: 'Highest search volume and buyer intent, but most competitive auction CPCs globally.',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    locale: 'en-GB',
    cpcIndex: 0.82,
    region: 'Europe',
    marketTier: 'Tier 1',
    typicalCpcRange: '£2.00 – £7.20',
    description: 'Mature e-commerce and B2B services market with ~18% lower cost per click than the US.',
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CA$',
    locale: 'en-CA',
    cpcIndex: 0.78,
    region: 'North America',
    marketTier: 'Tier 1',
    typicalCpcRange: 'CA$2.20 – CA$7.50',
    description: 'High purchasing power and similar consumer behavior to US with lower ad saturation.',
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    locale: 'en-AU',
    cpcIndex: 0.85,
    region: 'Asia-Pacific',
    marketTier: 'Tier 1',
    typicalCpcRange: 'A$2.60 – A$8.00',
    description: 'Strong discretionary spending, high average order values, and concentrated urban search volume.',
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'de-DE',
    cpcIndex: 0.74,
    region: 'Europe',
    marketTier: 'Tier 1',
    typicalCpcRange: '€1.80 – €6.50',
    description: 'Leading European industrial & tech hub; high lead qualification standards and GDPR compliance focus.',
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'fr-FR',
    cpcIndex: 0.68,
    region: 'Europe',
    marketTier: 'Tier 1',
    typicalCpcRange: '€1.60 – €5.80',
    description: 'Strong responsiveness to native French copy; ~32% lower paid media CPCs than North America.',
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'nl-NL',
    cpcIndex: 0.76,
    region: 'Europe',
    marketTier: 'Tier 1',
    typicalCpcRange: '€1.90 – €6.80',
    description: 'Exceptional digital infrastructure and high English proficiency for cross-border SaaS.',
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    currencySymbol: 'CHF ',
    locale: 'de-CH',
    cpcIndex: 0.95,
    region: 'Europe',
    marketTier: 'Tier 1',
    typicalCpcRange: 'CHF 2.80 – CHF 10.00',
    description: 'Highest purchasing power in Europe with premium average client deal values.',
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED ',
    locale: 'en-AE',
    cpcIndex: 0.80,
    region: 'Middle East',
    marketTier: 'Tier 1',
    typicalCpcRange: 'AED 8.00 – AED 28.00',
    description: 'Thriving international hub for luxury, real estate, B2B technology, and family offices.',
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR ',
    locale: 'ar-SA',
    cpcIndex: 0.78,
    region: 'Middle East',
    marketTier: 'Tier 1',
    typicalCpcRange: 'SAR 7.50 – SAR 26.00',
    description: 'Rapidly modernizing Vision 2030 economy with large public & enterprise contract sizes.',
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    locale: 'en-SG',
    cpcIndex: 0.68,
    region: 'Asia-Pacific',
    marketTier: 'Tier 1',
    typicalCpcRange: 'S$2.00 – S$7.00',
    description: 'APAC headquarters gateway; ideal for regional enterprise software and financial services.',
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    locale: 'ja-JP',
    cpcIndex: 0.65,
    region: 'Asia-Pacific',
    marketTier: 'Tier 1',
    typicalCpcRange: '¥250 – ¥900',
    description: 'High customer loyalty and lifetime value; requires strict local proof points and social proof.',
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    cpcIndex: 0.22,
    region: 'Asia-Pacific',
    marketTier: 'Tier 3',
    typicalCpcRange: '₹12 – ₹55',
    description: 'Extremely cost-effective traffic volume; requires strict ICP form filters for high-quality MQLs.',
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    locale: 'pt-BR',
    cpcIndex: 0.32,
    region: 'Latin America',
    marketTier: 'Tier 2',
    typicalCpcRange: 'R$1.50 – R$6.00',
    description: 'Massive mobile and Meta Ads engagement; highly responsive to direct video and WhatsApp funnels.',
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: 'Mex$',
    locale: 'es-MX',
    cpcIndex: 0.35,
    region: 'Latin America',
    marketTier: 'Tier 2',
    typicalCpcRange: 'Mex$8.00 – Mex$30.00',
    description: 'Fastest growing nearshoring market in Americas with favorable Google Search auction margins.',
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R ',
    locale: 'en-ZA',
    cpcIndex: 0.38,
    region: 'Middle East',
    marketTier: 'Tier 2',
    typicalCpcRange: 'R 8.00 – R 32.00',
    description: 'Sub-Saharan commercial hub with strong English ad response and low competition.',
  },
  {
    code: 'GLOBAL',
    name: 'Global / Multi-Geo',
    flag: '🌐',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    cpcIndex: 0.72,
    region: 'Global',
    marketTier: 'Tier 1',
    typicalCpcRange: '$1.80 – $6.50',
    description: 'Blended worldwide targeting across Tier 1 & Tier 2 international regions.',
  },
];

export const DEFAULT_COUNTRY_CODE = 'US';

export function getCountry(codeOrObj?: string | { code?: string }): CountryConfig {
  if (!codeOrObj) return COUNTRIES[0];
  const code = typeof codeOrObj === 'string' ? codeOrObj : codeOrObj.code;
  if (!code || typeof code !== 'string') return COUNTRIES[0];
  const found = COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || COUNTRIES[0];
}

/**
 * Computes projected funnel metrics for a specific target country based on regional auction indices
 */
export function calculateCountryFunnel(
  country: CountryConfig,
  baseInputs: FunnelInputs
): {
  country: CountryConfig;
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  cpcAdjusted: number;
} {
  // If the base inputs are already configured for this country, use base expectedCpc
  // Otherwise scale CPC based on relative country index (US is 1.0 baseline)
  const baseCountry = getCountry(baseInputs.countryCode || 'US');
  const relativeIndex = country.cpcIndex / (baseCountry.cpcIndex || 1.0);
  
  const cpcAdjusted = Math.max(0.05, +(baseInputs.expectedCpc * relativeIndex).toFixed(2));
  
  const countryInputs: FunnelInputs = {
    ...baseInputs,
    countryCode: country.code,
    expectedCpc: cpcAdjusted,
  };

  const outputs = calculateFunnel(countryInputs);

  return {
    country,
    inputs: countryInputs,
    outputs,
    cpcAdjusted,
  };
}

/**
 * Calculates results across all supported countries for side-by-side comparison
 */
export function compareAllCountries(baseInputs: FunnelInputs) {
  return COUNTRIES.map((country) => calculateCountryFunnel(country, baseInputs));
}
