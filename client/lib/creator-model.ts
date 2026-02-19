export interface CreatorProfile {
  platform: string;
  secondaryPlatforms: string[];
  niche: string;
  followers: number;
  followerRange: string;
  avgViews: number;
  engagementRate: number;
  engagementRateRaw: string;
  postingFrequency: string;
  income: number;
  incomeRange: string;
  city: string;
  goals: string[];
  challenges: string[];
  experience: string[];
  contentType: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    linkedin: string;
    website: string;
    twitter: string;
    tiktok: string;
  };
  language: string;
}

export interface CreatorScores {
  authorityScore: number;
  authorityInterpretation: string;
  consistencyScore: number;
  consistencyInterpretation: string;
  algorithmAlignmentScore: number;
  algorithmAlignmentInterpretation: string;
  monetizationReadinessScore: number;
  monetizationReadinessInterpretation: string;
  overallScore: number;
  overallInterpretation: string;
  tier: "beginner" | "rising" | "established" | "professional" | "elite";
  tierLabel: string;
}

export interface RevenueProjection {
  brandRatePerPost: { low: number; high: number };
  brandRatePerReel: { low: number; high: number };
  brandRatePerStory: { low: number; high: number };
  brandRatePerVideo: { low: number; high: number };
  conservativeMonthly: { low: number; high: number };
  realisticMonthly: { low: number; high: number };
  aggressiveMonthly: { low: number; high: number };
  sixMonthProjection: {
    low: { from: number; to: number };
    mid: { from: number; to: number };
    high: { from: number; to: number };
  };
  roiModel: {
    currentRate: number;
    ifEngagementUp2x: number;
    ifViewsUp2x: number;
    ifBothUp2x: number;
  };
  nicheCPM: number;
  platformMultiplier: number;
}

export interface CreatorRecommendation {
  category: "engagement" | "reach" | "monetization" | "consistency" | "growth";
  priority: "critical" | "high" | "medium";
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  actions: string[];
  actionsHindi: string[];
  expectedImpact: string;
  expectedImpactHindi: string;
  timeframe: string;
}

export interface CreatorIntelligenceReport {
  profile: CreatorProfile;
  scores: CreatorScores;
  projections: RevenueProjection;
  recommendations: CreatorRecommendation[];
  executiveSummary?: string;
  executiveSummaryHindi?: string;
  generatedAt: string;
}

export type PDFTier = "free" | "pro" | "premium";

export const NICHE_CPM_MAP: Record<string, number> = {
  "Fashion & Beauty": 18,
  "Technology & AI": 35,
  "Personal Finance & Investing": 45,
  "Gaming & Esports": 25,
  "Education & Learning": 30,
  "Fitness & Health": 22,
  "Food & Cooking": 15,
  "Business & Finance": 40,
  "Lifestyle": 12,
  "Entertainment & Comedy": 14,
  "Travel & Adventure": 20,
  "Art & Design": 16,
  "Music": 18,
  "Parenting": 20,
  "Motivation & Self-help": 25,
};

export const NICHE_MULTIPLIER_MAP: Record<string, number> = {
  "Fashion & Beauty": 1.4,
  "Technology & AI": 1.8,
  "Personal Finance & Investing": 2.2,
  "Gaming & Esports": 1.6,
  "Education & Learning": 1.9,
  "Fitness & Health": 1.5,
  "Food & Cooking": 1.3,
  "Business & Finance": 2.0,
  "Lifestyle": 1.2,
  "Entertainment & Comedy": 1.1,
  "Travel & Adventure": 1.3,
  "Art & Design": 1.2,
  "Music": 1.3,
  "Parenting": 1.4,
  "Motivation & Self-help": 1.6,
};

export const CITY_TIER_MAP: Record<string, number> = {
  "Mumbai": 1.5,
  "Delhi": 1.5,
  "Bangalore": 1.4,
  "Bengaluru": 1.4,
  "Hyderabad": 1.3,
  "Chennai": 1.3,
  "Kolkata": 1.2,
  "Pune": 1.3,
  "Ahmedabad": 1.2,
  "Jaipur": 1.1,
  "Lucknow": 1.1,
  "Chandigarh": 1.2,
  "Gurgaon": 1.4,
  "Noida": 1.3,
  "Goa": 1.2,
};

export const PLATFORM_RATE_MULTIPLIER: Record<string, number> = {
  "YouTube": 1.3,
  "Instagram": 1.0,
  "LinkedIn": 1.2,
  "TikTok": 0.7,
  "Twitter": 0.8,
  "Facebook": 0.6,
  "Website/Blog": 1.4,
};

export function parseFollowerCount(range: string): number {
  if (!range) return 500;
  const norm = range.replace(/[\u2013\u2014\u2013\u2014]/g, "-").trim();
  if (/Less than|से कम/i.test(norm)) {
    const m = norm.match(/(\d+(?:\.?\d+)?)([KkMm]?)/);
    if (m) return Math.max(200, Math.round(parseToken(m[1] + (m[2] || "")) * 0.5));
  }
  if (/\+/.test(norm)) {
    const m = norm.match(/(\d+(?:\.?\d+)?)([KkMm]?)/);
    if (m) return parseToken(m[1] + (m[2] || ""));
  }
  const parts = norm.split("-").map(s => s.trim());
  if (parts.length === 2) {
    const a = parseToken(parts[0]);
    const b = parseToken(parts[1].replace(/\+$/, ""));
    if (a && b) return Math.round((a + b) / 2);
  }
  const m = norm.match(/(\d+(?:\.?\d+)?)([KkMm]?)/);
  if (m) return parseToken(m[1] + (m[2] || ""));
  return 500;
}

export function parseIncome(income: string): number {
  if (!income) return 0;
  const norm = income.replace(/[\u2013\u2014\u2013\u2014]/g, "-").replace(/\s/g, "").replace(/₹/g, "").toUpperCase();
  if (/^0|NOINCOMEYET|अभीतककोईआयनहीं/i.test(norm)) return 0;
  const toNum = (s: string) => {
    if (/L\+?$/.test(s)) return (parseInt(s) || 1) * 100000;
    if (/L$/.test(s)) return (parseInt(s) || 0) * 100000;
    if (/K$/.test(s)) return (parseFloat(s) || 0) * 1000;
    return parseInt(s) || 0;
  };
  const m = norm.match(/(\d+(?:\.\d+)?[KL]?)-(\d+(?:\.\d+)?[KL+]?)/);
  if (m) {
    const a = toNum(m[1]);
    const b = toNum(m[2].replace(/\+$/, ""));
    if (a && b) return Math.round((a + b) / 2);
  }
  const single = norm.match(/(\d+(?:\.\d+)?[KL]?)(\+?)/);
  if (single) return toNum(single[1]);
  return 0;
}

export function parseEngagementRate(rate: string): number {
  if (!rate) return 2;
  const map: Record<string, number> = {
    "More than 12%": 14,
    "8-12%": 10,
    "5-8%": 6.5,
    "3-5%": 4,
    "1-3%": 2,
    "Less than 1%": 0.5,
    "I don't know": 2,
  };
  return map[rate] || 2;
}

function parseToken(token: string): number {
  const t = token.trim();
  if (/[Mm]$/.test(t)) return Math.round(parseFloat(t.replace(/[^\d.]/g, "")) * 1_000_000);
  if (/[Kk]$/.test(t)) return Math.round(parseFloat(t.replace(/[^\d.]/g, "")) * 1_000);
  return parseInt(t.replace(/[^\d]/g, "")) || 0;
}

export function buildCreatorProfile(quizData: any): CreatorProfile {
  const followers = parseFollowerCount(quizData.followerCount || "");
  const engagementRate = parseEngagementRate(quizData.engagementRate || "");
  const avgViews = Math.round(followers * (engagementRate / 100) * 3.5);
  const income = parseIncome(quizData.monthlyIncome || "");

  return {
    platform: quizData.primaryPlatform || "Instagram",
    secondaryPlatforms: quizData.secondaryPlatforms || [],
    niche: quizData.niche || "Lifestyle",
    followers,
    followerRange: quizData.followerCount || "Less than 1K",
    avgViews,
    engagementRate,
    engagementRateRaw: quizData.engagementRate || "I don't know",
    postingFrequency: quizData.postingFrequency || "Weekly",
    income,
    incomeRange: quizData.monthlyIncome || "₹0",
    city: quizData.city || "",
    goals: quizData.goals || [],
    challenges: quizData.biggestChallenge || [],
    experience: quizData.experience || [],
    contentType: quizData.contentType || "",
    name: quizData.name || "Creator",
    email: quizData.email || "",
    age: parseInt(quizData.age) || 25,
    bio: quizData.bio || "",
    socialLinks: quizData.socialLinks || { instagram: "", youtube: "", linkedin: "", website: "", twitter: "", tiktok: "" },
    language: quizData.language || "english",
  };
}
