import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Validate Supabase credentials
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error(
    "❌ Missing Supabase environment variables: SUPABASE_URL and/or SUPABASE_ANON_KEY",
  );
  console.error(
    "⚠️  Payment functionality will not work without these credentials.",
  );
}

// Supabase connection
let supabase = null;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );
    console.log("✅ Supabase connected successfully");
  }
} catch (error) {
  console.error("❌ Failed to initialize Supabase:", error);
}

// PayU Config
const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = "https://test.payu.in"; // use test endpoint

// Generate PayU payment hash
function generateHash(data) {
  const string = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
  return crypto.createHash("sha512").update(string).digest("hex");
}

// Create Payment Request
app.post("/api/payment", async (req, res) => {
  const { txnid, amount, firstname, email, productinfo } = req.body;

  const paymentData = {
    key: PAYU_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    surl: "https://famechase.com/api/payment/success",
    furl: "https://famechase.com/api/payment/failure",
  };

  paymentData.hash = generateHash(paymentData);

  return res.json({
    url: `${PAYU_BASE_URL}/_payment`,
    params: paymentData,
  });
});

// Success Webhook
app.post("/api/payment/success", async (req, res) => {
  const payment = req.body;

  // Save to Supabase with error handling
  if (supabase) {
    try {
      const { error } = await supabase.from("payments").insert([
        {
          txnid: payment.txnid,
          amount: payment.amount,
          email: payment.email,
          status: "success",
        },
      ]);

      if (error) {
        console.error("❌ Supabase payment success insert error:", error);
        return res.status(500).json({
          error: "Failed to record payment",
          details: error.message,
        });
      }
      console.log("✅ Payment success recorded:", payment.txnid);
    } catch (error) {
      console.error(
        "❌ Error recording payment success:",
        error instanceof Error ? error.message : String(error),
      );
      return res
        .status(500)
        .json({ error: "Failed to record payment success" });
    }
  } else {
    console.warn("⚠️ Supabase not configured, cannot record payment success");
  }

  return res.json({ status: "success", message: "Payment recorded" });
});

// Failure Webhook
app.post("/api/payment/failure", async (req, res) => {
  const payment = req.body;

  if (supabase) {
    try {
      const { error } = await supabase.from("payments").insert([
        {
          txnid: payment.txnid,
          amount: payment.amount,
          email: payment.email,
          status: "failure",
        },
      ]);

      if (error) {
        console.error("❌ Supabase payment failure insert error:", error);
        return res.status(500).json({
          error: "Failed to record payment failure",
          details: error.message,
        });
      }
      console.log("✅ Payment failure recorded:", payment.txnid);
    } catch (error) {
      console.error(
        "❌ Error recording payment failure:",
        error instanceof Error ? error.message : String(error),
      );
      return res
        .status(500)
        .json({ error: "Failed to record payment failure" });
    }
  } else {
    console.warn("⚠️ Supabase not configured, cannot record payment failure");
  }

  return res.json({ status: "failure", message: "Payment failure recorded" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
