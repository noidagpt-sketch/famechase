import {
  CreatorProfile,
  RevenueProjection,
  NICHE_CPM_MAP,
  NICHE_MULTIPLIER_MAP,
  PLATFORM_RATE_MULTIPLIER,
} from "./creator-model";

export function computeRevenueProjections(profile: CreatorProfile): RevenueProjection {
  const nicheCPM = NICHE_CPM_MAP[profile.niche] || 15;
  const nicheMultiplier = NICHE_MULTIPLIER_MAP[profile.niche] || 1.0;
  const platformMultiplier = PLATFORM_RATE_MULTIPLIER[profile.platform] || 1.0;

  const brandRatePerPost = Math.round(profile.followers * 0.008 * nicheMultiplier * platformMultiplier);
  const brandRatePerReel = Math.round(profile.followers * 0.015 * nicheMultiplier * platformMultiplier);
  const brandRatePerStory = Math.round(profile.followers * 0.004 * nicheMultiplier * platformMultiplier);
  const brandRatePerVideo = Math.round(profile.followers * 0.025 * nicheMultiplier * platformMultiplier);

  const postingMultiplier = getPostingMultiplier(profile.postingFrequency);
  const erMultiplier = getEngagementMultiplier(profile.engagementRate);

  const baseMonthly = profile.followers * nicheCPM / 1000 * nicheMultiplier * platformMultiplier;
  const conservativeMonthly = Math.round(baseMonthly * 0.3 * postingMultiplier * erMultiplier);
  const realisticMonthly = Math.round(baseMonthly * 0.8 * postingMultiplier * erMultiplier);
  const aggressiveMonthly = Math.round(baseMonthly * 1.8 * postingMultiplier * erMultiplier);

  const sixMonthGrowth = 1 + (postingMultiplier * 0.3);
  const sixMonthProjection = {
    conservative: Math.round(conservativeMonthly * sixMonthGrowth * 6),
    realistic: Math.round(realisticMonthly * sixMonthGrowth * 6),
    aggressive: Math.round(aggressiveMonthly * sixMonthGrowth * 6),
  };

  const currentRate = realisticMonthly;
  const roiModel = {
    currentRate,
    ifEngagementUp2x: Math.round(currentRate * 1.8),
    ifViewsUp2x: Math.round(currentRate * 1.6),
    ifBothUp2x: Math.round(currentRate * 2.8),
  };

  return {
    brandRatePerPost,
    brandRatePerReel,
    brandRatePerStory,
    brandRatePerVideo,
    conservativeMonthly,
    realisticMonthly,
    aggressiveMonthly,
    sixMonthProjection,
    roiModel,
    nicheCPM,
    platformMultiplier,
  };
}

function getPostingMultiplier(frequency: string): number {
  const map: Record<string, number> = {
    "Daily": 1.5,
    "3-4 times a week": 1.3,
    "Weekly": 1.0,
    "2-3 times a month": 0.7,
    "Monthly": 0.5,
    "Irregular": 0.4,
  };
  return map[frequency] || 1.0;
}

function getEngagementMultiplier(er: number): number {
  if (er >= 12) return 1.5;
  if (er >= 8) return 1.3;
  if (er >= 5) return 1.15;
  if (er >= 3) return 1.0;
  if (er >= 1) return 0.8;
  return 0.5;
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
