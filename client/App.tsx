import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import QuizStart from "./pages/QuizStart";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import ShopNew from "./pages/ShopNew";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminAnalytics from "./pages/AdminAnalytics";
import TestSupabase from "./pages/TestSupabase";
import UserLogin from "./pages/UserLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const TrafficTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const geoRes = await fetch("https://ipapi.co/json/").catch(() => null);
        const geoData = geoRes ? await geoRes.json() : null;

        await fetch("/api/track-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: location.pathname,
            referrer: document.referrer,
            location: geoData ? {
              city: geoData.city,
              region: geoData.region,
              country: geoData.country_name
            } : null
          }),
        });
      } catch (err) {
        console.warn("Traffic tracking failed", err);
      }
    };

    if (!location.pathname.startsWith("/admin")) {
      trackVisit();
    }
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrafficTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/start-your-influencer-journey"
            element={<QuizStart />}
          />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/shop" element={<ShopNew />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/test-supabase" element={<TestSupabase />} />
          <Route path="/login" element={<UserLogin />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Ensure createRoot is only called once
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
