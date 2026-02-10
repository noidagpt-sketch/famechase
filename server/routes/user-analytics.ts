import { RequestHandler } from "express";
import {
  CaptureQuizDataRequest,
  CaptureQuizDataResponse,
  CaptureDownloadRequest,
  CaptureDownloadResponse,
  GetUserAnalyticsRequest,
  GetUserAnalyticsResponse,
  UserQuizData,
  UserDownloadRecord,
  UserAnalyticsSummary,
} from "@shared/api";

/**
 * In-memory storage for user data (replace with database like Supabase)
 * This is a simple implementation - in production, connect to Supabase or any DB
 */
const userDatabase = new Map<string, UserQuizData>();
const downloadDatabase = new Map<string, UserDownloadRecord[]>();

/**
 * POST /api/user-analytics/quiz
 * Capture user quiz data and personal information
 */
export const handleCaptureQuizData: RequestHandler = async (req, res) => {
  try {
    const { quizData } = req.body as CaptureQuizDataRequest;

    // Validate required fields
    if (!quizData || !quizData.userId || !quizData.email || !quizData.name) {
      return res.status(400).json({
        success: false,
        userId: quizData?.userId || "unknown",
        message: "Missing required fields: userId, email, name",
      });
    }

    // Add timestamps
    const dataToStore: UserQuizData = {
      ...quizData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in memory (TODO: Replace with Supabase or your database)
    userDatabase.set(quizData.userId, dataToStore);

    // TODO: Connect to Supabase
    // const { data, error } = await supabase
    //   .from('user_quiz_data')
    //   .upsert([dataToStore])
    //   .select()
    //   .single();

    console.log(`✅ Quiz data captured for user: ${quizData.userId}`);

    const response: CaptureQuizDataResponse = {
      success: true,
      userId: quizData.userId,
      message: "Quiz data captured successfully",
    };

    return res.json(response);
  } catch (error) {
    console.error("Error capturing quiz data:", error);
    return res.status(500).json({
      success: false,
      userId: "unknown",
      message: "Failed to capture quiz data",
    });
  }
};

/**
 * POST /api/user-analytics/download
 * Track when a user downloads a file
 */
export const handleCaptureDownload: RequestHandler = async (req, res) => {
  try {
    const { userId, downloadType, fileName, productId } =
      req.body as CaptureDownloadRequest;

    // Validate required fields
    if (!userId || !downloadType || !fileName) {
      return res.status(400).json({
        success: false,
        downloadId: "unknown",
        message: "Missing required fields: userId, downloadType, fileName",
      });
    }

    const downloadRecord: UserDownloadRecord = {
      id: `download_${userId}_${Date.now()}`,
      userId,
      downloadType,
      fileName,
      downloadedAt: new Date().toISOString(),
      productId,
      metadata: {
        downloadedAt: new Date().toISOString(),
        userAgent: req.get("user-agent"),
      },
    };

    // Store in memory (TODO: Replace with Supabase or your database)
    if (!downloadDatabase.has(userId)) {
      downloadDatabase.set(userId, []);
    }
    downloadDatabase.get(userId)!.push(downloadRecord);

    // TODO: Connect to Supabase
    // const { data, error } = await supabase
    //   .from('user_downloads')
    //   .insert([downloadRecord])
    //   .select()
    //   .single();

    console.log(`✅ Download tracked for user: ${userId}, file: ${fileName}`);

    const response: CaptureDownloadResponse = {
      success: true,
      downloadId: downloadRecord.id,
      message: "Download tracked successfully",
    };

    return res.json(response);
  } catch (error) {
    console.error("Error tracking download:", error);
    return res.status(500).json({
      success: false,
      downloadId: "unknown",
      message: "Failed to track download",
    });
  }
};

/**
 * GET /api/user-analytics/:userId
 * Retrieve comprehensive user analytics and data
 */
export const handleGetUserAnalytics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Retrieve from memory (TODO: Replace with Supabase or your database)
    const quizData = userDatabase.get(userId);
    const downloads = downloadDatabase.get(userId) || [];

    if (!quizData) {
      return res.status(404).json({
        success: false,
        message: `No data found for user: ${userId}`,
      });
    }

    // Calculate analytics
    const totalDownloadSize = downloads.reduce(
      (sum, d) => sum + (d.fileSize || 0),
      0,
    );
    const engagementScore = calculateEngagementScore(quizData);

    const analytics: UserAnalyticsSummary = {
      userId,
      totalQuizzes: 1, // Could track multiple quizzes
      totalDownloads: downloads.length,
      totalDownloadSize,
      lastActivityAt: new Date().toISOString(),
      quizHistory: [quizData],
      downloadHistory: downloads,
      engagementScore,
      platformDistribution: calculatePlatformDistribution(quizData),
    };

    // TODO: Connect to Supabase for retrieval
    // const { data, error } = await supabase
    //   .from('user_quiz_data')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .single();

    console.log(`✅ Analytics retrieved for user: ${userId}`);

    const response: GetUserAnalyticsResponse = {
      success: true,
      analytics,
      message: "User analytics retrieved successfully",
    };

    return res.json(response);
  } catch (error) {
    console.error("Error retrieving user analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user analytics",
    });
  }
};

/**
 * Helper Functions
 */

function calculateEngagementScore(quizData: UserQuizData): number {
  /**
   * Calculate engagement score based on:
   * - Follower count (0-30 pts)
   * - Engagement rate (0-35 pts)
   * - Posting frequency (0-20 pts)
   * - Experience level (0-15 pts)
   */

  let score = 0;

  // Follower score (max 30)
  const followers = quizData.followerCount || 0;
  const followerScore = Math.min(30, (followers / 100000) * 30);
  score += followerScore;

  // Engagement rate (max 35)
  const engagementScore = Math.min(
    35,
    (quizData.engagementRate || 0) * 100 * 3.5,
  );
  score += engagementScore;

  // Posting frequency (max 20)
  const frequencyMap: Record<string, number> = {
    daily: 20,
    multiple_times: 18,
    once: 15,
    few_times: 12,
    rarely: 5,
  };
  score += frequencyMap[quizData.postingFrequency] || 10;

  // Experience level (max 15)
  const experienceScore = quizData.experience
    ? quizData.experience.length * 3
    : 5;
  score += Math.min(15, experienceScore);

  return Math.min(100, Math.round(score));
}

function calculatePlatformDistribution(
  quizData: UserQuizData,
): Record<string, number> {
  const distribution: Record<string, number> = {};

  distribution[quizData.primaryPlatform] = 1;

  quizData.secondaryPlatforms?.forEach((platform) => {
    distribution[platform] = (distribution[platform] || 0) + 1;
  });

  return distribution;
}

/**
 * Helper function to get all users (for admin dashboard)
 * GET /api/user-analytics/admin/all
 */
export const handleGetAllUsersAnalytics: RequestHandler = async (_req, res) => {
  try {
    // Convert map to array for response
    const allUsers = Array.from(userDatabase.values());

    const allAnalytics = allUsers.map((user) => {
      const downloads = downloadDatabase.get(user.userId) || [];
      const totalDownloadSize = downloads.reduce(
        (sum, d) => sum + (d.fileSize || 0),
        0,
      );

      return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        niche: user.niche,
        followers: user.followerCount,
        totalDownloads: downloads.length,
        totalDownloadSize,
        createdAt: user.createdAt,
        engagementScore: calculateEngagementScore(user),
      };
    });

    // TODO: Connect to Supabase for admin dashboard
    // const { data } = await supabase
    //   .from('user_quiz_data')
    //   .select('*')
    //   .order('created_at', { ascending: false });

    console.log(`✅ Retrieved analytics for ${allAnalytics.length} users`);

    return res.json({
      success: true,
      totalUsers: allAnalytics.length,
      users: allAnalytics,
    });
  } catch (error) {
    console.error("Error retrieving all users analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user analytics",
    });
  }
};
