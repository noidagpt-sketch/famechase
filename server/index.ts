import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import { handleAIAgentAnalysis } from "./routes/ai-agent-analysis.js";
import {
  handleCaptureQuizData,
  handleCaptureDownload,
  handleGetUserAnalytics,
  handleGetAllUsersAnalytics,
  handleSavePurchase,
  handleSaveSubmission,
  handleGetAdminPurchases,
  handleGetAdminDownloads,
  handleTrackVisit,
  handleGetTrafficAnalytics,
  handleGetProductSettings,
  handleUpdateProductSettings,
  handleDeleteProduct,
} from "./routes/user-analytics.js";
import {
  handleSignup,
  handleLogin,
  handleAdminLogin,
  handleGetMe,
} from "./routes/auth.js";
import { authMiddleware, adminMiddleware } from "./middleware/auth.js";
import { initializeDatabase } from "./db-init.js";

export function createServer() {
  const app = express();

  app.set("trust proxy", true);
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "FameChase API is running!" });
  });

  app.get("/api/demo", handleDemo);

  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/admin-login", handleAdminLogin);
  app.get("/api/auth/me", authMiddleware, handleGetMe);

  app.post("/api/ai-agent-analysis", handleAIAgentAnalysis);

  app.post("/api/user-analytics/quiz", handleCaptureQuizData);
  app.post("/api/user-analytics/download", handleCaptureDownload);
  app.post("/api/user-analytics/purchase", handleSavePurchase);
  app.post("/api/user-analytics/submission", handleSaveSubmission);
  app.get("/api/user-analytics/:userId", handleGetUserAnalytics);

  app.get("/api/admin/users", authMiddleware, adminMiddleware, handleGetAllUsersAnalytics);
  app.get("/api/admin/purchases", authMiddleware, adminMiddleware, handleGetAdminPurchases);
  app.get("/api/admin/downloads", authMiddleware, adminMiddleware, handleGetAdminDownloads);
  app.get("/api/admin/traffic", authMiddleware, adminMiddleware, handleGetTrafficAnalytics);
  app.get("/api/admin/product-settings", authMiddleware, adminMiddleware, handleGetProductSettings);
  app.post("/api/admin/product-settings", authMiddleware, adminMiddleware, handleUpdateProductSettings);
  app.delete("/api/admin/product-settings", authMiddleware, adminMiddleware, handleDeleteProduct);
  app.get("/api/product-settings", handleGetProductSettings);
  app.post("/api/track-visit", handleTrackVisit);

  initializeDatabase().catch((err) => {
    console.error("Database initialization failed:", err);
  });

  return app;
}
