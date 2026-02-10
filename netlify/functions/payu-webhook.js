const handler = async (event) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    // Log the incoming payload
    console.log("Received payload:", JSON.stringify(event.body));

    // Store in Supabase if env vars are set
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        "⚠️  Supabase credentials not configured: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY missing",
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "OK - Supabase not configured",
          warning: "Payment webhook received but not stored",
        }),
      };
    }

    // Parse event body
    const paymentData =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    // Attempt to save to purchases table with timeout
    let saved = false;
    try {
      const fetchTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Fetch timeout")), 10000),
      );

      const fetchPromise = fetch(`${SUPABASE_URL}/rest/v1/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          txnid: paymentData.txnid || paymentData.id,
          amount: paymentData.amount || paymentData.price,
          email: paymentData.email,
          status: paymentData.status || "pending",
          payment_method: "payu",
          payu_response: paymentData,
        }),
      });

      const response = await Promise.race([fetchPromise, fetchTimeout]);

      if (response.ok || response.status === 201) {
        console.log("✅ Payment saved to purchases table");
        saved = true;
      } else if (response.status === 409) {
        // Duplicate - already exists
        console.log("ℹ️  Payment already recorded (duplicate webhook)");
        saved = true;
      } else {
        const errorText = await response.text();
        console.error("❌ Purchases table insert failed:", {
          status: response.status,
          error: errorText,
        });
      }
    } catch (purchaseError) {
      console.error("❌ Error inserting into purchases:", purchaseError);
    }

    // Fallback: Try alternative tables if purchases failed
    if (!saved) {
      try {
        const tables = ["orders", "payments", "transactions"];

        for (const table of tables) {
          try {
            const fetchTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Fetch timeout")), 5000),
            );

            const fetchPromise = fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                Prefer: "return=minimal",
              },
              body: JSON.stringify({
                txnid: paymentData.txnid || paymentData.id,
                amount: paymentData.amount || paymentData.price,
                email: paymentData.email,
                status: paymentData.status || "pending",
                payment_method: "payu",
              }),
            });

            const response = await Promise.race([fetchPromise, fetchTimeout]);

            if (response.ok || response.status === 201) {
              console.log(`✅ Payment saved to ${table} table (fallback)`);
              saved = true;
              break;
            }
          } catch (error) {
            console.error(`Failed to save to ${table}:`, error);
            continue;
          }
        }
      } catch (fallbackError) {
        console.error("❌ All fallback tables failed:", fallbackError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "OK",
        stored: saved,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
