import { RequestHandler } from "express";
import { query } from "../db.js";

export const handleCaptureQuizData: RequestHandler = async (req, res) => {
  try {
    const { quizData } = req.body;

    if (!quizData || !quizData.email || !quizData.name) {
      return res.status(400).json({
        success: false,
        userId: "unknown",
        message: "Missing required fields: email, name",
      });
    }

    const result = await query(
      `INSERT INTO quiz_data (
        guest_email, name, email, phone, age, city,
        primary_platform, secondary_platforms, follower_count,
        engagement_rate, niche, content_type, posting_frequency,
        experience, monthly_income, biggest_challenge, goals,
        social_links, bio, language, analysis_data
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
      RETURNING id`,
      [
        quizData.email,
        quizData.name,
        quizData.email,
        quizData.phone || null,
        quizData.age || null,
        quizData.city || null,
        quizData.primaryPlatform || null,
        quizData.secondaryPlatforms || [],
        String(quizData.followerCount || ""),
        String(quizData.engagementRate || ""),
        quizData.niche || null,
        quizData.contentType || null,
        quizData.postingFrequency || null,
        quizData.experience || [],
        quizData.monthlyIncome || null,
        quizData.biggestChallenge || [],
        quizData.goals || [],
        JSON.stringify(quizData.socialLinks || {}),
        quizData.bio || null,
        quizData.language || "english",
        quizData.analysisData ? JSON.stringify(quizData.analysisData) : null,
      ]
    );

    await query(
      `INSERT INTO submissions (guest_email, form_type, form_data, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        quizData.email,
        "quiz",
        JSON.stringify(quizData),
        req.ip || req.socket.remoteAddress,
        req.get("user-agent") || null,
      ]
    );

    console.log(`Quiz data saved to DB for: ${quizData.email}`);

    return res.json({
      success: true,
      userId: `quiz_${result.rows[0].id}`,
      message: "Quiz data captured successfully",
    });
  } catch (error) {
    console.error("Error capturing quiz data:", error);
    return res.status(500).json({
      success: false,
      userId: "unknown",
      message: "Failed to capture quiz data",
    });
  }
};

export const handleCaptureDownload: RequestHandler = async (req, res) => {
  try {
    const { userId, downloadType, fileName, productId } = req.body;

    if (!downloadType || !fileName) {
      return res.status(400).json({
        success: false,
        downloadId: "unknown",
        message: "Missing required fields: downloadType, fileName",
      });
    }

    const result = await query(
      `INSERT INTO downloads (guest_email, download_type, file_name, product_id, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        userId || null,
        downloadType,
        fileName,
        productId || null,
        JSON.stringify({ userAgent: req.get("user-agent"), downloadedAt: new Date().toISOString() }),
      ]
    );

    console.log(`Download tracked: ${fileName}`);

    return res.json({
      success: true,
      downloadId: `dl_${result.rows[0].id}`,
      message: "Download tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    return res.status(500).json({
      success: false,
      downloadId: "unknown",
      message: "Failed to track download",
    });
  }
};

export const handleGetUserAnalytics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const quizResult = await query(
      "SELECT * FROM quiz_data WHERE email = $1 OR guest_email = $1 ORDER BY created_at DESC LIMIT 5",
      [userId]
    );

    const downloadResult = await query(
      "SELECT * FROM downloads WHERE guest_email = $1 ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: `No data found for: ${userId}` });
    }

    return res.json({
      success: true,
      analytics: {
        userId,
        totalQuizzes: quizResult.rows.length,
        totalDownloads: downloadResult.rows.length,
        quizHistory: quizResult.rows,
        downloadHistory: downloadResult.rows,
      },
      message: "User analytics retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user analytics:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve user analytics" });
  }
};

function detectBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests',
    'http-client', 'java/', 'go-http-client', 'node-fetch', 'axios',
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'duckduckbot',
    'slurp', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
    'whatsapp', 'telegrambot', 'discordbot', 'applebot', 'semrushbot',
    'ahrefsbot', 'mj12bot', 'dotbot', 'petalbot', 'bytespider',
    'gptbot', 'claudebot', 'ccbot', 'chatgpt', 'headlesschrome',
    'phantomjs', 'selenium', 'puppeteer', 'playwright',
    'uptimerobot', 'pingdom', 'statuspage', 'monitor',
  ];
  return botPatterns.some(pattern => ua.includes(pattern));
}

export const handleTrackVisit: RequestHandler = async (req, res) => {
  try {
    const { path, referrer, location } = req.body;
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get("user-agent") || null;
    const isBot = detectBot(userAgent ?? undefined);

    await query(
      `INSERT INTO traffic_log (ip_address, city, region, country, user_agent, path, referrer, is_bot)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        ip,
        location?.city || null,
        location?.region || null,
        location?.country || null,
        userAgent,
        path || "/",
        referrer || null,
        isBot,
      ]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return res.status(500).json({ success: false });
  }
};

export const handleGetTrafficAnalytics: RequestHandler = async (_req, res) => {
  try {
    const result = await query(`
      SELECT * FROM traffic_log
      ORDER BY created_at DESC
      LIMIT 1000
    `);
    return res.json({ success: true, traffic: result.rows });
  } catch (error) {
    console.error("Error getting traffic analytics:", error);
    return res.status(500).json({ success: false });
  }
};

export const handleGetAllUsersAnalytics: RequestHandler = async (req, res) => {
  try {
    const usersResult = await query(`
      SELECT
        q.id, q.name, q.email, q.phone, q.age, q.city, q.niche,
        q.primary_platform, q.secondary_platforms, q.follower_count, q.engagement_rate,
        q.content_type, q.posting_frequency, q.experience,
        q.monthly_income, q.biggest_challenge, q.goals, q.bio, q.language,
        q.created_at,
        (SELECT COUNT(*) FROM downloads d WHERE d.guest_email = q.email) as total_downloads
      FROM quiz_data q
      ORDER BY q.created_at DESC
      LIMIT 500
    `);

    const statsResult = await query(`
      SELECT
        (SELECT COUNT(*) FROM quiz_data) as total_quizzes,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM downloads) as total_downloads,
        (SELECT COUNT(*) FROM purchases) as total_purchases,
        (SELECT COALESCE(SUM(amount), 0) FROM purchases WHERE payment_status = 'success') as total_revenue,
        (SELECT COUNT(*) FROM purchases WHERE payment_status = 'success') as successful_payments
    `);

    const stats = statsResult.rows[0];

    return res.json({
      success: true,
      totalUsers: parseInt(stats.total_quizzes) || 0,
      totalRegisteredUsers: parseInt(stats.total_users) || 0,
      totalDownloads: parseInt(stats.total_downloads) || 0,
      totalPurchases: parseInt(stats.total_purchases) || 0,
      totalRevenue: parseFloat(stats.total_revenue) || 0,
      successfulPayments: parseInt(stats.successful_payments) || 0,
      users: usersResult.rows.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        age: u.age,
        city: u.city,
        niche: u.niche,
        primary_platform: u.primary_platform,
        secondary_platforms: u.secondary_platforms,
        follower_count: u.follower_count,
        engagement_rate: u.engagement_rate,
        content_type: u.content_type,
        posting_frequency: u.posting_frequency,
        experience: u.experience,
        monthly_income: u.monthly_income,
        biggest_challenge: u.biggest_challenge,
        goals: u.goals,
        bio: u.bio,
        language: u.language,
        totalDownloads: parseInt(u.total_downloads) || 0,
        created_at: u.created_at,
      })),
    });
  } catch (error) {
    console.error("Error retrieving all users analytics:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve user analytics" });
  }
};

export const handleSavePurchase: RequestHandler = async (req, res) => {
  try {
    const {
      productId, productName, amount, paymentStatus,
      paymentId, paymentMethod, customerName, customerEmail,
      customerPhone, customerCity, metadata,
    } = req.body;

    if (!productId || !amount || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: productId, amount, customerEmail",
      });
    }

    const result = await query(
      `INSERT INTO purchases (
        guest_email, product_id, product_name, amount, payment_status,
        payment_id, payment_method, customer_name, customer_email,
        customer_phone, customer_city, metadata
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id`,
      [
        customerEmail,
        productId,
        productName || null,
        amount,
        paymentStatus || "pending",
        paymentId || null,
        paymentMethod || null,
        customerName || null,
        customerEmail,
        customerPhone || null,
        customerCity || null,
        metadata ? JSON.stringify(metadata) : "{}",
      ]
    );

    await query(
      `INSERT INTO submissions (guest_email, form_type, form_data, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        customerEmail,
        "purchase",
        JSON.stringify(req.body),
        req.ip || req.socket.remoteAddress,
        req.get("user-agent") || null,
      ]
    );

    return res.json({
      success: true,
      purchaseId: result.rows[0].id,
      message: "Purchase recorded successfully",
    });
  } catch (error) {
    console.error("Error saving purchase:", error);
    return res.status(500).json({ success: false, message: "Failed to record purchase" });
  }
};

export const handleSaveSubmission: RequestHandler = async (req, res) => {
  try {
    const { formType, formData, email } = req.body;

    if (!formType || !formData) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: formType, formData",
      });
    }

    const result = await query(
      `INSERT INTO submissions (guest_email, form_type, form_data, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        email || null,
        formType,
        JSON.stringify(formData),
        req.ip || req.socket.remoteAddress,
        req.get("user-agent") || null,
      ]
    );

    return res.json({
      success: true,
      submissionId: result.rows[0].id,
      message: "Submission saved successfully",
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    return res.status(500).json({ success: false, message: "Failed to save submission" });
  }
};

export const handleGetAdminPurchases: RequestHandler = async (_req, res) => {
  try {
    const result = await query(`
      SELECT id, product_id, product_name, amount, payment_status,
             payment_id, customer_name, customer_email, customer_phone,
             customer_city, created_at
      FROM purchases
      ORDER BY created_at DESC
      LIMIT 500
    `);

    return res.json({ success: true, purchases: result.rows });
  } catch (error) {
    console.error("Error getting purchases:", error);
    return res.status(500).json({ success: false, message: "Failed to get purchases" });
  }
};

export const handleGetProductSettings: RequestHandler = async (_req, res) => {
  try {
    const result = await query(`
      SELECT product_id, is_visible FROM product_settings
    `);
    const settings: Record<string, boolean> = {};
    result.rows.forEach((r: any) => {
      settings[r.product_id] = r.is_visible;
    });
    return res.json({ success: true, settings });
  } catch {
    return res.json({ success: true, settings: {} });
  }
};

export const handleUpdateProductVisibility: RequestHandler = async (req, res) => {
  try {
    const { productId, isVisible } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Missing productId" });
    }

    await query(`
      INSERT INTO product_settings (product_id, is_visible)
      VALUES ($1, $2)
      ON CONFLICT (product_id) DO UPDATE SET is_visible = $2, updated_at = NOW()
    `, [productId, isVisible !== false]);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    return res.status(500).json({ success: false });
  }
};

export const handleGetAdminDownloads: RequestHandler = async (_req, res) => {
  try {
    const result = await query(`
      SELECT d.id, d.guest_email, d.download_type, d.file_name, d.product_id, d.created_at,
             q.name as user_name, q.phone as user_phone, q.city as user_city,
             q.niche as user_niche, q.primary_platform as user_platform,
             q.follower_count as user_followers
      FROM downloads d
      LEFT JOIN quiz_data q ON d.guest_email = q.email
      ORDER BY d.created_at DESC
      LIMIT 500
    `);

    return res.json({ success: true, downloads: result.rows });
  } catch (error) {
    console.error("Error getting downloads:", error);
    return res.status(500).json({ success: false, message: "Failed to get downloads" });
  }
};
