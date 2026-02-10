import crypto from "crypto";

export interface AIProvider {
  name: string;
  apiKey: string;
  model: string;
}

export interface ResearchQuery {
  topic: string;
  context: string;
  requiredData: string[];
}

/**
 * Generates a unique, non-replicable agent ID based on user, timestamp, and entropy
 */
export function generateUniqueAgentId(userId: string): string {
  const timestamp = Date.now().toString();
  const entropy = crypto.randomBytes(16).toString("hex");
  const data = `${userId}:${timestamp}:${entropy}`;
  const hash = crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 16);
  return `agent_${hash}_${timestamp}`;
}

/**
 * Gets available AI providers from environment
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4-turbo",
    });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    providers.push({
      name: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-opus",
    });
  }

  if (process.env.GOOGLE_API_KEY) {
    providers.push({
      name: "google",
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-1.5-pro",
    });
  }

  return providers;
}

/**
 * Calls OpenAI API with research prompt
 */
export async function callOpenAI(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert market research analyst specializing in creator economy, social media trends, and influencer monetization strategies. Provide data-driven, actionable insights based on current market trends.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0].message.content;
}

/**
 * Calls Anthropic Claude API with research prompt
 */
export async function callAnthropic(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 2000,
      system:
        "You are an expert market research analyst specializing in creator economy, social media trends, and influencer monetization strategies. Provide data-driven, actionable insights based on current market trends.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    content: Array<{ text: string }>;
  };
  return data.content[0].text;
}

/**
 * Calls Google Gemini API with research prompt
 */
export async function callGoogle(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: {
            text: "You are an expert market research analyst specializing in creator economy, social media trends, and influencer monetization strategies. Provide data-driven, actionable insights based on current market trends.",
          },
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Google API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };
  return data.candidates[0].content.parts[0].text;
}

/**
 * Intelligent provider selection - chooses best provider or rounds between available ones
 */
export function selectBestProvider(providers: AIProvider[]): AIProvider {
  if (providers.length === 0) {
    throw new Error(
      "No AI providers configured. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY",
    );
  }

  // Prefer OpenAI for general analysis, Anthropic for deep reasoning, Google for trend analysis
  const preferredOrder = ["openai", "anthropic", "google"];
  for (const preferred of preferredOrder) {
    const provider = providers.find((p) => p.name === preferred);
    if (provider) return provider;
  }

  return providers[0];
}

/**
 * Executes AI-powered market research
 */
export async function executeMarketResearch(
  query: ResearchQuery,
  agentId: string,
): Promise<string> {
  const providers = getAvailableProviders();
  const selectedProvider = selectBestProvider(providers);

  const prompt = `
You are analyzing market trends for a creator in the following context:
Topic: ${query.topic}
Context: ${query.context}

Required data to research and analyze:
${query.requiredData.map((d) => `- ${d}`).join("\n")}

Please provide comprehensive, data-driven insights about:
1. Current market trends in this niche
2. What's working now (based on current algorithm changes)
3. Monetization opportunities
4. Competitive landscape
5. Growth strategies

Format your response as structured JSON with these keys:
- trends: array of current trends
- opportunities: array of monetization opportunities
- competitive_insights: competitive analysis
- recommendations: actionable recommendations

Agent ID: ${agentId} (for tracking unique analysis)
`;

  try {
    switch (selectedProvider.name) {
      case "openai":
        return await callOpenAI(selectedProvider.apiKey, prompt);
      case "anthropic":
        return await callAnthropic(selectedProvider.apiKey, prompt);
      case "google":
        return await callGoogle(selectedProvider.apiKey, prompt);
      default:
        throw new Error(`Unsupported provider: ${selectedProvider.name}`);
    }
  } catch (error) {
    console.error(`AI research failed with ${selectedProvider.name}:`, error);
    throw error;
  }
}
