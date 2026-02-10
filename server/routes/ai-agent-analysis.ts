import { RequestHandler } from "express";
import {
  generateUniqueAgentId,
  getAvailableProviders,
} from "../services/ai-agent.js";
import { compileMarketResearchData } from "../services/market-research.js";
import {
  generatePersonalityFingerprint,
  calculateAdaptationFactors,
  generatePersonalizedRecommendations,
  generatePersonalizedGrowthPlan,
  calculateUniqueFameScore,
  generateMarketPosition,
} from "../services/personalization.js";
import { generatePersonalizedPDF } from "../services/pdf-generator.js";
import {
  type AIAgentAnalysisRequest,
  type AIAgentAnalysisResponse,
} from "../../shared/api.js";

export const handleAIAgentAnalysis: RequestHandler = async (req, res) => {
  try {
    const analysisRequest = req.body as AIAgentAnalysisRequest;

    // Validate request
    if (!analysisRequest.userId || !analysisRequest.creatorProfile) {
      res.status(400).json({
        error: "Missing required fields: userId and creatorProfile",
      });
      return;
    }

    // Check if AI providers are configured
    const providers = getAvailableProviders();
    if (providers.length === 0) {
      res.status(500).json({
        error:
          "No AI providers configured. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY environment variables.",
      });
      return;
    }

    // Generate unique agent ID
    const agentId = generateUniqueAgentId(analysisRequest.userId);

    // Generate unique personality fingerprint
    const personalityFingerprint = generatePersonalityFingerprint(
      analysisRequest.userId,
      analysisRequest.creatorProfile,
      agentId,
    );

    // Calculate adaptation factors
    const adaptationFactors = calculateAdaptationFactors(
      analysisRequest.creatorProfile,
    );

    // Compile market research data
    const marketResearch = await compileMarketResearchData(
      analysisRequest.creatorProfile.niche,
      analysisRequest.creatorProfile.platform,
      analysisRequest.creatorProfile.followers,
      agentId,
    );

    // Calculate Fame Score
    const fameScore = calculateUniqueFameScore(
      analysisRequest.creatorProfile,
      marketResearch,
      personalityFingerprint,
    );

    // Generate market position
    const marketPosition = generateMarketPosition(
      analysisRequest.creatorProfile,
      marketResearch,
      fameScore,
    );

    // Generate personalized recommendations
    const personalizationProfile = {
      userId: analysisRequest.userId,
      agentId,
      creatorProfile: analysisRequest.creatorProfile,
      personalityScore: personalityFingerprint,
      adaptationFactors,
    };

    const recommendations = generatePersonalizedRecommendations(
      marketResearch,
      personalizationProfile,
    );

    // Generate growth plan
    const growthPlan = generatePersonalizedGrowthPlan(
      analysisRequest.creatorProfile,
      marketResearch,
    );

    // Compile analysis response
    const analysis: AIAgentAnalysisResponse = {
      agentId,
      userId: analysisRequest.userId,
      analysis: {
        fameScore,
        marketPosition,
        keyInsights: marketResearch.industryInsights.slice(0, 5),
        recommendations,
        trendAnalysis: marketResearch.trends.slice(0, 3).join(" | "),
        competitiveAdvantage: `Based on market analysis, you stand out in the ${analysisRequest.creatorProfile.niche} space due to your ${adaptationFactors.contentQuality >= 7 ? "high-quality content" : "authentic approach"} and ${adaptationFactors.communityEngagement >= 7 ? "strong community engagement" : "growing audience base"}. Your unique selling proposition lies in combining ${analysisRequest.creatorProfile.niche} expertise with ${analysisRequest.creatorProfile.goals}.`,
        monetizationStrategy: `Start with ${adaptationFactors.timeToMonetize === "immediate" ? "premium brand partnerships and sponsorships" : "affiliate marketing and micro-partnerships"} to build momentum. Focus on ${adaptationFactors.communityEngagement >= 7 ? "community monetization through membership/courses" : "scaling reach before premium monetization"}.`,
      },
      marketResearch,
      growthPlan,
      generatedAt: new Date().toISOString(),
    };

    // Generate PDF
    let pdfUrl: string | undefined;
    try {
      const pdfBuffer = await generatePersonalizedPDF(analysis);
      // In production, upload to cloud storage (S3, Netlify Blobs, etc.)
      // For now, return as base64
      pdfUrl = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      // Continue without PDF if generation fails
    }

    analysis.pdfUrl = pdfUrl;

    res.json(analysis);
  } catch (error) {
    console.error("AI Agent Analysis error:", error);
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate AI analysis",
    });
  }
};
