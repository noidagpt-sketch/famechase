/**
 * Dynamic AI Analysis Service
 * Enhances user analysis with:
 * - Real-time market trends
 * - Competitor benchmarks
 * - Latest platform algorithms
 * - Monetization opportunities
 * - Commercial viability scoring
 */

import {
  getTrendsForNiche,
  getPlatformBenchmarks,
  getMonetizationOpportunities,
  generateMarketPositionAnalysis,
} from "./real-time-market-research.js";

export interface DynamicAnalysisInput {
  name: string;
  niche: string;
  platform: string;
  followers: number;
  engagementRate: number;
  monthlyViews: number;
  experience: string[];
  goals: string[];
  challenges: string[];
  contentType: string;
  postingFrequency: string;
}

export interface EnhancedAnalysisOutput {
  fameScore: number;
  marketPosition: string;
  trendOpportunities: string[];
  competitiveAdvantage: string;
  monetizationPathways: string[];
  commercialViabilityScore: number;
  growthRecommendations: string[];
  riskFactors: string[];
  nextQuarterFocus: string[];
  estimatedIncomeProjection: {
    conservative: string;
    realistic: string;
    optimistic: string;
  };
}

/**
 * Calculate enhanced Fame Score based on multiple factors
 */
function calculateEnhancedFameScore(input: DynamicAnalysisInput): number {
  const trends = getTrendsForNiche(input.niche);
  const benchmark = getPlatformBenchmarks(input.platform);

  // Base score components
  let score = 0;

  // Followers (max 30 points)
  const followerScore = Math.min(30, (input.followers / 500000) * 30);
  score += followerScore;

  // Engagement rate (max 35 points)
  const engagementScore = Math.min(35, (input.engagementRate / 0.1) * 35);
  score += engagementScore;

  // Views (max 20 points)
  const viewScore = Math.min(20, (input.monthlyViews / 5000000) * 20);
  score += viewScore;

  // Trend alignment (max 10 points)
  const trendBonus = trends.length > 0 ? 8 : 4;
  score += trendBonus;

  // Experience level (max 5 points)
  const experienceBonus = Math.min(5, input.experience.length * 1.25);
  score += experienceBonus;

  return Math.min(100, Math.round(score));
}

/**
 * Analyze competitive advantage
 */
function analyzeCompetitiveAdvantage(input: DynamicAnalysisInput): string {
  const benchmark = getPlatformBenchmarks(input.platform);
  const aboveAverageEngagement =
    input.engagementRate > benchmark.avgEngagementRate;
  const aboveAverageFollowers = input.followers > benchmark.avgFollowers;

  let advantage = "";

  if (aboveAverageEngagement && aboveAverageFollowers) {
    advantage = `You have both HIGH follower count and EXCEPTIONAL engagement rates. This is your biggest competitive advantage. 
Most creators struggle with one or the other. Your combination puts you in top 5% of your niche.
Action: Monetize this advantage immediately through premium sponsorships and coaching.`;
  } else if (aboveAverageEngagement) {
    advantage = `Your engagement rate is EXCEPTIONAL (${(input.engagementRate * 100).toFixed(2)}% vs ${(benchmark.avgEngagementRate * 100).toFixed(2)}% average).
This means your audience is highly loyal and responsive.
Action: Brands pay premium rates for engaged audiences. Use this to negotiate better sponsorship deals.`;
  } else if (aboveAverageFollowers) {
    advantage = `You have a significant follower base (${input.followers.toLocaleString()} followers).
Growth is fast, but engagement needs optimization.
Action: Focus on engagement improvement to unlock premium monetization opportunities worth $5K-$20K per month.`;
  } else {
    advantage = `You're building a foundation in the right niche. Current metrics show potential.
Your advantage is agility - you can pivot faster than larger creators.
Action: Use this to test new content formats and trends before larger creators catch on.`;
  }

  return advantage;
}

/**
 * Generate monetization pathways with commercial viability
 */
function generateMonetizationPathways(input: DynamicAnalysisInput): {
  pathways: string[];
  score: number;
} {
  const opportunities = getMonetizationOpportunities(input.followers);
  const trends = getTrendsForNiche(input.niche);

  const pathways: string[] = [];
  let viabilityScore = 0;

  // Immediate opportunities (0-30 days)
  const immediate = opportunities
    .filter((o) => o.timeToMonetize.includes("1-2 weeks"))
    .slice(0, 2);

  if (immediate.length > 0) {
    pathways.push(
      `⚡ IMMEDIATE (Start This Week): ${immediate.map((o) => `${o.type} (${o.estimatedEarnings})`).join(", ")}`,
    );
    viabilityScore += 20;
  }

  // Medium-term opportunities (1-3 months)
  const mediumTerm = opportunities
    .filter((o) => o.timeToMonetize.includes("1-3 months"))
    .slice(0, 2);

  if (mediumTerm.length > 0) {
    pathways.push(
      `📈 SHORT-TERM (Next 3 Months): ${mediumTerm.map((o) => `${o.type} (${o.estimatedEarnings})`).join(", ")}`,
    );
    viabilityScore += 25;
  }

  // Trend-based opportunities
  if (trends.length > 0) {
    const trendOpp = trends[0];
    pathways.push(
      `🔥 TREND-ALIGNED: Focus on "${trendOpp.trend}" (Growing ${trendOpp.growthRate}% this quarter). Expected income boost: 2-3X.`,
    );
    viabilityScore += 30;
  }

  // Experience-based opportunities
  if (input.experience.length > 0) {
    pathways.push(
      `🎓 LEVERAGE YOUR EXPERTISE: Your experience in ${input.experience.join(", ")} enables premium consulting ($100-500/hour).`,
    );
    viabilityScore += 15;
  }

  // Platform-specific
  const platformOpps = opportunities
    .filter((o) => o.platform === input.platform)
    .slice(0, 1);
  if (platformOpps.length > 0) {
    pathways.push(
      `${input.platform === "TikTok" ? "🎵" : input.platform === "YouTube" ? "📺" : "📱"} PLATFORM-OPTIMIZED: ${platformOpps[0].type} - Best for ${input.platform} creators`,
    );
    viabilityScore += 10;
  }

  return { pathways, score: Math.min(100, viabilityScore) };
}

/**
 * Generate growth recommendations based on trends and data
 */
function generateGrowthRecommendations(input: DynamicAnalysisInput): string[] {
  const trends = getTrendsForNiche(input.niche);
  const recommendations: string[] = [];

  // Trend-based recommendations
  if (trends.length > 0) {
    recommendations.push(
      `Create content around "${trends[0].trend}" - This trend is growing ${trends[0].growthRate}% quarterly and has ${trends[0].relevance}% relevance to your niche.`,
    );
    if (trends.length > 1) {
      recommendations.push(
        `Secondary opportunity: "${trends[1].trend}" with ${trends[1].growthRate}% growth. Mix this into your content mix for higher engagement.`,
      );
    }
  }

  // Posting frequency
  if (input.postingFrequency !== "daily") {
    recommendations.push(
      "URGENT: Increase posting frequency to daily. Algorithm data shows daily posters get 3-5X more visibility than weekly posters in 2024.",
    );
  }

  // Engagement optimization
  if (input.engagementRate < 0.03) {
    recommendations.push(
      "Focus on engagement optimization: Ask questions, create polls, use CTAs. Engagement rate below 3% limits sponsorship opportunities.",
    );
  }

  // Cross-platform strategy
  if (input.platform === "TikTok") {
    recommendations.push(
      "Repurpose TikTok content to Instagram Reels and YouTube Shorts. Same content, 3 income streams. Total potential: $2K-$5K/month.",
    );
  }

  // Content type diversification
  if (!input.contentType.includes("Collaboration")) {
    recommendations.push(
      "Start creator collaborations. Collab videos get 5-10X more engagement and introduce you to new audiences. Build 3-5 collab videos this month.",
    );
  }

  return recommendations.slice(0, 5);
}

/**
 * Identify risk factors
 */
function identifyRiskFactors(input: DynamicAnalysisInput): string[] {
  const risks: string[] = [];
  const benchmark = getPlatformBenchmarks(input.platform);

  if (input.engagementRate < benchmark.avgEngagementRate * 0.5) {
    risks.push(
      "Very Low Engagement: Below 50% of platform average. Algorithm will deprioritize content. Fix: Focus on engagement-first content.",
    );
  }

  if (input.followers < 10000) {
    risks.push(
      "Limited Scale: Below 10K followers, monetization options are limited. Can still earn $100-500/month. Growth is priority.",
    );
  }

  if (input.postingFrequency.includes("few_times")) {
    risks.push(
      "Low Posting Frequency: Algorithms favor consistency. Post less than 3x/week = lower visibility. Increase to 4-5x weekly minimum.",
    );
  }

  if (input.monthlyViews < 100000) {
    risks.push(
      "Low Reach: Monthly views below 100K limit sponsorship opportunities. Prioritize content that performs well.",
    );
  }

  if (!input.goals || input.goals.length === 0) {
    risks.push(
      "No Clear Goals: Content without direction underperforms. Define 1-2 primary goals (monetization, brand building, etc).",
    );
  }

  return risks.slice(0, 4);
}

/**
 * Project income based on multiple scenarios
 */
function projectIncomeEstimates(
  input: DynamicAnalysisInput,
  followers: number,
): {
  conservative: string;
  realistic: string;
  optimistic: string;
} {
  const opportunities = getMonetizationOpportunities(followers);

  // Conservative: Current metrics only
  const conservativeBase =
    followers < 50000
      ? 200
      : followers < 250000
        ? 1000
        : followers < 1000000
          ? 3000
          : 8000;
  const conservative = `$${conservativeBase}-$${conservativeBase * 1.5}/month (Ad revenue + basic sponsorships)`;

  // Realistic: With optimization
  const realisticMultiplier = input.engagementRate > 0.05 ? 2.5 : 1.8;
  const realistic = `$${Math.round(conservativeBase * realisticMultiplier)}-$${Math.round(conservativeBase * realisticMultiplier * 1.5)}/month (Sponsorships + affiliate + products)`;

  // Optimistic: Full monetization
  const optimisticBase =
    followers < 50000
      ? 2000
      : followers < 250000
        ? 8000
        : followers < 1000000
          ? 25000
          : 100000;
  const optimistic = `$${optimisticBase}-$${optimisticBase * 2}/month (All streams + coaching + courses)`;

  return { conservative, realistic, optimistic };
}

/**
 * Generate comprehensive enhanced analysis
 */
export function generateDynamicAnalysis(
  input: DynamicAnalysisInput,
): EnhancedAnalysisOutput {
  const fameScore = calculateEnhancedFameScore(input);
  const marketPosition = generateMarketPositionAnalysis(
    input.niche,
    input.platform,
    input.followers,
    input.engagementRate,
  );
  const competitiveAdvantage = analyzeCompetitiveAdvantage(input);
  const { pathways, score: viabilityScore } =
    generateMonetizationPathways(input);
  const growthRecommendations = generateGrowthRecommendations(input);
  const riskFactors = identifyRiskFactors(input);
  const incomeProjection = projectIncomeEstimates(input, input.followers);

  // Next quarter focus areas
  const trends = getTrendsForNiche(input.niche);
  const nextQuarterFocus = [
    trends.length > 0
      ? `Master "${trends[0].trend}" content format`
      : "Optimize content performance",
    "Increase engagement rate to 5%+ for premium sponsorships",
    "Build engaged email list (1K+ minimum)",
    "Test and scale winning content formats",
  ];

  return {
    fameScore,
    marketPosition,
    trendOpportunities: trends.slice(0, 3).map((t) => t.trend),
    competitiveAdvantage,
    monetizationPathways: pathways,
    commercialViabilityScore: viabilityScore,
    growthRecommendations,
    riskFactors,
    nextQuarterFocus,
    estimatedIncomeProjection: incomeProjection,
  };
}
