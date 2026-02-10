import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { type AIAgentAnalysisResponse } from "../../shared/api.js";
import fs from "fs";
import path from "path";

/**
 * Generates personalized PDF report with market research insights
 */
export async function generatePersonalizedPDF(
  analysis: AIAgentAnalysisResponse,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const { width, height } = PDFDocument.A4;

  // Page 1: Cover
  let page = pdfDoc.addPage([width, height]);
  drawCoverPage(page, analysis);

  // Page 2: Executive Summary
  page = pdfDoc.addPage([width, height]);
  drawExecutiveSummary(page, analysis);

  // Page 3: Market Research & Trends
  page = pdfDoc.addPage([width, height]);
  drawMarketResearch(page, analysis);

  // Page 4: Competitive Analysis
  page = pdfDoc.addPage([width, height]);
  drawCompetitiveAnalysis(page, analysis);

  // Page 5: Monetization Strategy
  page = pdfDoc.addPage([width, height]);
  drawMonetizationStrategy(page, analysis);

  // Page 6: Growth Plan
  page = pdfDoc.addPage([width, height]);
  drawGrowthPlan(page, analysis);

  // Page 7: Recommendations
  page = pdfDoc.addPage([width, height]);
  drawRecommendations(page, analysis);

  // Page 8: Media Kit (Bonus)
  page = pdfDoc.addPage([width, height]);
  drawMediaKitPreview(page, analysis);

  return await pdfDoc.save();
}

function drawCoverPage(page: PDFPage, analysis: AIAgentAnalysisResponse) {
  const { width, height } = page.getSize();

  // Background color
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.05, 0.65, 0.42),
  });

  // White rectangle for content
  page.drawRectangle({
    x: 40,
    y: height - 400,
    width: width - 80,
    height: 350,
    color: rgb(1, 1, 1),
  });

  // Title
  page.drawText("CREATOR GROWTH KIT", {
    x: 50,
    y: height - 120,
    size: 48,
    font: undefined,
    color: rgb(0.05, 0.65, 0.42),
  });

  // Subtitle
  page.drawText("AI-Powered Market Analysis & Growth Strategy", {
    x: 50,
    y: height - 160,
    size: 16,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Generated date and agent ID
  page.drawText(`Generated: ${analysis.generatedAt}`, {
    x: 50,
    y: height - 200,
    size: 11,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText(`Agent ID: ${analysis.agentId.substring(0, 20)}...`, {
    x: 50,
    y: height - 220,
    size: 11,
    color: rgb(0.6, 0.6, 0.6),
  });

  // FameChase branding
  page.drawText("FameChase.com", {
    x: 50,
    y: 50,
    size: 14,
    color: rgb(0.05, 0.65, 0.42),
  });
}

function drawExecutiveSummary(
  page: PDFPage,
  analysis: AIAgentAnalysisResponse,
) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("EXECUTIVE SUMMARY", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  // Fame Score Box
  page.drawRectangle({
    x: 40,
    y: y - 60,
    width: width - 80,
    height: 50,
    color: rgb(0.95, 0.95, 0.95),
  });

  page.drawText("Your Fame Score", {
    x: 50,
    y: y - 25,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`${analysis.analysis.fameScore}/100`, {
    x: 50,
    y: y - 50,
    size: 32,
    color: rgb(0.05, 0.65, 0.42),
  });

  y -= 100;

  // Market Position
  page.drawText("Market Position", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  const positionLines = wrapText(analysis.analysis.marketPosition, 95);
  for (const line of positionLines) {
    page.drawText(line, {
      x: 40,
      y,
      size: 11,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
  }

  y -= 15;

  // Key Insights
  page.drawText("Key Insights", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  const insights = analysis.analysis.keyInsights.slice(0, 3);
  for (const insight of insights) {
    page.drawText(`• ${insight}`, {
      x: 50,
      y,
      size: 10,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
  }
}

function drawMarketResearch(page: PDFPage, analysis: AIAgentAnalysisResponse) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("MARKET TRENDS & ANALYSIS", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  // Trends
  page.drawText("Current Market Trends", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  for (const trend of analysis.marketResearch.trends.slice(0, 5)) {
    const lines = wrapText(trend, 90);
    for (const line of lines) {
      page.drawText(`→ ${line}`, {
        x: 50,
        y,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 13;
    }
  }

  y -= 15;

  // Industry Insights
  page.drawText("Industry Insights", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  for (const insight of analysis.marketResearch.industryInsights.slice(0, 4)) {
    const lines = wrapText(insight, 90);
    for (const line of lines) {
      page.drawText(`◆ ${line}`, {
        x: 50,
        y,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 13;
    }
  }
}

function drawCompetitiveAnalysis(
  page: PDFPage,
  analysis: AIAgentAnalysisResponse,
) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("COMPETITIVE ADVANTAGE", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  // Your Competitive Advantage
  page.drawText("Your Unique Position", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  const advLines = wrapText(analysis.analysis.competitiveAdvantage, 95);
  for (const line of advLines) {
    page.drawText(line, {
      x: 40,
      y,
      size: 11,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
  }

  y -= 20;

  // Top Competitors
  page.drawText("Market Leaders to Study", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  for (const competitor of analysis.marketResearch.competitorAnalysis.topCompetitors.slice(
    0,
    3,
  )) {
    page.drawRectangle({
      x: 50,
      y: y - 50,
      width: width - 100,
      height: 45,
      color: rgb(0.98, 0.98, 0.98),
    });

    page.drawText(`${competitor.name}`, {
      x: 60,
      y: y - 20,
      size: 11,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(
      `${competitor.followers.toLocaleString()} followers | ${competitor.avgEngagement}% engagement`,
      {
        x: 60,
        y: y - 35,
        size: 9,
        color: rgb(0.5, 0.5, 0.5),
      },
    );

    y -= 60;
  }
}

function drawMonetizationStrategy(
  page: PDFPage,
  analysis: AIAgentAnalysisResponse,
) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("MONETIZATION ROADMAP", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  // Strategy Overview
  page.drawText("Recommended Strategy", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  const strategyLines = wrapText(analysis.analysis.monetizationStrategy, 95);
  for (const line of strategyLines) {
    page.drawText(line, {
      x: 40,
      y,
      size: 11,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
  }

  y -= 20;

  // Revenue Opportunities
  page.drawText("Revenue Opportunities", {
    x: 40,
    y,
    size: 14,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  for (const opp of analysis.marketResearch.monetizationOpportunities) {
    page.drawRectangle({
      x: 50,
      y: y - 50,
      width: width - 100,
      height: 45,
      color: rgb(0.05, 0.65, 0.42, 0.1),
    });

    page.drawText(`${opp.type}`, {
      x: 60,
      y: y - 20,
      size: 11,
      color: rgb(0.05, 0.65, 0.42),
    });

    page.drawText(`Estimated: ${opp.estimatedEarnings}`, {
      x: 60,
      y: y - 35,
      size: 9,
      color: rgb(0.4, 0.4, 0.4),
    });

    y -= 60;
  }
}

function drawGrowthPlan(page: PDFPage, analysis: AIAgentAnalysisResponse) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("3-MONTH GROWTH PLAN", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  // Next Month
  page.drawText("📅 Next 30 Days", {
    x: 40,
    y,
    size: 12,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  for (const item of analysis.growthPlan.nextMonth.slice(0, 3)) {
    const lines = wrapText(item, 90);
    for (const line of lines) {
      page.drawText(`✓ ${line}`, {
        x: 50,
        y,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 13;
    }
  }

  y -= 15;

  // Next Quarter
  page.drawText("📊 Next 90 Days", {
    x: 40,
    y,
    size: 12,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  for (const item of analysis.growthPlan.nextQuarter.slice(0, 3)) {
    const lines = wrapText(item, 90);
    for (const line of lines) {
      page.drawText(`✓ ${line}`, {
        x: 50,
        y,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 13;
    }
  }
}

function drawRecommendations(page: PDFPage, analysis: AIAgentAnalysisResponse) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("PERSONALIZED RECOMMENDATIONS", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  for (const rec of analysis.analysis.recommendations.slice(0, 6)) {
    const lines = wrapText(rec, 90);
    for (const line of lines) {
      page.drawText(`→ ${line}`, {
        x: 50,
        y,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 13;
    }
    y -= 5;
  }
}

function drawMediaKitPreview(page: PDFPage, analysis: AIAgentAnalysisResponse) {
  const { width, height } = page.getSize();
  let y = height - 40;

  // Title
  page.drawText("MEDIA KIT PREVIEW", {
    x: 40,
    y,
    size: 24,
    color: rgb(0.05, 0.65, 0.42),
  });
  y -= 40;

  page.drawText(
    "Your professional media kit is ready for download in a separate PDF.",
    {
      x: 40,
      y,
      size: 11,
      color: rgb(0.4, 0.4, 0.4),
    },
  );
  y -= 30;

  page.drawText("What's Included:", {
    x: 40,
    y,
    size: 12,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  const mediaKitItems = [
    "Your Fame Score & Market Position",
    "Follower demographics & audience insights",
    "Engagement metrics & growth trajectory",
    "Pricing recommendations by campaign type",
    "Media samples & portfolio section",
    "Contact information for partnerships",
  ];

  for (const item of mediaKitItems) {
    page.drawText(`✓ ${item}`, {
      x: 50,
      y,
      size: 10,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;
  }

  y -= 20;

  // Footer
  page.drawText(
    "For more details, visit FameChase.com or email mail@famechase.com",
    {
      x: 40,
      y: 40,
      size: 9,
      color: rgb(0.6, 0.6, 0.6),
    },
  );
}

/**
 * Utility function to wrap text based on character limit
 */
function wrapText(text: string, charLimit: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > charLimit) {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}
