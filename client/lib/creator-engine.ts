import { buildCreatorProfile, CreatorIntelligenceReport, CreatorScores, PDFTier } from "./creator-model";
import { computeAllScores } from "./creator-scores";
import { computeRevenueProjections, formatCurrency, formatCurrencyFull } from "./creator-projections";
import { generateRecommendations } from "./creator-recommendations";

export function generateCreatorReport(quizData: any): CreatorIntelligenceReport {
  const profile = buildCreatorProfile(quizData);
  const scores = computeAllScores(profile);
  const projections = computeRevenueProjections(profile);
  const recommendations = generateRecommendations(profile, scores, projections);

  return {
    profile,
    scores,
    projections,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

export function generateTieredPDFContent(
  report: CreatorIntelligenceReport,
  tier: PDFTier,
  language: "english" | "hindi"
): string {
  const { profile, scores, projections, recommendations } = report;
  const isHindi = language === "hindi";
  const name = profile.name || "Creator";
  const date = new Date().toLocaleDateString("en-IN");

  let content = "";

  content += generateHeader(name, tier, date, isHindi);
  content += generateScoresSection(scores, isHindi);

  if (tier === "free") {
    content += generateFreeInsights(profile, scores, projections, isHindi);
    content += generateUpgradePrompt(isHindi);
  }

  if (tier === "pro" || tier === "premium") {
    content += generateFullProjections(projections, profile, isHindi);
    content += generateFullRecommendations(recommendations, isHindi);
    content += generateGrowthRoadmap(profile, scores, projections, isHindi);
  }

  if (tier === "premium") {
    content += generateMonetizationBlueprint(profile, projections, isHindi);
    content += generateOutreachScripts(profile, projections, isHindi);
    content += generateROIModel(projections, isHindi);
    content += generateBrandRateCard(profile, projections, isHindi);
  }

  content += generateFooter(date, tier, isHindi);

  return content;
}

function generateHeader(name: string, tier: PDFTier, date: string, isHindi: boolean): string {
  const tierLabels = { free: "Free Report", pro: "Pro Growth Report", premium: "Premium Intelligence Report" };
  const tierLabelsHindi = { free: "फ्री रिपोर्ट", pro: "प्रो ग्रोथ रिपोर्ट", premium: "प्रीमियम इंटेलिजेंस रिपोर्ट" };
  return `
${"=".repeat(60)}
${isHindi ? "FAMECHASE क्रिएटर इंटेलिजेंस रिपोर्ट" : "FAMECHASE CREATOR INTELLIGENCE REPORT"}
${isHindi ? tierLabelsHindi[tier] : tierLabels[tier]}
${"=".repeat(60)}

${isHindi ? "क्रिएटर:" : "Creator:"} ${name}
${isHindi ? "जेनरेट:" : "Generated:"} ${date}
${"-".repeat(60)}

`;
}

function generateScoresSection(scores: CreatorScores, isHindi: boolean): string {
  return `
${isHindi ? "--- आपके क्रिएटर स्कोर्स ---" : "--- YOUR CREATOR SCORES ---"}

${isHindi ? "समग्र स्कोर:" : "OVERALL SCORE:"} ${scores.overallScore}/100 [${scores.tierLabel}]
${scores.overallInterpretation}

${isHindi ? "ऑथोरिटी स्कोर:" : "Authority Score:"} ${scores.authorityScore}/100
${scores.authorityInterpretation}

${isHindi ? "कंसिस्टेंसी स्कोर:" : "Consistency Score:"} ${scores.consistencyScore}/100
${scores.consistencyInterpretation}

${isHindi ? "एल्गोरिदम अलाइनमेंट:" : "Algorithm Alignment:"} ${scores.algorithmAlignmentScore}/100
${scores.algorithmAlignmentInterpretation}

${isHindi ? "मोनेटाइज़ेशन रेडीनेस:" : "Monetization Readiness:"} ${scores.monetizationReadinessScore}/100
${scores.monetizationReadinessInterpretation}

`;
}

function generateFreeInsights(profile: any, scores: any, projections: any, isHindi: boolean): string {
  return `
${isHindi ? "--- सारांश ---" : "--- SUMMARY ---"}

${isHindi ? "प्लेटफॉर्म:" : "Platform:"} ${profile.platform}
${isHindi ? "निच:" : "Niche:"} ${profile.niche}
${isHindi ? "फॉलोअर्स:" : "Followers:"} ${profile.followerRange}
${isHindi ? "एंगेजमेंट:" : "Engagement:"} ${profile.engagementRate}%
${isHindi ? "अनुमानित मासिक आय क्षमता:" : "Estimated Monthly Income Potential:"} ${formatCurrencyFull(projections.realisticMonthly)}

${isHindi ? "मुख्य इनसाइट:" : "Key Insight:"}
${scores.overallScore >= 60
    ? (isHindi ? "आप अपने निच में अच्छी स्थिति में हैं। अपनी कमजोर मेट्रिक्स पर ध्यान दें।" : "You're well-positioned in your niche. Focus on improving your weakest metrics.")
    : (isHindi ? "ग्रोथ की काफी गुंजाइश है। नीचे के सुझावों पर ध्यान दें।" : "Significant growth potential ahead. Focus on the suggestions below.")}

`;
}

function generateUpgradePrompt(isHindi: boolean): string {
  return `
${"=".repeat(60)}
${isHindi ? "प्रो रिपोर्ट में अनलॉक करें:" : "UNLOCK IN PRO REPORT:"}
- ${isHindi ? "पूरा रेवेन्यू प्रोजेक्शन इंजन" : "Full Revenue Projection Engine"}
- ${isHindi ? "पर्सनलाइज्ड ग्रोथ रोडमैप" : "Personalized Growth Roadmap"}
- ${isHindi ? "एक्शनेबल रिकमेंडेशन्स" : "Actionable Recommendations"}

${isHindi ? "प्रीमियम रिपोर्ट में अनलॉक करें:" : "UNLOCK IN PREMIUM REPORT:"}
- ${isHindi ? "मोनेटाइज़ेशन ब्लूप्रिंट" : "Monetization Blueprint"}
- ${isHindi ? "ब्रांड आउटरीच स्क्रिप्ट्स" : "Brand Outreach Scripts"}
- ${isHindi ? "ROI मॉडल और रेवेन्यू प्रोजेक्शन" : "ROI Model & Revenue Projections"}
- ${isHindi ? "कस्टम ब्रांड रेट कार्ड" : "Custom Brand Rate Card"}
${"=".repeat(60)}
`;
}

function generateFullProjections(projections: any, profile: any, isHindi: boolean): string {
  return `
${isHindi ? "--- रेवेन्यू प्रोजेक्शन (पारदर्शिता अनुभाग) ---" : "--- REVENUE PROJECTIONS (Formula Transparency) ---"}

${isHindi ? "गणना सूत्र:" : "Calculation Formula:"}
Rate = Base Rate × Niche Multiplier × Engagement Bonus
Engagement Bonus = +30% if 4–6%, +50% if 6%+

${isHindi ? "ब्रांड रेट कार्ड (आपके प्रोफाइल पर आधारित):" : "Brand Rate Card (Based on your profile):"}
${isHindi ? "पोस्ट:" : "Post:"} ${formatCurrencyFull(projections.brandRatePerPost)} - ${formatCurrencyFull(Math.round(projections.brandRatePerPost * 1.3))}
${isHindi ? "रील:" : "Reel:"} ${formatCurrencyFull(projections.brandRatePerReel)} - ${formatCurrencyFull(Math.round(projections.brandRatePerReel * 1.3))}
${isHindi ? "स्टोरी:" : "Story:"} ${formatCurrencyFull(projections.brandRatePerStory)} - ${formatCurrencyFull(Math.round(projections.brandRatePerStory * 1.3))}
${isHindi ? "वीडियो:" : "Video:"} ${formatCurrencyFull(projections.brandRatePerVideo)} - ${formatCurrencyFull(Math.round(projections.brandRatePerVideo * 1.3))}

${isHindi ? "मासिक इनकम सिनेरियो:" : "Monthly Income Scenarios:"}
${isHindi ? "लो (कंजर्वेटिव):" : "Low (Conservative):"} ${formatCurrencyFull(projections.conservativeMonthly)}/month
${isHindi ? "मिड (रियलिस्टिक):" : "Mid (Realistic):"} ${formatCurrencyFull(projections.realisticMonthly)}/month
${isHindi ? "हाई (एग्रेसिव):" : "High (Aggressive):"} ${formatCurrencyFull(projections.aggressiveMonthly)}/month

${isHindi ? "6-महीने का प्रोजेक्शन:" : "6-Month Projection:"}
${isHindi ? "लो:" : "Low:"} ${formatCurrencyFull(projections.sixMonthProjection.conservative)}
${isHindi ? "मिड:" : "Mid:"} ${formatCurrencyFull(projections.sixMonthProjection.realistic)}
${isHindi ? "हाई:" : "High:"} ${formatCurrencyFull(projections.sixMonthProjection.aggressive)}

`;
}

function generateFullRecommendations(recommendations: any[], isHindi: boolean): string {
  if (recommendations.length === 0) return "";
  let content = `\n${isHindi ? "--- पर्सनलाइज्ड रिकमेंडेशन्स ---" : "--- PERSONALIZED RECOMMENDATIONS ---"}\n\n`;

  recommendations.forEach((rec, i) => {
    const priorityIcon = rec.priority === "critical" ? "!!!" : rec.priority === "high" ? "!!" : "!";
    content += `[${priorityIcon}] ${i + 1}. ${isHindi ? rec.titleHindi : rec.title}\n`;
    content += `${isHindi ? rec.descriptionHindi : rec.description}\n\n`;
    content += `${isHindi ? "एक्शन स्टेप्स:" : "Action Steps:"}\n`;
    const actions = isHindi ? rec.actionsHindi : rec.actions;
    actions.forEach((a: string, j: number) => {
      content += `  ${j + 1}. ${a}\n`;
    });
    content += `\n${isHindi ? "अपेक्षित प्रभाव:" : "Expected Impact:"} ${isHindi ? rec.expectedImpactHindi : rec.expectedImpact}\n`;
    content += `${isHindi ? "समयसीमा:" : "Timeframe:"} ${rec.timeframe}\n\n`;
  });

  return content;
}

function generateGrowthRoadmap(profile: any, scores: any, projections: any, isHindi: boolean): string {
  return `
${isHindi ? "--- 90-दिन ग्रोथ रोडमैप ---" : "--- 90-DAY GROWTH ROADMAP ---"}

${isHindi ? "चरण 1 (दिन 1-30): फाउंडेशन" : "Phase 1 (Days 1-30): Foundation"}
${isHindi ? "- कंटेंट कैलेंडर सेटअप और बैच क्रिएशन" : "- Content calendar setup and batch creation"}
${isHindi ? "- प्रोफाइल ऑप्टिमाइज़ेशन (बायो, हाइलाइट्स, लिंक)" : "- Profile optimization (bio, highlights, links)"}
${isHindi ? "- एंगेजमेंट रूटीन स्थापित करें (दैनिक 30 मिनट)" : "- Establish engagement routine (30 min daily)"}
${isHindi ? "- लक्ष्य: एंगेजमेंट रेट 1% बढ़ाना" : "- Target: Increase engagement rate by 1%"}

${isHindi ? "चरण 2 (दिन 31-60): ग्रोथ" : "Phase 2 (Days 31-60): Growth"}
${isHindi ? "- एल्गोरिदम-अलाइन्ड कंटेंट फॉर्मेट (रील्स/शॉर्ट्स)" : "- Algorithm-aligned content formats (Reels/Shorts)"}
${isHindi ? "- कोलैबोरेशन और क्रॉस-प्रमोशन" : "- Collaborations and cross-promotion"}
${isHindi ? "- मीडिया किट तैयार करें" : "- Prepare media kit"}
${isHindi ? "- लक्ष्य: फॉलोअर्स 20-30% बढ़ाना" : "- Target: Grow followers by 20-30%"}

${isHindi ? "चरण 3 (दिन 61-90): मोनेटाइज़ेशन" : "Phase 3 (Days 61-90): Monetization"}
${isHindi ? "- ब्रांड आउटरीच शुरू करें (5 पिच/सप्ताह)" : "- Begin brand outreach (5 pitches/week)"}
${isHindi ? "- एफिलिएट प्रोग्राम्स जॉइन करें" : "- Join affiliate programs"}
${isHindi ? "- डिजिटल प्रोडक्ट प्लान करें" : "- Plan digital product"}
${isHindi ? "- लक्ष्य:" : "- Target:"} ${formatCurrencyFull(projections.conservativeMonthly)} ${isHindi ? "मासिक आय" : "monthly income"}

`;
}

function generateMonetizationBlueprint(profile: any, projections: any, isHindi: boolean): string {
  const dealsNeeded = Math.max(1, Math.ceil(projections.realisticMonthly / projections.brandRatePerPost));
  return `
${isHindi ? "--- मोनेटाइज़ेशन ब्लूप्रिंट ---" : "--- MONETIZATION BLUEPRINT ---"}

${isHindi ? "इनकम डायवर्सिफिकेशन प्लान:" : "Income Diversification Plan:"}

1. ${isHindi ? "ब्रांड डील्स (40% रेवेन्यू)" : "Brand Deals (40% Revenue)"}
   ${isHindi ? "- टार्गेट:" : "- Target:"} ${dealsNeeded} ${isHindi ? "डील्स/महीना" : "deals/month"}
   ${isHindi ? "- रेट:" : "- Rate:"} ${formatCurrencyFull(projections.brandRatePerPost)} - ${formatCurrencyFull(projections.brandRatePerReel)} ${isHindi ? "प्रति कंटेंट" : "per content"}
   ${isHindi ? "- प्रोजेक्टेड:" : "- Projected:"} ${formatCurrencyFull(Math.round(projections.realisticMonthly * 0.4))}/month

2. ${isHindi ? "एफिलिएट मार्केटिंग (30% रेवेन्यू)" : "Affiliate Marketing (30% Revenue)"}
   ${isHindi ? "- प्लेटफॉर्म:" : "- Platforms:"} Amazon Associates, Flipkart Affiliate, niche-specific programs
   ${isHindi ? "- प्रोजेक्टेड:" : "- Projected:"} ${formatCurrencyFull(Math.round(projections.realisticMonthly * 0.3))}/month

3. ${isHindi ? "डिजिटल प्रोडक्ट्स (30% रेवेन्यू)" : "Digital Products (30% Revenue)"}
   ${isHindi ? "- प्रोडक्ट आइडिया:" : "- Product Ideas:"} ${profile.niche} ${isHindi ? "गाइड, टेम्प्लेट, कोर्स" : "guide, templates, course"}
   ${isHindi ? "- प्राइसिंग:" : "- Pricing:"} ₹99-₹999
   ${isHindi ? "- प्रोजेक्टेड:" : "- Projected:"} ${formatCurrencyFull(Math.round(projections.realisticMonthly * 0.3))}/month

${isHindi ? "कुल मासिक टार्गेट:" : "Total Monthly Target:"} ${formatCurrencyFull(projections.realisticMonthly)}

`;
}

function generateOutreachScripts(profile: any, projections: any, isHindi: boolean): string {
  return `
${isHindi ? "--- ब्रांड आउटरीच स्क्रिप्ट्स ---" : "--- BRAND OUTREACH SCRIPTS ---"}

${isHindi ? "स्क्रिप्ट 1: कोल्ड DM/ईमेल" : "Script 1: Cold DM/Email"}
${"─".repeat(50)}
Subject: ${profile.niche} Content Collaboration - ${profile.name}

Hi [Brand Name] Team,

I'm ${profile.name}, a ${profile.niche} creator with ${profile.followerRange} engaged followers on ${profile.platform}. My audience achieves ${profile.engagementRate}% engagement rate, and I specialize in creating content that drives real results.

I'd love to create authentic content showcasing [specific product]. My rates start at ${formatCurrencyFull(projections.brandRatePerPost)} per post.

${isHindi ? "मेरे पोर्टफोलियो और मीडिया किट के लिए मुझे बताएं।" : "Happy to share my media kit and past campaign results."}

Best,
${profile.name}

${isHindi ? "स्क्रिप्ट 2: फॉलो-अप" : "Script 2: Follow-up (3 days later)"}
${"─".repeat(50)}
Hi [Brand Name],

Following up on my collaboration proposal. I noticed [recent brand activity/campaign] - I'd love to create similar content for your audience.

Quick stats:
- ${profile.followerRange} followers (${profile.engagementRate}% ER)
- Niche: ${profile.niche}
- Rate: Starting at ${formatCurrencyFull(projections.brandRatePerPost)}

Would love to hop on a quick call this week.

Best,
${profile.name}

${isHindi ? "स्क्रिप्ट 3: नेगोशिएशन" : "Script 3: Negotiation Response"}
${"─".repeat(50)}
Thank you for your interest! Here's my rate card:

Single Post: ${formatCurrencyFull(projections.brandRatePerPost)}
Reel/Short: ${formatCurrencyFull(projections.brandRatePerReel)}
Story: ${formatCurrencyFull(projections.brandRatePerStory)}
Video: ${formatCurrencyFull(projections.brandRatePerVideo)}

Package Deal (3 posts + 5 stories): ${formatCurrencyFull(Math.round((projections.brandRatePerPost * 3 + projections.brandRatePerStory * 5) * 0.85))} (15% discount)

Long-term Partnership (3 months): 25% discount on all rates.

`;
}

function generateROIModel(projections: any, isHindi: boolean): string {
  return `
${isHindi ? "--- ROI मॉडल ---" : "--- ROI MODEL ---"}

${isHindi ? "वर्तमान अनुमानित मासिक रेवेन्यू:" : "Current Estimated Monthly Revenue:"} ${formatCurrencyFull(projections.roiModel.currentRate)}

${isHindi ? "अगर एंगेजमेंट 2x बढ़े:" : "If Engagement Doubles (2x):"} ${formatCurrencyFull(projections.roiModel.ifEngagementUp2x)} (+${Math.round((projections.roiModel.ifEngagementUp2x / projections.roiModel.currentRate - 1) * 100)}%)
${isHindi ? "अगर व्यूज़ 2x बढ़ें:" : "If Views Double (2x):"} ${formatCurrencyFull(projections.roiModel.ifViewsUp2x)} (+${Math.round((projections.roiModel.ifViewsUp2x / projections.roiModel.currentRate - 1) * 100)}%)
${isHindi ? "अगर दोनों 2x बढ़ें:" : "If Both Double (2x):"} ${formatCurrencyFull(projections.roiModel.ifBothUp2x)} (+${Math.round((projections.roiModel.ifBothUp2x / projections.roiModel.currentRate - 1) * 100)}%)

${isHindi ? "निवेश पर वापसी (ROI) विश्लेषण:" : "Return on Investment (ROI) Analysis:"}
${isHindi ? "- कंटेंट टूल्स में ₹500/महीना निवेश" : "- ₹500/month investment in content tools"} = ${Math.round(projections.roiModel.currentRate / 500)}x ${isHindi ? "रिटर्न" : "return"}
${isHindi ? "- एड स्पेंड में ₹2000/महीना निवेश" : "- ₹2,000/month investment in ad spend"} = ${Math.round(projections.roiModel.ifViewsUp2x / 2000)}x ${isHindi ? "रिटर्न" : "return"}

`;
}

function generateBrandRateCard(profile: any, projections: any, isHindi: boolean): string {
  return `
${isHindi ? "--- कस्टम ब्रांड रेट कार्ड ---" : "--- CUSTOM BRAND RATE CARD ---"}

${profile.name} | ${profile.platform} ${isHindi ? "क्रिएटर" : "Creator"}
${profile.niche} | ${profile.followerRange} ${isHindi ? "फॉलोअर्स" : "Followers"} | ${profile.engagementRate}% ER
${isHindi ? "लक्ष्य:" : "Goals:"} ${profile.goals.join(", ")}

${"─".repeat(50)}
${isHindi ? "सर्विस" : "Service"}              | ${isHindi ? "रेट" : "Rate"}
${"─".repeat(50)}
${isHindi ? "स्टैटिक पोस्ट" : "Static Post"}           | ${formatCurrencyFull(projections.brandRatePerPost)}
${isHindi ? "रील/शॉर्ट" : "Reel/Short"}             | ${formatCurrencyFull(projections.brandRatePerReel)}
${isHindi ? "स्टोरी (24hr)" : "Story (24hr)"}          | ${formatCurrencyFull(projections.brandRatePerStory)}
${isHindi ? "वीडियो" : "Video"}                | ${formatCurrencyFull(projections.brandRatePerVideo)}
${isHindi ? "कैरोसल" : "Carousel"}              | ${formatCurrencyFull(Math.round(projections.brandRatePerPost * 1.3))}
${isHindi ? "प्रोडक्ट रिव्यू" : "Product Review"}       | ${formatCurrencyFull(Math.round(projections.brandRatePerReel * 1.5))}
${"─".repeat(50)}

${isHindi ? "पैकेज डील्स:" : "Package Deals:"}
${isHindi ? "बेसिक:" : "Basic:"} 2 Posts + 3 Stories = ${formatCurrencyFull(Math.round((projections.brandRatePerPost * 2 + projections.brandRatePerStory * 3) * 0.9))}
${isHindi ? "स्टैंडर्ड:" : "Standard:"} 3 Posts + 2 Reels + 5 Stories = ${formatCurrencyFull(Math.round((projections.brandRatePerPost * 3 + projections.brandRatePerReel * 2 + projections.brandRatePerStory * 5) * 0.85))}
${isHindi ? "प्रीमियम:" : "Premium:"} 5 Posts + 3 Reels + 10 Stories + 1 Video = ${formatCurrencyFull(Math.round((projections.brandRatePerPost * 5 + projections.brandRatePerReel * 3 + projections.brandRatePerStory * 10 + projections.brandRatePerVideo) * 0.8))}

${isHindi ? "नोट:" : "Note:"} ${isHindi ? "3+ महीने की पार्टनरशिप पर 25% डिस्काउंट" : "25% discount on 3+ month partnerships"}

`;
}

function generateFooter(date: string, tier: PDFTier, isHindi: boolean): string {
  return `
${"=".repeat(60)}
${isHindi ? "जेनरेट किया गया:" : "Generated:"} ${date}
${isHindi ? "पावर्ड बाय:" : "Powered by:"} FameChase.com Creator Intelligence Engine
${isHindi ? "यह रिपोर्ट आपके क्विज़ डेटा और रियल मार्केट मेट्रिक्स पर आधारित है।" : "This report is based on your quiz data and real market metrics."}
${"=".repeat(60)}
`;
}

export { formatCurrency, formatCurrencyFull };
