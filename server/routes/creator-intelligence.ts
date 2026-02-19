import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

router.post("/executive-summary", async (req: Request, res: Response) => {
  try {
    const { scores, projections, profile, language } = req.body;

    if (!scores || !projections || !profile) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const isHindi = language === "hindi";

    const systemPrompt = isHindi
      ? `आप FameChase.com के AI क्रिएटर एनालिस्ट हैं। आपको क्रिएटर के स्कोर्स और डेटा के आधार पर एक पर्सनलाइज्ड एक्जीक्यूटिव समरी लिखनी है। 
हिंदी में लिखें, लेकिन टेक्निकल टर्म्स अंग्रेजी में रखें। 3-4 पैराग्राफ में लिखें। 
सीधे बात करें, डेटा-बैक्ड इनसाइट्स दें, और एक्शनेबल सलाह दें।
कोई इमोजी या मार्कडाउन फॉर्मेटिंग न उपयोग करें।`
      : `You are FameChase.com's AI Creator Analyst. Write a personalized executive summary based on the creator's computed scores and data.
Write in plain English, 3-4 paragraphs. Be direct, data-backed, and give actionable advice.
Do not use emojis or markdown formatting. Address the creator by name.`;

    const userPrompt = `Creator Profile:
- Name: ${profile.name}
- Platform: ${profile.platform}
- Niche: ${profile.niche}
- Followers: ${profile.followerRange} (${profile.followers} actual)
- Engagement Rate: ${profile.engagementRate}%
- Posting Frequency: ${profile.postingFrequency}
- Monthly Income: ${profile.incomeRange}
- City: ${profile.city}
- Goals: ${profile.goals?.join(", ") || "Not specified"}
- Challenges: ${profile.challenges?.join(", ") || "Not specified"}

Computed Scores:
- Overall Score: ${scores.overallScore}/100 (${scores.tierLabel})
- Authority Score: ${scores.authorityScore}/100
- Consistency Score: ${scores.consistencyScore}/100
- Algorithm Alignment: ${scores.algorithmAlignmentScore}/100
- Monetization Readiness: ${scores.monetizationReadinessScore}/100

Revenue Projections:
- Conservative Monthly: Rs.${projections.conservativeMonthly}
- Realistic Monthly: Rs.${projections.realisticMonthly}
- Aggressive Monthly: Rs.${projections.aggressiveMonthly}
- Brand Rate Per Post: Rs.${projections.brandRatePerPost}
- Brand Rate Per Reel: Rs.${projections.brandRatePerReel}

Write a personalized executive summary for this creator. Focus on:
1. Their current position and strengths
2. Their biggest growth opportunity based on the weakest score
3. Specific revenue path with numbers from the projections
4. One immediate action they should take this week`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content || "";

    res.json({ success: true, summary });
  } catch (error: any) {
    console.error("Executive summary error:", error?.message || error);
    res.json({
      success: false,
      summary: "",
      error: "Could not generate AI summary at this time.",
    });
  }
});

export default router;
