import { useEffect, useState, useCallback } from "react";
import {
  CaptureQuizDataRequest,
  CaptureDownloadRequest,
  UserQuizData,
} from "@shared/api";

interface UserAnalyticsState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook to capture and send user data to analytics backend
 * Automatically sends quiz data and tracks downloads
 */
export function useUserAnalytics() {
  const [state, setState] = useState<UserAnalyticsState>({
    isLoading: false,
    error: null,
    success: false,
  });

  /**
   * Capture quiz data and send to backend
   */
  const captureQuizData = useCallback(
    async (quizData: Partial<UserQuizData>) => {
      setState({ isLoading: true, error: null, success: false });

      try {
        // Generate userId if not provided
        const userId =
          quizData.userId ||
          `user_${quizData.email?.replace(/[^a-z0-9]/g, "") || Date.now()}`;

        const payload: CaptureQuizDataRequest = {
          quizData: {
            userId,
            name: quizData.name || "",
            email: quizData.email || "",
            phone: quizData.phone,
            age: quizData.age,
            city: quizData.city,
            primaryPlatform: quizData.primaryPlatform || "",
            secondaryPlatforms: quizData.secondaryPlatforms || [],
            followerCount: quizData.followerCount || 0,
            engagementRate: quizData.engagementRate || 0,
            niche: quizData.niche || "",
            contentType: quizData.contentType || "",
            postingFrequency: quizData.postingFrequency || "",
            experience: quizData.experience || [],
            monthlyIncome: quizData.monthlyIncome,
            biggestChallenge: quizData.biggestChallenge || [],
            goals: quizData.goals || [],
            socialLinks: quizData.socialLinks || {},
            bio: quizData.bio,
            language: (quizData.language as "english" | "hindi") || "english",
            analysisData: quizData.analysisData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        const response = await fetch("/api/user-analytics/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to capture quiz data: ${response.statusText}`,
          );
        }

        const data = await response.json();

        setState({
          isLoading: false,
          error: null,
          success: data.success,
        });

        console.log("✅ Quiz data captured successfully", data);

        return data;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        setState({
          isLoading: false,
          error: errorMsg,
          success: false,
        });
        console.error("❌ Error capturing quiz data:", errorMsg);
        throw error;
      }
    },
    [],
  );

  /**
   * Track a file download
   */
  const trackDownload = useCallback(
    async (
      userId: string,
      downloadType: string,
      fileName: string,
      productId?: string,
    ) => {
      try {
        const payload: CaptureDownloadRequest = {
          userId,
          downloadType,
          fileName,
          productId,
        };

        const response = await fetch("/api/user-analytics/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to track download: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Download tracked successfully", data);
        return data;
      } catch (error) {
        console.error("❌ Error tracking download:", error);
        // Don't throw - downloads should still work even if tracking fails
      }
    },
    [],
  );

  /**
   * Get user analytics
   */
  const getUserAnalytics = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/user-analytics/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ User analytics retrieved", data);
      return data;
    } catch (error) {
      console.error("❌ Error getting analytics:", error);
      throw error;
    }
  }, []);

  return {
    ...state,
    captureQuizData,
    trackDownload,
    getUserAnalytics,
  };
}

/**
 * Hook to auto-capture quiz data when mounted
 * Use this in your results page to automatically save data
 */
export function useAutoCapturequizData(quizData: Partial<UserQuizData>) {
  const { captureQuizData } = useUserAnalytics();
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (!captured && quizData.email && quizData.name) {
      captureQuizData(quizData)
        .then(() => setCaptured(true))
        .catch((error) => {
          console.error("Failed to auto-capture quiz data:", error);
        });
    }
  }, [quizData, captureQuizData, captured]);

  return { captured };
}
