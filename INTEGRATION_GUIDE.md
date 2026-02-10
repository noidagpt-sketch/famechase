# AI Agent Integration Guide

## Overview

This guide shows how to integrate the AI Agent market research analysis system into the existing FameChase quiz flow for personalized, market-driven insights.

## Integration Points

### 1. Quiz Submission Flow

**Current Flow:**

```
User completes Quiz → Data stored → Results page shown
```

**Enhanced Flow:**

```
User completes Quiz
  → Validate data
  → Call /api/ai-agent-analysis (parallel)
  → Store results in Supabase
  → Redirect to Results page with AI insights
```

### 2. Results Page Enhancement

The Results page should be enhanced to display:

- **AI-Generated Fame Score**: Powered by market research
- **Market Trends**: Real-time trends in their niche
- **Competitive Analysis**: How they compare to top creators
- **Personalized Recommendations**: Market-driven suggestions
- **Growth Plan**: 30-day, 90-day, and 1-year plans
- **Monetization Strategy**: Specific revenue opportunities
- **Market Research PDF**: Download comprehensive analysis

## Implementation Steps

### Step 1: Update Quiz Form Submission

**File: `client/pages/Quiz.tsx`**

Find the `handleSubmit` function and enhance it to call the AI agent:

```typescript
import { useAIAgentAnalysis } from "@/hooks/useAIAgentAnalysis";

function Quiz() {
  const { analyze } = useAIAgentAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Validate quiz data
      if (!quizData.email || !quizData.name) {
        toast.error("Please fill in all required fields");
        return;
      }

      // 2. Generate unique user ID
      const userId = `user_${quizData.email.split("@")[0]}_${Date.now()}`;

      // 3. Prepare AI agent request
      const followerCount = parseInt(quizData.followerCount) || 0;
      const engagementRate = parseFloat(quizData.engagementRate) || 0;
      const monthlyViews = followerCount * 10 * 30; // Estimate based on followers

      const aiRequest = {
        userId,
        creatorProfile: {
          name: quizData.name,
          niche: quizData.niche,
          platform: quizData.primaryPlatform,
          followers: followerCount,
          engagementRate: engagementRate / 100, // Convert to decimal
          monthlyViews,
          content: quizData.contentType,
          goals: quizData.goals.join(", "),
          challenges: quizData.biggestChallenge.join(", "),
        },
        analysisType: "comprehensive",
      };

      // 4. Call AI agent analysis (non-blocking)
      analyze(aiRequest)
        .then((result) => {
          // Store analysis in session or pass via navigation state
          sessionStorage.setItem("aiAnalysis", JSON.stringify(result));

          // Store in Supabase if configured
          if (isSupabaseConfigured) {
            dbHelpers.addQuizData({
              ...quizData,
              aiAnalysisId: result.agentId,
              fameScore: result.analysis.fameScore,
            });
          }
        })
        .catch((error) => {
          console.error("AI analysis failed:", error);
          // Continue without AI analysis if it fails
          toast.error(
            "Could not generate market analysis, showing standard results",
          );
        });

      // 5. Store quiz data and navigate
      sessionStorage.setItem("quizData", JSON.stringify(quizData));
      navigate("/results");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit quiz");
    }
  };
}
```

### Step 2: Update Results Page

**File: `client/pages/Results.tsx`**

Enhance the Results page to display AI insights:

```typescript
import { useEffect, useState } from "react";
import { type AIAgentAnalysisResponse } from "@shared/api";

function Results() {
  const [aiAnalysis, setAiAnalysis] = useState<AIAgentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve AI analysis from session
    const stored = sessionStorage.getItem("aiAnalysis");
    if (stored) {
      try {
        setAiAnalysis(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse AI analysis:", error);
      }
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ... Existing header ... */}

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p>Loading your personalized analysis...</p>
          </div>
        ) : aiAnalysis ? (
          <>
            {/* AI-Powered Fame Score Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-neon-green/10 to-neon-green/5 border-2 border-neon-green rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  AI-Powered Fame Score
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-neon-green">
                    {aiAnalysis.analysis.fameScore}
                  </span>
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Based on market analysis of your niche
                </p>
              </div>

              {/* Market Position */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Your Market Position
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {aiAnalysis.analysis.marketPosition}
                </p>
              </div>
            </div>

            {/* Market Trends Section */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Market Trends in Your Niche
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiAnalysis.marketResearch.trends.map((trend, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500"
                  >
                    <p className="text-gray-800">{trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Analysis */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🏆 Competitive Landscape
              </h2>
              <p className="text-gray-700 mb-6">
                {aiAnalysis.analysis.competitiveAdvantage}
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {aiAnalysis.marketResearch.competitorAnalysis.topCompetitors.map(
                  (competitor, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">
                        {competitor.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        👥 {competitor.followers.toLocaleString()} followers
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        📈 {competitor.avgEngagement}% engagement
                      </p>
                      <p className="text-xs text-blue-600 font-semibold">
                        {competitor.monetizationStrategy}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Monetization Strategy */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                💰 Your Monetization Strategy
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {aiAnalysis.analysis.monetizationStrategy}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {aiAnalysis.marketResearch.monetizationOpportunities.map(
                  (opp, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-xl border border-green-200"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">
                        {opp.type}
                      </h4>
                      <p className="text-2xl font-bold text-green-600 mb-3">
                        {opp.estimatedEarnings}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Requirements:</strong>
                        <br />
                        {opp.requirements.join(", ")}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Growth Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📈 Your 90-Day Growth Plan
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Next Month */}
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">
                    📅 Next 30 Days
                  </h3>
                  <ul className="space-y-2">
                    {aiAnalysis.growthPlan.nextMonth.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        ✓ {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Quarter */}
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-900 mb-4">
                    📊 Next 90 Days
                  </h3>
                  <ul className="space-y-2">
                    {aiAnalysis.growthPlan.nextQuarter.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        ✓ {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Year */}
                <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">
                    🚀 Next 12 Months
                  </h3>
                  <ul className="space-y-2">
                    {aiAnalysis.growthPlan.nextYear.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        ✓ {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                💡 Personalized Recommendations
              </h2>
              <div className="space-y-4">
                {aiAnalysis.analysis.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
                  >
                    <p className="text-gray-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Download PDF */}
            {aiAnalysis.pdfUrl && (
              <div className="bg-gradient-to-r from-neon-green/10 to-electric-blue/10 border-2 border-neon-green rounded-2xl p-8 text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  📥 Download Your Complete Analysis
                </h3>
                <p className="text-gray-600 mb-6">
                  Your comprehensive 8-page Creator Growth Kit with all market
                  research, analysis, and recommendations
                </p>
                <a
                  href={aiAnalysis.pdfUrl}
                  download={`creator-kit-${aiAnalysis.agentId}.pdf`}
                  className="bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all inline-block"
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Download PDF Report
                </a>
              </div>
            )}

            {/* Industry Insights */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔍 Industry Insights
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {aiAnalysis.marketResearch.industryInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200"
                  >
                    <p className="text-gray-800">◆ {insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-gray-700">
              Could not load AI-powered analysis. Please try again or refresh the page.
            </p>
          </div>
        )}

        {/* ... Existing Results Content ... */}
      </main>
    </div>
  );
}
```

### Step 3: Add Environment Variables

Set up your AI provider API keys:

```bash
# In .env file or via DevServerControl

# OpenAI
OPENAI_API_KEY=sk_your_api_key

# Anthropic (optional)
ANTHROPIC_API_KEY=sk-ant_your_api_key

# Google Gemini (optional)
GOOGLE_API_KEY=your_google_api_key
```

### Step 4: Testing the Integration

**Test the complete flow:**

```bash
# 1. Start the dev server
npm run dev

# 2. Go to quiz page
# http://localhost:3000/quiz

# 3. Fill out quiz form and submit

# 4. Watch the Results page load with AI analysis

# 5. Check console for any errors
```

## Data Flow Diagram

```
┌─────────────────────────────────┐
│   User Completes Quiz           │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Quiz Form Validation          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Generate User ID & Prepare    │
│   AI Agent Request              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   POST /api/ai-agent-analysis   │
└──────────────┬──────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   ┌────────┐      ┌─────────────┐
   │ Survey │      │AI Processing│
   │ Market │      │  Parallel   │
   └────────┘      │  Queries    │
       │            └─────────────┘
       │                │
       │       ┌────────┴────────┐
       │       ▼                ▼
       │    Market     Competitor
       │    Research   Analysis
       │       │         │
       └───────┼─────────┤
               ▼         ▼
          ┌───────────────────┐
          │ Compile Analysis  │
          │ Generate PDF      │
          └────────┬──────────┘
                   │
                   ▼
          ┌─────────────────────┐
          │ Return Response     │
          │ with All Insights   │
          └────────┬────────────┘
                   │
                   ▼
          ┌─────────────────────┐
          │ Store in Session    │
          │ Navigate to Results │
          └────────┬────────────┘
                   │
                   ▼
          ┌─────────────────────┐
          │ Display Results     │
          │ with AI Insights    │
          └─────────────────────┘
```

## Performance Considerations

1. **Non-blocking Analysis**: AI analysis runs in parallel with form submission
2. **Session Storage**: Results cached in browser session storage
3. **PDF Generation**: Happens server-side, only base64 string returned
4. **Timeout Handling**: Set reasonable timeouts for API calls

```typescript
// Example: Add timeout to AI analysis
const analysisPromise = analyze(aiRequest);
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Analysis timeout")), 30000),
);

Promise.race([analysisPromise, timeoutPromise])
  .then((result) => {
    // Use result
  })
  .catch((error) => {
    console.error("Analysis failed:", error);
    // Continue without AI analysis
  });
```

## Error Handling

The integration gracefully handles errors:

- **Missing API Keys**: Shows warning but continues
- **Timeout**: Falls back to basic results
- **PDF Generation Error**: Skips PDF but shows all other insights
- **Network Error**: Caches last known good result

## Next Steps

1. **Add Supabase Integration**: Store analyses in database
2. **Implement Caching**: Cache market research results
3. **Add User Tracking**: Track which recommendations users follow
4. **A/B Testing**: Compare different analysis variants
5. **Real-time Updates**: Refresh market data periodically

## Support

For questions or issues:

- Check the `AI_AGENT_SETUP.md` file for detailed documentation
- Review the example implementations in the codebase
- Check server logs for API errors
