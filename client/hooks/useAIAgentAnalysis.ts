import { useState, useCallback } from "react";
import {
  type AIAgentAnalysisRequest,
  type AIAgentAnalysisResponse,
} from "@shared/api";

interface UseAIAgentAnalysisState {
  data: AIAgentAnalysisResponse | null;
  loading: boolean;
  error: Error | null;
  analyze: (
    request: AIAgentAnalysisRequest,
  ) => Promise<AIAgentAnalysisResponse>;
}

/**
 * Hook for AI Agent Analysis with market research
 * Provides personalized creator growth analysis powered by multiple LLMs
 */
export function useAIAgentAnalysis(): UseAIAgentAnalysisState {
  const [data, setData] = useState<AIAgentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(
    async (
      request: AIAgentAnalysisRequest,
    ): Promise<AIAgentAnalysisResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai-agent-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(
            errorData.error || `API error: ${response.statusText}`,
          );
        }

        const analysisData = (await response.json()) as AIAgentAnalysisResponse;
        setData(analysisData);
        return analysisData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    data,
    loading,
    error,
    analyze,
  };
}
