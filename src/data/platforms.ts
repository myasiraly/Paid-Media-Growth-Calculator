import { AdPlatform, PlatformId, FunnelInputs, FunnelOutputs, CountryConfig } from '../types';
import { calculateFunnel } from '../utils/calculations';

export const AD_PLATFORMS: AdPlatform[] = [
  {
    id: 'google',
    name: 'Google Ads',
    shortName: 'Google Search & PMax',
    category: 'Search & Performance',
    tagline: 'High-intent search keyword capture & Performance Max automated retail/service campaigns.',
    brandColor: '#4285F4',
    bgLight: 'bg-blue-50 text-blue-800 border-blue-200',
    borderLight: 'border-blue-300',
    audienceIntent: 'High Active Search',
    benchmarks: {
      cpc: { low: 2.20, avg: 4.22, high: 9.80 },
      cpm: { low: 18.00, avg: 38.40, high: 75.00 },
      ctr: { low: 2.8, avg: 4.5, high: 8.2 },
      lpCvr: { low: 4.0, avg: 7.8, high: 14.5 },
      leadQualRate: { low: 35.0, avg: 52.0, high: 70.0 },
      salesCloseRate: { low: 18.0, avg: 26.0, high: 38.0 },
      typicalRoas: { low: 3.0, avg: 4.8, high: 8.5 },
    },
    recommendedDefaults: {
      expectedCpc: 4.20,
      landingPageConversionRate: 7.5,
      leadQualificationRate: 50.0,
      salesConversionRate: 25.0,
    },
    keyFormats: ['Search Text Ads', 'Performance Max (PMax)', 'Shopping / Product Listings', 'Call-Only Extensions', 'YouTube In-Stream'],
    bestSuitedFor: [
      'In-market prospects actively searching solutions (B2B SaaS, Agencies, Legal, Healthcare)',
      'High emergency urgency (Trades, HVAC, Roofing, Dental)',
      'E-commerce product search with exact buying SKU queries'
    ],
    keyTactics: [
      'Exact & Phrase Match keyword bidding with tight negative keyword lists to cut wasted spend',
      'Target CPA & Value-Based Bidding once 30+ monthly conversions are logged',
      'Dedicated single-keyword landing pages matching query headline verbatim'
    ],
    pros: [
      'Highest intent in the world — captures demand at the exact moment of search',
      'Extremely high SQL qualification rate because prospect is actively looking',
      'Scalable deterministic bottom-of-funnel conversion engine'
    ],
    watchOuts: [
      'Highly competitive auctions with premium CPCs in legal, finance, and enterprise software',
      'Requires continuous negative keyword curation to prevent broad match drift'
    ]
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    shortName: 'Facebook & Instagram',
    category: 'Visual Social Discovery',
    tagline: 'Algorithmic interest, lookalike, and behavioral targeting across FB Feeds, IG Stories & Reels.',
    brandColor: '#0081FB',
    bgLight: 'bg-sky-50 text-sky-800 border-sky-200',
    borderLight: 'border-sky-300',
    audienceIntent: 'Visual Social Discovery',
    benchmarks: {
      cpc: { low: 0.70, avg: 1.68, high: 3.80 },
      cpm: { low: 9.50, avg: 17.20, high: 32.00 },
      ctr: { low: 0.9, avg: 1.45, high: 2.8 },
      lpCvr: { low: 6.0, avg: 10.5, high: 18.0 },
      leadQualRate: { low: 22.0, avg: 38.0, high: 55.0 },
      salesCloseRate: { low: 12.0, avg: 19.0, high: 28.0 },
      typicalRoas: { low: 2.4, avg: 3.9, high: 7.2 },
    },
    recommendedDefaults: {
      expectedCpc: 1.65,
      landingPageConversionRate: 9.5,
      leadQualificationRate: 40.0,
      salesConversionRate: 20.0,
    },
    keyFormats: ['Advantage+ Shopping & Catalog', 'Instagram Reels & Stories', 'Native Instant Lead Forms', 'Video Sales Letters (VSLs)', 'Carousel Ads'],
    bestSuitedFor: [
      'High-Ticket Coaching, Info Programs & Masterminds',
      'D2C & E-Commerce impulse/lifestyle brands',
      'Local Clinics, MedSpas & Aesthetics',
      'Visual Real Estate & Luxury Developments'
    ],
    keyTactics: [
      'Broad targeting with Advantage+ Creative letting Meta’s AI match creative angle to audience',
      'High-converting 2-step VSL + calendar booking funnel with qualifying survey',
      'Instant Lead Gen forms with custom friction questions to filter out low-intent clicks'
    ],
    pros: [
      'Massive global reach with unmatched algorithmic behavioral audience modeling',
      'Lower entry CPCs and CPMs compared to Google Search or LinkedIn',
      'Exceptional for visual product demonstrations and storytelling'
    ],
    watchOuts: [
      'Lower initial intent compared to Search (requires nurturing & qualification)',
      'Creative fatigue sets in rapidly (requires refresh every 2–4 weeks)'
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    shortName: 'LinkedIn B2B',
    category: 'Enterprise & Professional',
    tagline: 'Precision Account-Based Marketing (ABM) targeting C-Suite, VP/Director titles & company sizes.',
    brandColor: '#0A66C2',
    bgLight: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    borderLight: 'border-indigo-300',
    audienceIntent: 'B2B Professional ICP',
    benchmarks: {
      cpc: { low: 5.50, avg: 8.40, high: 18.50 },
      cpm: { low: 32.00, avg: 58.00, high: 110.00 },
      ctr: { low: 0.45, avg: 0.72, high: 1.35 },
      lpCvr: { low: 4.5, avg: 8.2, high: 15.0 },
      leadQualRate: { low: 45.0, avg: 65.0, high: 82.0 },
      salesCloseRate: { low: 22.0, avg: 32.0, high: 45.0 },
      typicalRoas: { low: 3.5, avg: 5.6, high: 10.5 },
    },
    recommendedDefaults: {
      expectedCpc: 8.20,
      landingPageConversionRate: 7.0,
      leadQualificationRate: 65.0,
      salesConversionRate: 30.0,
    },
    keyFormats: ['Single Image Sponsored Content', 'Native Lead Gen Forms (Auto-Filled Profile)', 'Document / PDF Thought Leadership Ads', 'Thought Leader Ad (Founder Posts)', 'InMail / Conversation Ads'],
    bestSuitedFor: [
      'Mid-Market & Enterprise B2B SaaS ($15k–$100k+ ACV)',
      'Corporate Training, Executive Coaching & Masterminds',
      'Management Consulting, Legal & Financial Advisory',
      'High-Ticket Account-Based Marketing (ABM) campaigns'
    ],
    keyTactics: [
      'LinkedIn Native Lead Gen forms (pre-populates verified business email & job title)',
      'Document Ads delivering ungated or 1-click gated proprietary industry benchmarks',
      'Thought Leader ads boosting executive founder posts for authentic B2B authority'
    ],
    pros: [
      'Highest quality B2B leads available online — zero anonymous or fake profile data',
      'Exceptional lead qualification rate (60%+ SQL conversion is standard)',
      'Target exact decision-makers by seniority, company revenue, and tech stack'
    ],
    watchOuts: [
      'Highest CPCs and CPMs in the digital advertising industry',
      'Requires substantial average deal sizes ($5k+) to maintain favorable unit economics'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    shortName: 'TikTok for Business',
    category: 'Short-Form Video & UGC',
    tagline: 'High-energy creator-led UGC, Spark Ads, and viral discovery engine for modern demographics.',
    brandColor: '#FE2C55',
    bgLight: 'bg-rose-50 text-rose-800 border-rose-200',
    borderLight: 'border-rose-300',
    audienceIntent: 'Viral UGC & Creator Video',
    benchmarks: {
      cpc: { low: 0.35, avg: 0.78, high: 1.80 },
      cpm: { low: 4.50, avg: 8.90, high: 16.00 },
      ctr: { low: 1.1, avg: 2.1, high: 3.9 },
      lpCvr: { low: 3.5, avg: 6.8, high: 12.5 },
      leadQualRate: { low: 18.0, avg: 32.0, high: 48.0 },
      salesCloseRate: { low: 10.0, avg: 16.0, high: 24.0 },
      typicalRoas: { low: 2.2, avg: 3.6, high: 6.5 },
    },
    recommendedDefaults: {
      expectedCpc: 0.80,
      landingPageConversionRate: 6.5,
      leadQualificationRate: 35.0,
      salesConversionRate: 18.0,
    },
    keyFormats: ['In-Feed Video Ads', 'Spark Ads (Boosting organic creator posts)', 'TikTok Shop / Shopping Ads', 'Instant Lead Generation Forms', 'TopView Video'],
    bestSuitedFor: [
      'Viral D2C & Consumer Products (Beauty, Fashion, Gadgets, Health)',
      'Mobile Apps, Gaming, and Fintech signups',
      'Modern Education, Creator Cohorts & Fast-Paced Subscriptions',
      'High-velocity consumer lead generation'
    ],
    keyTactics: [
      'Native UGC (User Generated Content) that looks like organic TikToks, not polished TV commercials',
      'Hook the user in the first 1.8 seconds with bold text overlay and dynamic motion',
      'Leverage Spark Ads to boost organic influencer testimonials with direct checkout links'
    ],
    pros: [
      'Extremely low CPMs and high Click-Through Rates (CTR)',
      'Rapid viral scaling potential when creative resonates with the algorithm',
      'High engagement and impulse purchase velocity'
    ],
    watchOuts: [
      'Very short creative lifespan (ad fatigue happens within 7–14 days)',
      'Lower lead qualification rate requires strict downstream SMS/email nurture sequences'
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter Ads (X)',
    shortName: 'X Ads (Twitter)',
    category: 'Real-Time & Conversation',
    tagline: 'Target real-time breaking news, tech discussions, thought leadership, and niche developer/finance communities.',
    brandColor: '#0F1419',
    bgLight: 'bg-slate-100 text-slate-900 border-slate-300',
    borderLight: 'border-slate-400',
    audienceIntent: 'Real-Time / Tech Conversation',
    benchmarks: {
      cpc: { low: 0.45, avg: 0.95, high: 2.40 },
      cpm: { low: 5.50, avg: 10.50, high: 22.00 },
      ctr: { low: 0.8, avg: 1.6, high: 3.2 },
      lpCvr: { low: 2.8, avg: 5.4, high: 9.8 },
      leadQualRate: { low: 25.0, avg: 40.0, high: 58.0 },
      salesCloseRate: { low: 12.0, avg: 18.0, high: 28.0 },
      typicalRoas: { low: 2.0, avg: 3.2, high: 5.8 },
    },
    recommendedDefaults: {
      expectedCpc: 1.00,
      landingPageConversionRate: 5.5,
      leadQualificationRate: 40.0,
      salesConversionRate: 20.0,
    },
    keyFormats: ['Promoted Posts (Text + Image/Video)', 'Follower / Engagement Campaigns', 'Amplify Pre-Roll Video', 'Collection Ads', 'Conversation Cards'],
    bestSuitedFor: [
      'Tech, AI, Developer Tools & Web3/Crypto projects',
      'B2B Founder-led thought leadership and newsletter growth',
      'Finance, trading, and market intelligence platforms',
      'Live events, product launches, and press releases'
    ],
    keyTactics: [
      'Target followers of industry influencers and competitor handles',
      'Keyword and hashtag targeting during major industry conferences and product launch cycles',
      'Direct-to-newsletter or low-friction lead magnets (PDF guides, templates)'
    ],
    pros: [
      'Direct access to founders, tech leaders, journalists, and active decision makers',
      'Affordable CPCs compared to LinkedIn for reaching professional tech audiences',
      'Real-time responsiveness to trending topics and industry news'
    ],
    watchOuts: [
      'Lower purchase intent for traditional physical retail products',
      'Requires conversational, text-first copywriting rather than generic corporate promo'
    ]
  },
  {
    id: 'snapchat',
    name: 'Snapchat Ads',
    shortName: 'Snapchat Ads',
    category: 'Mobile AR & Gen Z',
    tagline: 'Immersive full-screen vertical video and AR lenses reaching Gen Z and Millennial mobile-first buyers.',
    brandColor: '#FFFC00',
    bgLight: 'bg-amber-50 text-amber-900 border-amber-200',
    borderLight: 'border-amber-300',
    audienceIntent: 'Gen Z & Millennial AR/Video',
    benchmarks: {
      cpc: { low: 0.25, avg: 0.62, high: 1.40 },
      cpm: { low: 3.20, avg: 6.80, high: 13.50 },
      ctr: { low: 0.65, avg: 1.25, high: 2.4 },
      lpCvr: { low: 2.2, avg: 4.8, high: 8.5 },
      leadQualRate: { low: 15.0, avg: 28.0, high: 42.0 },
      salesCloseRate: { low: 8.0, avg: 14.0, high: 22.0 },
      typicalRoas: { low: 1.8, avg: 3.1, high: 5.5 },
    },
    recommendedDefaults: {
      expectedCpc: 0.65,
      landingPageConversionRate: 5.0,
      leadQualificationRate: 30.0,
      salesConversionRate: 15.0,
    },
    keyFormats: ['Single Image/Video Top Snap', 'Story Ads in Discover Feed', 'AR Lens Experiences', 'Commercials (Non-Skippable 6s)', 'Native Lead Gen Forms'],
    bestSuitedFor: [
      'Gen Z & Millennial D2C products (Fashion, Accessories, Snacks, Beauty)',
      'Mobile App Installs, Games, and Subscription apps',
      'College, vocational education, and student services',
      'Entertainment, movies, music, and ticket sales'
    ],
    keyTactics: [
      'Keep video ads under 6 seconds with immediate audio and swipe-up incentive',
      'Use interactive AR lenses for virtual try-ons (sunglasses, makeup, apparel)',
      'Leverage Snap Pixel lookalike audiences seeded by high-value mobile purchases'
    ],
    pros: [
      'One of the lowest CPM and CPC cost bases across all major tier-1 ad platforms',
      'High mobile camera and video immersion with virtually zero distraction on-screen',
      'Undivided attention from the 18–34 demographic'
    ],
    watchOuts: [
      'Not suitable for high-ACV enterprise B2B sales cycles',
      'Audience requires fast, frictionless 1-click mobile checkout experiences'
    ]
  }
];

export function getPlatform(id: string): AdPlatform {
  return AD_PLATFORMS.find((p) => p.id === id) || AD_PLATFORMS[0];
}

/**
 * Infers the best primary advertising platform from an industry's channel recommendation.
 */
export function inferPlatformIdFromChannel(channel?: string): PlatformId {
  if (!channel) return 'google';
  const c = channel.toLowerCase();
  if (c.startsWith('linkedin') || (c.includes('linkedin') && !c.startsWith('google') && !c.startsWith('meta'))) return 'linkedin';
  if (c.startsWith('meta') || c.startsWith('instagram') || c.includes('facebook') || (c.includes('meta') && !c.startsWith('google'))) return 'meta';
  if (c.startsWith('tiktok') || c.includes('tiktok')) return 'tiktok';
  if (c.startsWith('snapchat') || c.includes('snapchat')) return 'snapchat';
  if (c.startsWith('x ') || c.includes('twitter') || c.includes(' x ')) return 'twitter';
  return 'google';
}

/**
 * Calculates a complete funnel estimation for a specific ad platform,
 * adjusting the platform's baseline benchmark CPC by the active country's regional CPC index.
 */
export function calculatePlatformFunnel(
  platform: AdPlatform,
  baseInputs: FunnelInputs,
  country: CountryConfig
): {
  platform: AdPlatform;
  inputs: FunnelInputs;
  outputs: FunnelOutputs;
  cpcAdjusted: number;
} {
  const cpcAdjusted = Number((platform.recommendedDefaults.expectedCpc * country.cpcIndex).toFixed(2));
  
  const platformInputs: FunnelInputs = {
    ...baseInputs,
    platformId: platform.id,
    channel: platform.name,
    expectedCpc: Math.max(0.05, cpcAdjusted),
    landingPageConversionRate: platform.recommendedDefaults.landingPageConversionRate,
    leadQualificationRate: platform.recommendedDefaults.leadQualificationRate,
    salesConversionRate: platform.recommendedDefaults.salesConversionRate,
    countryCode: country.code,
  };

  const outputs = calculateFunnel(platformInputs);

  return {
    platform,
    inputs: platformInputs,
    outputs,
    cpcAdjusted,
  };
}
