/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * AI Agent Analysis Request
 */
export interface AIAgentAnalysisRequest {
  userId: string;
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
  analysisType: "comprehensive" | "trend" | "monetization" | "competitive";
}

/**
 * Market Research Data
 */
export interface MarketResearchData {
  trends: string[];
  competitorAnalysis: {
    topCompetitors: Array<{
      name: string;
      followers: number;
      avgEngagement: number;
      monetizationStrategy: string;
    }>;
  };
  monetizationOpportunities: Array<{
    type: string;
    estimatedEarnings: string;
    requirements: string[];
  }>;
  industryInsights: string[];
}

/**
 * AI Agent Analysis Response
 */
export interface AIAgentAnalysisResponse {
  agentId: string;
  userId: string;
  analysis: {
    fameScore: number;
    marketPosition: string;
    keyInsights: string[];
    recommendations: string[];
    trendAnalysis: string;
    competitiveAdvantage: string;
    monetizationStrategy: string;
  };
  marketResearch: MarketResearchData;
  growthPlan: {
    nextMonth: string[];
    nextQuarter: string[];
    nextYear: string[];
  };
  pdfUrl?: string;
  generatedAt: string;
}

/**
 * User Quiz Data Capture
 */
export interface UserQuizData {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  age?: string;
  city?: string;
  primaryPlatform: string;
  secondaryPlatforms: string[];
  followerCount: number;
  engagementRate: number;
  niche: string;
  contentType: string;
  postingFrequency: string;
  experience: string[];
  monthlyIncome?: string;
  biggestChallenge: string[];
  goals: string[];
  socialLinks: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
    tiktok?: string;
  };
  bio?: string;
  language: "english" | "hindi";
  analysisData?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Download Tracking
 */
export interface UserDownloadRecord {
  id: string;
  userId: string;
  downloadType: string; // "report", "template", "guide", "calculator", etc.
  fileName: string;
  downloadedAt: string;
  fileSize?: number;
  productId?: string;
  metadata?: any;
}

/**
 * User Analytics Summary
 */
export interface UserAnalyticsSummary {
  userId: string;
  totalQuizzes: number;
  totalDownloads: number;
  totalDownloadSize: number;
  lastActivityAt: string;
  quizHistory: UserQuizData[];
  downloadHistory: UserDownloadRecord[];
  engagementScore: number;
  platformDistribution: Record<string, number>;
  conversionRate?: number;
}

/**
 * Backend Capture Requests
 */
export interface CaptureQuizDataRequest {
  quizData: UserQuizData;
}

export interface CaptureDownloadRequest {
  userId: string;
  downloadType: string;
  fileName: string;
  productId?: string;
}

export interface GetUserAnalyticsRequest {
  userId: string;
}

/**
 * Backend Capture Responses
 */
export interface CaptureQuizDataResponse {
  success: boolean;
  userId: string;
  message: string;
}

export interface CaptureDownloadResponse {
  success: boolean;
  downloadId: string;
  message: string;
}

export interface GetUserAnalyticsResponse {
  success: boolean;
  analytics?: UserAnalyticsSummary;
  message: string;
}

/**
 * Base API URL for all requests
 * Change this if API endpoint changes
 */
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.famechase.com/api"
    : "http://localhost:3000/api"; // Change localhost port if different

/**
 * Helper function to build full API URLs
 */
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
