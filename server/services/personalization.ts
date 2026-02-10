import crypto from "crypto";
import { type MarketResearchData } from "../../shared/api.js";

/**
 * User-specific personalization parameters
 */
export interface PersonalizationProfile {
  userId: string;
  agentId: string;
  creatorProfile: {
    name: string;
    niche: string;
    platform: string;
    followers: number;
    engagementRate: number;
    monthlyViews: number;
    content: string;
    goals: string;
    challenges: string;
  };
  personalityScore: string; // Unique fingerprint for this agent
  adaptationFactors: {
    riskTolerance: number; // 0-10
    timeToMonetize: string; // "immediate", "short-term", "long-term"
    contentQuality: number; // 0-10
    communityEngagement: number; // 0-10
  };
}

/**
 * Generates unique personality fingerprint for the AI agent
 * Ensures non-replicable analysis per user
 */
export function generatePersonalityFingerprint(
  userId: string,
  creatorProfile: Record<string, unknown>,
  agentId: string,
): string {
  const data = JSON.stringify({
    userId,
    creatorProfile,
    agentId,
    timestamp: Date.now(),
    entropy: crypto.randomBytes(16).toString("hex"),
  });

  const hash = crypto.createHash("sha256").update(data).digest("hex");

  return hash.substring(0, 12);
}

/**
 * Calculates adaptation factors based on creator profile
 */
export function calculateAdaptationFactors(profile: {
  followers: number;
  engagementRate: number;
  monthlyViews: number;
  goals: string;
  challenges: string;
}): PersonalizationProfile["adaptationFactors"] {
  // Risk tolerance based on current metrics
  const riskTolerance = Math.min(
    10,
    Math.max(1, (profile.engagementRate * 2 + profile.followers / 50000) / 3),
  );

  // Time to monetize based on follower count
  let timeToMonetize: "immediate" | "short-term" | "long-term" = "long-term";
  if (profile.followers >= 100000) timeToMonetize = "immediate";
  else if (profile.followers >= 50000) timeToMonetize = "short-term";

  // Content quality assessment
  const contentQuality = Math.min(10, Math.max(1, profile.engagementRate * 5));

  // Community engagement assessment
  const communityEngagement = Math.min(
    10,
    Math.max(1, profile.engagementRate * 3 + 3),
  );

  return {
    riskTolerance,
    timeToMonetize,
    contentQuality,
    communityEngagement,
  };
}

/**
 * Creates personalized recommendations based on unique agent fingerprint
 */
export function generatePersonalizedRecommendations(
  marketResearch: MarketResearchData,
  personalization: PersonalizationProfile,
): string[] {
  const recommendations: string[] = [];
  const profile = personalization.creatorProfile;
  const factors = personalization.adaptationFactors;

  // High engagement creators
  if (factors.communityEngagement >= 7) {
    recommendations.push(
      "Your community engagement is strong. Leverage this to launch exclusive membership programs or courses.",
    );
    recommendations.push(
      "Consider starting a community Discord or Telegram for deeper connections - monetize with premium tier access.",
    );
  }

  // Low follower, high quality content
  if (profile.followers < 50000 && factors.contentQuality >= 6) {
    recommendations.push(
      "Quality over quantity is your advantage. Target micro-brands that value authentic partnerships over reach.",
    );
    recommendations.push(
      "Apply for influencer networks that connect brands seeking niche creators - often offer better rates per engagement.",
    );
  }

  // High follower count
  if (profile.followers >= 100000) {
    recommendations.push(
      "You have significant reach. Approach major brands directly with professional media kit and case studies.",
    );
    recommendations.push(
      "Launch your own product line. Your audience size justifies custom merchandise or digital products.",
    );
  }

  // Based on challenges mentioned
  if (profile.challenges.toLowerCase().includes("engagement")) {
    recommendations.push(
      "Focus on posting frequency optimization - test different posting times and content formats to boost engagement.",
    );
    recommendations.push(
      "Implement call-to-action strategies consistently - encourage saves, shares, and comments in every post.",
    );
  }

  if (profile.challenges.toLowerCase().includes("monetization")) {
    recommendations.push(
      "Start with affiliate marketing of products you genuinely use - lowest barrier to entry for monetization.",
    );
    recommendations.push(
      `Current market rate for ${profile.niche} creators: ${
        marketResearch.monetizationOpportunities[0]?.estimatedEarnings ||
        "varies"
      }. Track performance metrics to justify rates.`,
    );
  }

  // Trend-based recommendations
  const trendRecommendations = marketResearch.trends
    .slice(0, 2)
    .map((trend) => {
      if (trend.includes("short-form")) {
        return `Capitalize on short-form video trend: ${trend}. Increase video content frequency by 30%.`;
      }
      if (trend.includes("authenticity")) {
        return `Lean into authentic storytelling: ${trend}. Share behind-the-scenes content more frequently.`;
      }
      return `Trend alert: ${trend}. Adapt your content calendar to include trending formats.`;
    });

  recommendations.push(...trendRecommendations);

  return recommendations;
}

/**
 * Creates unique growth plan tailored to user
 */
export function generatePersonalizedGrowthPlan(
  profile: {
    followers: number;
    engagementRate: number;
    goals: string;
    challenges: string;
  },
  marketResearch: MarketResearchData,
): {
  nextMonth: string[];
  nextQuarter: string[];
  nextYear: string[];
} {
  const factors = calculateAdaptationFactors(profile);

  // Next month - Quick wins
  const nextMonth = [
    factors.communityEngagement >= 7
      ? "Launch weekly community engagement ritual (polls, Q&A, challenges)"
      : "Implement engagement boosting strategies (CTAs, hashtag optimization)",
    `Post ${factors.contentQuality >= 7 ? "4-5" : "3-4"} times per week to optimize algorithm visibility`,
    "Analyze top 5 performing posts and create 3 similar content variations",
    "Reach out to 10 complementary creators for collaboration opportunities",
  ];

  // Next quarter - Growth phase
  const nextQuarter = [
    factors.timeToMonetize === "immediate"
      ? "Negotiate and finalize 2-3 brand partnerships"
      : "Build media kit and start approaching micro-brands",
    `Scale to ${profile.followers + 10000}+ followers through consistency`,
    "Launch email newsletter for direct audience communication",
    "Test and optimize posting schedule for maximum reach",
  ];

  // Next year - Scale phase
  const nextYear = [
    factors.communityEngagement >= 7
      ? "Build and monetize community through membership/paid community"
      : "Establish yourself as industry authority through thought leadership",
    `Target ${profile.followers * 3}-${profile.followers * 5}x follower growth through strategic content`,
    "Develop 1-2 signature content formats that define your brand",
    factors.timeToMonetize === "immediate"
      ? "Generate ${250000}+ annual income through multiple revenue streams"
      : "Achieve consistent ${100000}+ monthly reach to unlock premium brand deals",
  ];

  return { nextMonth, nextQuarter, nextYear };
}

/**
 * Computes unique Fame Score based on multiple factors
 */
export function calculateUniqueFameScore(
  profile: {
    followers: number;
    engagementRate: number;
    monthlyViews: number;
  },
  marketResearch: MarketResearchData,
  personalityFingerprint: string,
): number {
  // Base score calculation
  let score = 0;

  // Follower component (0-30 points)
  score += Math.min(30, (profile.followers / 100000) * 30);

  // Engagement component (0-35 points)
  score += Math.min(35, profile.engagementRate * 7);

  // Reach component (0-20 points)
  score += Math.min(20, (profile.monthlyViews / 1000000) * 20);

  // Market position component (0-10 points based on industry insights)
  const marketBonus = marketResearch.industryInsights.length > 0 ? 10 : 0;
  score += marketBonus;

  // Add personality fingerprint variance (0-5 points)
  // Ensures unique score per user based on their agent
  const fingerprintBonus =
    (parseInt(personalityFingerprint.substring(0, 8), 16) % 5) + 1;
  score += fingerprintBonus;

  return Math.min(100, Math.round(score));
}

/**
 * Creates unique market position statement
 */
export function generateMarketPosition(
  profile: {
    followers: number;
    engagementRate: number;
    niche: string;
  },
  marketResearch: MarketResearchData,
  fameScore: number,
): string {
  const positioning = [];

  // Positioning based on Fame Score
  if (fameScore >= 80) {
    positioning.push(
      `You are a TOP TIER creator in the ${profile.niche} space`,
    );
  } else if (fameScore >= 60) {
    positioning.push(
      `You are an ESTABLISHED creator in the ${profile.niche} space`,
    );
  } else if (fameScore >= 40) {
    positioning.push(`You are a GROWING creator in the ${profile.niche} space`);
  } else {
    positioning.push(
      `You are an EMERGING creator in the ${profile.niche} space`,
    );
  }

  // Market comparison
  const topCompetitor = marketResearch.competitorAnalysis.topCompetitors[0];
  if (topCompetitor) {
    if (profile.followers >= topCompetitor.followers) {
      positioning.push(
        `Your reach exceeds current market leaders. You're positioned for premium brand partnerships.`,
      );
    } else if (profile.followers >= topCompetitor.followers / 2) {
      positioning.push(
        `You're in the competitive tier. Differentiation and consistency are your keys to breakthrough.`,
      );
    } else {
      positioning.push(
        `You're in a high-growth segment. Focus on niche authority building before scaling.`,
      );
    }
  }

  return positioning.join(" ");
}
