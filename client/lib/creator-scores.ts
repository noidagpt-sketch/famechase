import {
  CreatorProfile,
  CreatorScores,
  NICHE_MULTIPLIER_MAP,
  CITY_TIER_MAP,
} from "./creator-model";

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function computeAuthorityScore(profile: CreatorProfile): { score: number; interpretation: string } {
  const followerWeight = Math.min(profile.followers / 500000, 1) * 50;
  const erWeight = Math.min(profile.engagementRate / 12, 1) * 30;
  const platformBonus = profile.secondaryPlatforms.length > 0 ? Math.min(profile.secondaryPlatforms.length * 3, 10) : 0;
  const experienceBonus = profile.experience.includes("Expert (3+ years)") ? 10
    : profile.experience.includes("Experienced (2-3 years)") ? 7
    : profile.experience.includes("Growing (1-2 years)") ? 5
    : profile.experience.includes("Beginner (6 months - 1 year)") ? 3 : 0;
  const raw = clamp(Math.round(followerWeight + erWeight + platformBonus + experienceBonus), 0, 100);

  let interpretation = "";
  if (raw >= 80) interpretation = "Elite authority. You command premium rates and have strong audience trust.";
  else if (raw >= 60) interpretation = "Strong authority. Brands recognize your influence and audience loyalty.";
  else if (raw >= 40) interpretation = "Growing authority. Your audience is engaged but scaling will boost credibility.";
  else if (raw >= 20) interpretation = "Emerging authority. Focus on deepening audience connection and growing followers.";
  else interpretation = "Early-stage authority. Build consistent content to establish your voice.";

  return { score: raw, interpretation };
}

export function computeConsistencyScore(profile: CreatorProfile): { score: number; interpretation: string } {
  const frequencyScores: Record<string, number> = {
    "Daily": 95,
    "3-4 times a week": 80,
    "Weekly": 60,
    "2-3 times a month": 35,
    "Monthly": 20,
    "Irregular": 10,
  };
  const baseScore = frequencyScores[profile.postingFrequency] || 30;

  const experienceBonus = profile.experience.includes("Expert (3+ years)") ? 5
    : profile.experience.includes("Experienced (2-3 years)") ? 3
    : profile.experience.includes("Growing (1-2 years)") ? 2 : 0;

  const contentTypeBonus = profile.contentType ? 2 : 0;

  const raw = clamp(Math.round(baseScore + experienceBonus + contentTypeBonus), 0, 100);

  let interpretation = "";
  if (raw >= 80) interpretation = "Excellent consistency. Your posting rhythm builds strong algorithm favor and audience habit.";
  else if (raw >= 60) interpretation = "Good consistency. You're posting regularly — increasing to 4-5x/week would accelerate growth.";
  else if (raw >= 40) interpretation = "Moderate consistency. The algorithm needs regular signals. Try batching content for consistent output.";
  else if (raw >= 20) interpretation = "Low consistency. Irregular posting hurts discoverability. Build a content calendar immediately.";
  else interpretation = "Critical consistency gap. Without regular content, growth is nearly impossible. Start with 3 posts/week minimum.";

  return { score: raw, interpretation };
}

export function computeAlgorithmAlignmentScore(profile: CreatorProfile): { score: number; interpretation: string } {
  const viewToFollowerRatio = profile.followers > 0 ? profile.avgViews / profile.followers : 0;
  const retentionProxy = clamp(viewToFollowerRatio * 100, 0, 40);

  const hookStrengthProxy = profile.engagementRate >= 8 ? 25
    : profile.engagementRate >= 5 ? 20
    : profile.engagementRate >= 3 ? 15
    : profile.engagementRate >= 1 ? 10 : 5;

  const formatBonus = (profile.contentType.toLowerCase().includes("reel") || profile.contentType.toLowerCase().includes("short") || profile.contentType.toLowerCase().includes("video")) ? 15 : 5;

  const frequencyBonus = profile.postingFrequency === "Daily" ? 15
    : profile.postingFrequency === "3-4 times a week" ? 10
    : profile.postingFrequency === "Weekly" ? 5 : 0;

  const platformBonus = profile.platform === "YouTube" ? 5
    : profile.platform === "Instagram" ? 3 : 0;

  const raw = clamp(Math.round(retentionProxy + hookStrengthProxy + formatBonus + frequencyBonus + platformBonus), 0, 100);

  let interpretation = "";
  if (raw >= 75) interpretation = "Strong algorithm alignment. Your content format, hooks, and frequency are well-optimized for platform reach.";
  else if (raw >= 55) interpretation = "Good alignment. Fine-tune your hooks and post timing for maximum distribution.";
  else if (raw >= 35) interpretation = "Moderate alignment. Focus on short-form video, stronger opening hooks, and trending formats.";
  else interpretation = "Weak alignment. Shift to algorithm-friendly formats (Reels/Shorts), improve first 3 seconds, post during peak hours.";

  return { score: raw, interpretation };
}

export function computeMonetizationReadinessScore(profile: CreatorProfile): { score: number; interpretation: string } {
  const nicheMultiplier = NICHE_MULTIPLIER_MAP[profile.niche] || 1.0;
  const cityFactor = getCityFactor(profile.city);

  const engagementComponent = clamp(profile.engagementRate * 5, 0, 30);
  const nicheComponent = clamp((nicheMultiplier - 1) * 25, 0, 25);
  const cityComponent = clamp((cityFactor - 1) * 30, 0, 15);
  const followerComponent = profile.followers >= 100000 ? 20
    : profile.followers >= 50000 ? 17
    : profile.followers >= 10000 ? 14
    : profile.followers >= 5000 ? 10
    : profile.followers >= 1000 ? 6 : 3;

  const incomeBonus = profile.income > 0 ? Math.min(profile.income / 10000, 10) : 0;

  const raw = clamp(Math.round(engagementComponent + nicheComponent + cityComponent + followerComponent + incomeBonus), 0, 100);

  let interpretation = "";
  if (raw >= 75) interpretation = "Highly monetization-ready. You can command premium brand deals and diversify income streams now.";
  else if (raw >= 55) interpretation = "Good monetization potential. Start with brand outreach and rate card creation.";
  else if (raw >= 35) interpretation = "Developing monetization readiness. Grow engagement and audience size to unlock brand interest.";
  else interpretation = "Early monetization stage. Focus on audience building and engagement before monetizing.";

  return { score: raw, interpretation };
}

function getCityFactor(city: string): number {
  if (!city) return 1.0;
  const normalized = city.trim();
  for (const [key, factor] of Object.entries(CITY_TIER_MAP)) {
    if (normalized.toLowerCase().includes(key.toLowerCase())) return factor;
  }
  return 1.0;
}

export function computeAllScores(profile: CreatorProfile): CreatorScores {
  const authority = computeAuthorityScore(profile);
  const consistency = computeConsistencyScore(profile);
  const algorithmAlignment = computeAlgorithmAlignmentScore(profile);
  const monetization = computeMonetizationReadinessScore(profile);

  const overall = Math.round(
    authority.score * 0.30 +
    consistency.score * 0.20 +
    algorithmAlignment.score * 0.25 +
    monetization.score * 0.25
  );

  let tier: CreatorScores["tier"];
  let tierLabel: string;
  if (overall >= 80) { tier = "elite"; tierLabel = "Elite Creator"; }
  else if (overall >= 65) { tier = "professional"; tierLabel = "Professional Creator"; }
  else if (overall >= 45) { tier = "established"; tierLabel = "Established Creator"; }
  else if (overall >= 25) { tier = "rising"; tierLabel = "Rising Creator"; }
  else { tier = "beginner"; tierLabel = "Beginner Creator"; }

  let overallInterpretation = "";
  if (overall >= 80) overallInterpretation = "You're in the top tier of creators. Focus on scaling revenue and building a personal brand empire.";
  else if (overall >= 65) overallInterpretation = "Strong creator profile. You're ready for premium brand partnerships and diversified income.";
  else if (overall >= 45) overallInterpretation = "Solid foundation. Strategic improvements in weak areas will accelerate your growth significantly.";
  else if (overall >= 25) overallInterpretation = "Growing creator. Consistent effort in content quality and posting frequency will drive results.";
  else overallInterpretation = "Early stage. Focus on building a content habit and finding your unique voice.";

  return {
    authorityScore: authority.score,
    authorityInterpretation: authority.interpretation,
    consistencyScore: consistency.score,
    consistencyInterpretation: consistency.interpretation,
    algorithmAlignmentScore: algorithmAlignment.score,
    algorithmAlignmentInterpretation: algorithmAlignment.interpretation,
    monetizationReadinessScore: monetization.score,
    monetizationReadinessInterpretation: monetization.interpretation,
    overallScore: overall,
    overallInterpretation,
    tier,
    tierLabel,
  };
}
