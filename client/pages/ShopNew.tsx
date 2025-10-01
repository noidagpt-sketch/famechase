import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Download,
  CheckCircle,
  CreditCard,
  Shield,
  Zap,
  Award,
  Home,
  Target,
  Loader2,
  ExternalLink
} from "lucide-react";
import { supabase, dbHelpers, User, Product, Purchase } from "../lib/supabase";
import { paymentHelpers, PayUPaymentData, PAYU_CONFIG } from "../lib/payu";
import { sanitizeDeep } from "@/lib/sanitize";
import SupabaseConfigBanner from "../components/SupabaseConfigBanner";

// ...[rest of the file remains unchanged until product card button block]...
// In the product card, replace the Buy Now block (around line 625):
{!isPurchased && (
  <>
    <button
      onClick={() => handleBuyClick(product.id)}
      className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all mb-2"
    >
      {currentLang.buyNow} - ₹{product.price}
    </button>
    <a
      href="https://www.instamojo.com/@famechase"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all mb-2"
      style={{ textAlign: "center", display: "inline-block" }}
    >
      <ExternalLink className="w-4 h-4 inline" />
      Pay with Instamojo
    </a>
    <div className="text-xs text-gray-600 mb-4 text-center">
      After paying with Instamojo, please return to this page and click ‘Download’ to access your product.
    </div>
  </>
)}
// ...[rest of the file remains unchanged until payment modal button block]...
// In the payment modal (add above the Cancel/Pay buttons, around line 835):
<div className="flex flex-col gap-2 mb-4">
  <a
    href="https://www.instamojo.com/@famechase"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all"
    style={{ textAlign: "center", display: "inline-block" }}
  >
    <ExternalLink className="w-4 h-4 inline" />
    Pay with Instamojo
  </a>
  <div className="text-xs text-gray-600 text-center">
    After paying, come back and click ‘Download’ to get your files.
  </div>
</div>
// ...[rest of the file remains unchanged]...