/**
 * Commercial Viability Framework
 * Determines which downloads/products are most commercially viable
 * based on market demand, trending potential, and monetization capability
 */

export interface DownloadViability {
  productId: string;
  name: string;
  commercialScore: number; // 0-100
  marketDemand: "high" | "medium" | "low";
  monetizationPotential: string;
  targetAudience: string;
  timeToMonetize: string;
  estimatedMonthlyEarnings: string;
  competitionLevel: "low" | "medium" | "high";
  recommendedStrategy: string;
  marketTrends: string[];
}

// Product database with commercial viability metrics
const PRODUCT_VIABILITY_DATABASE: Record<string, DownloadViability> = {
  "fame-score-report": {
    productId: "fame-score-report",
    name: "Fame Score Report (Premium)",
    commercialScore: 92,
    marketDemand: "high",
    monetizationPotential: "$99 per report | High conversion (15-20%)",
    targetAudience: "Aspiring creators (18-35 years old)",
    timeToMonetize: "Immediate",
    estimatedMonthlyEarnings: "$2,000-$5,000 (at 20+ sales/month)",
    competitionLevel: "medium",
    recommendedStrategy:
      "Package as lead magnet → Email nurture → Upsell to premium tools. 70% of buyers purchase additional products.",
    marketTrends: [
      "Creator economy tools trending 45% YoY",
      "Personal branding tools high demand",
      "DIY analytics tools replacing agency services",
    ],
  },
  "media-kit-template": {
    productId: "media-kit-template",
    name: "Professional Media Kit Template",
    commercialScore: 85,
    marketDemand: "high",
    monetizationPotential: "$49-$99 | Can be packaged with other products",
    targetAudience: "Professional creators, influencers (25-45 years old)",
    timeToMonetize: "1-2 weeks",
    estimatedMonthlyEarnings: "$1,000-$3,000 (at 20-30 sales/month)",
    competitionLevel: "high",
    recommendedStrategy:
      "Bundle with branding package. Offer limited-time discount (30% off) to get initial traction. Price elasticity shows 35% price increase = 15% sales decrease.",
    marketTrends: [
      "Professional creator services trending",
      "B2B creator demand increasing",
      "Agencies prefer packaged services",
    ],
  },
  "growth-strategy-guide": {
    productId: "growth-strategy-guide",
    name: "30/90/365 Day Growth Strategy Guide",
    commercialScore: 88,
    marketDemand: "high",
    monetizationPotential:
      "$29-$49 | High-volume seller (price-sensitive audience)",
    targetAudience: "New creators, micro-influencers (18-28 years old)",
    timeToMonetize: "1-3 weeks",
    estimatedMonthlyEarnings: "$1,500-$4,000 (at 50+ sales/month)",
    competitionLevel: "high",
    recommendedStrategy:
      "Position as budget-friendly alternative. Use affiliate model - 40% commission to creators who promote. Can reach $5K/month at scale.",
    marketTrends: [
      "Growth hacking tools extremely popular",
      "Budget-friendly products preferred by Gen Z",
      "Email-based strategies gaining traction",
    ],
  },
  "monetization-calculator": {
    productId: "monetization-calculator",
    name: "AI-Powered Monetization Calculator",
    commercialScore: 87,
    marketDemand: "high",
    monetizationPotential: "$19-$39 | Excellent for upselling",
    targetAudience: "Monetizing creators (20-45 years old)",
    timeToMonetize: "Immediate",
    estimatedMonthlyEarnings: "$800-$2,000 (at 30-50 sales/month)",
    competitionLevel: "low",
    recommendedStrategy:
      "Use as lead magnet for email list. Free version captures emails → Premium version ($39) = 10-15% conversion. Follow-up emails generate $500/month per 1K emails.",
    marketTrends: [
      "Monetization tools high demand",
      "AI tools experiencing 150% growth in demand",
      "Creator economics gaining mainstream attention",
    ],
  },
  "analytics-tracker": {
    productId: "analytics-tracker",
    name: "Pro-Level Analytics Tracker (Spreadsheet)",
    commercialScore: 79,
    marketDemand: "medium",
    monetizationPotential: "$29-$49 | Software alternative at fraction of cost",
    targetAudience: "Serious creators, micro-influencers (22-40 years old)",
    timeToMonetize: "2-4 weeks",
    estimatedMonthlyEarnings: "$600-$1,500 (at 20-30 sales/month)",
    competitionLevel: "high",
    recommendedStrategy:
      "Position against expensive SaaS tools. Offer training webinar for $97 → Include template free. 20-25% of webinar attendees buy premium version.",
    marketTrends: [
      "DIY analytics preferred by budget-conscious creators",
      "Spreadsheet-based solutions trendy",
      "Data literacy becoming essential",
    ],
  },
  "content-calendar": {
    productId: "content-calendar",
    name: "AI Content Calendar & Planning System",
    commercialScore: 81,
    marketDemand: "high",
    monetizationPotential: "$39-$79 | Recurring potential with monthly updates",
    targetAudience: "Busy creators, content teams (25-50 years old)",
    timeToMonetize: "1-3 weeks",
    estimatedMonthlyEarnings:
      "$1,200-$3,000 (at 30-40 sales/month + subscriptions)",
    competitionLevel: "medium",
    recommendedStrategy:
      "Offer SaaS model: $29/month subscription. Lower initial price but recurring revenue. Average customer LTV = $300+ (12 months).",
    marketTrends: [
      "Content planning tools growing 40% YoY",
      "Subscription models preferred",
      "AI-powered planning gaining traction",
    ],
  },
  "brand-positioning-workbook": {
    productId: "brand-positioning-workbook",
    name: "Brand Positioning Interactive Workbook",
    commercialScore: 83,
    marketDemand: "medium",
    monetizationPotential: "$47-$97 | Premium positioning",
    targetAudience: "Professional creators, personal brands (25-55 years old)",
    timeToMonetize: "2-4 weeks",
    estimatedMonthlyEarnings: "$700-$2,000 (at 15-20 sales/month)",
    competitionLevel: "medium",
    recommendedStrategy:
      "Offer with 1-on-1 consultation upsell ($299-$499). 30-40% conversion to consultation. Consultation alone generates $4K-$8K/month.",
    marketTrends: [
      "Personal branding critical for creators",
      "Premium positioning products doing well",
      "Consultation bundling increasing average order value",
    ],
  },
  "affiliate-marketing-guide": {
    productId: "affiliate-marketing-guide",
    name: "Advanced Affiliate Marketing Guide for Creators",
    commercialScore: 86,
    marketDemand: "high",
    monetizationPotential: "$37-$67 | High-volume potential",
    targetAudience: "Income-focused creators (20-40 years old)",
    timeToMonetize: "1-2 weeks",
    estimatedMonthlyEarnings: "$1,500-$4,000 (at 40-60 sales/month)",
    competitionLevel: "high",
    recommendedStrategy:
      "Create YouTube course review ($397) to drive this sales. 5-8% of course buyers purchase guide. YT channel generating $2K/month at scale.",
    marketTrends: [
      "Affiliate marketing hottest creator income source",
      "High demand for affiliate strategies",
      "Passive income focus trending",
    ],
  },
};

/**
 * Calculate commercial score based on multiple factors
 */
export function calculateCommercialViability(
  productId: string,
  downloadCount: number,
  userEngagement: number,
): DownloadViability {
  const baseProduct = PRODUCT_VIABILITY_DATABASE[productId];

  if (!baseProduct) {
    return {
      productId,
      name: "Unknown Product",
      commercialScore: 0,
      marketDemand: "low",
      monetizationPotential: "Unable to assess",
      targetAudience: "Unknown",
      timeToMonetize: "Unknown",
      estimatedMonthlyEarnings: "$0",
      competitionLevel: "unknown" as any,
      recommendedStrategy: "Product not found in database",
      marketTrends: [],
    };
  }

  // Adjust score based on actual download data
  let adjustedScore = baseProduct.commercialScore;

  // Download momentum bonus (up to +10 points)
  if (downloadCount > 100) adjustedScore += 5;
  if (downloadCount > 500) adjustedScore += 5;

  // User engagement bonus (up to +5 points)
  if (userEngagement > 0.7) adjustedScore += 5;

  // Cap at 100
  adjustedScore = Math.min(100, adjustedScore);

  return {
    ...baseProduct,
    commercialScore: adjustedScore,
  };
}

/**
 * Get most viable products for a creator profile
 */
export function getViableProductsForCreator(
  niche: string,
  followers: number,
  engagementRate: number,
  monetizationGoal: "immediate" | "growth" | "premium",
): DownloadViability[] {
  const allProducts = Object.values(PRODUCT_VIABILITY_DATABASE);

  return allProducts
    .filter((product) => {
      // Filter based on monetization goal
      if (monetizationGoal === "immediate") {
        return (
          product.timeToMonetize.includes("Immediate") ||
          product.timeToMonetize.includes("1-2 weeks")
        );
      } else if (monetizationGoal === "growth") {
        return (
          product.timeToMonetize.includes("week") ||
          product.timeToMonetize.includes("1-3 weeks")
        );
      } else {
        return product.marketDemand === "high";
      }
    })
    .sort((a, b) => b.commercialScore - a.commercialScore)
    .slice(0, 5);
}

/**
 * Generate commercial viability report for downloads
 */
export function generateCommercialReport(
  downloads: Array<{ productId: string; count: number }>,
  niche: string,
): {
  topProducts: DownloadViability[];
  totalPotentialMonthly: string;
  recommendedStrategy: string;
  marketOpportunities: string[];
} {
  const viableProducts = downloads
    .map((d) => calculateCommercialViability(d.productId, d.count, 0.75))
    .sort((a, b) => b.commercialScore - a.commercialScore);

  // Calculate potential earnings
  const potentialEarnings = viableProducts.reduce((acc, product) => {
    const minEarnings = parseInt(
      product.estimatedMonthlyEarnings.split("-")[0].replace(/\D/g, ""),
    );
    return acc + minEarnings;
  }, 0);

  const strategies = viableProducts
    .slice(0, 3)
    .map((p) => p.recommendedStrategy);

  const opportunities = viableProducts
    .slice(0, 3)
    .flatMap((p) => p.marketTrends);

  return {
    topProducts: viableProducts.slice(0, 5),
    totalPotentialMonthly: `$${potentialEarnings.toLocaleString()}-$${(potentialEarnings * 1.5).toLocaleString()}/month`,
    recommendedStrategy: `Focus on: ${viableProducts
      .slice(0, 2)
      .map((p) => p.name)
      .join(" + ")}. ${strategies[0]}`,
    marketOpportunities: [...new Set(opportunities)].slice(0, 5),
  };
}

/**
 * Export commercial viability service
 */
export const commercialViabilityService = {
  calculateCommercialViability,
  getViableProductsForCreator,
  generateCommercialReport,
  PRODUCT_VIABILITY_DATABASE,
};
