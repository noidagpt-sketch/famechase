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
} from "lucide-react";
import { supabase, dbHelpers, User, Product, Purchase } from "../lib/supabase";
import { paymentHelpers, PayUPaymentData, PAYU_CONFIG } from "../lib/payu";
import SupabaseConfigBanner from "../components/SupabaseConfigBanner";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export default function Shop() {
  const [language, setLanguage] = useState<"english" | "hindi">(() => {
    const savedLanguage = localStorage.getItem("famechase-language");
    return (savedLanguage as "english" | "hindi") || "english";
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [showQuizRequiredPopup, setShowQuizRequiredPopup] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [supabaseOnline, setSupabaseOnline] = useState<boolean>(!!supabase);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);

  // Load data on component mount
  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      setLoading(true);

      // Load quiz data from localStorage
      const storedQuizData = localStorage.getItem("fameChaseQuizData");
      if (storedQuizData) {
        const data = JSON.parse(storedQuizData);
        setQuizData(data);
        setLanguage(data.language || "english");

        // Pre-fill customer info from quiz data
        setCustomerInfo({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
        });
      }

      // Check if Supabase is configured and reachable
      if (supabase) {
        let canUseSupabase = true;
        try {
          const { data: auth } = await supabase.auth.getUser();
          const authUser = auth?.user || null;

          if (authUser && storedQuizData) {
            const userData = JSON.parse(storedQuizData);

            const { data: existingUser } = await dbHelpers.getUser(authUser.id);
            if (!existingUser) {
              await dbHelpers.createUser({
                id: authUser.id,
                name: userData.name,
                email: userData.email || authUser.email,
                phone: userData.phone,
                city: userData.city,
                niche: userData.niche,
                primary_platform: userData.primaryPlatform,
                follower_count: userData.followerCount,
                goals: userData.goals,
                quiz_data: userData,
              });
            }

            setUser(existingUser || userData);

            const { data: purchases } = await dbHelpers.getUserPurchases(
              authUser.id,
            );
            setUserPurchases(purchases || []);
          }
        } catch (e) {
          console.warn("Supabase fetch failed; switching to local mode", e);
          canUseSupabase = false;
        }
        setSupabaseOnline(canUseSupabase);

        if (!canUseSupabase) {
          const stored = localStorage.getItem("purchasedProducts");
          if (stored) {
            const localPurchases = JSON.parse(stored);
            setUserPurchases(localPurchases);
          }
        }
      } else {
        // Fallback to localStorage when Supabase is not configured
        const stored = localStorage.getItem("purchasedProducts");
        if (stored) {
          const localPurchases = JSON.parse(stored);
          setUserPurchases(localPurchases);
        }
      }

      // Load products (this will use mock data if Supabase is not configured)
      const { data: productsData } = await dbHelpers.getProducts();
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error initializing component:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save language preference
  useEffect(() => {
    localStorage.setItem("famechase-language", language);
  }, [language]);

  const checkQuizCompletion = () => {
    const storedQuizData = localStorage.getItem("fameChaseQuizData");
    if (!storedQuizData) return false;

    try {
      const data = JSON.parse(storedQuizData);
      return !!(
        data.name &&
        data.niche &&
        data.primaryPlatform &&
        data.followerCount &&
        data.goals
      );
    } catch {
      return false;
    }
  };

  const handleBuyClick = (productId: string) => {
    if (!checkQuizCompletion()) {
      setShowQuizRequiredPopup(true);
      return;
    }
    setShowPaymentForm(productId);
  };

  const validatePromoCode = (code: string) => {
    const validCodes = {
      CREATOR20: 20,
      LAUNCH50: 50,
      FIRST25: 25,
      SAVE30: 30,
      WELCOME15: 15,
      SPECIAL40: 40,
    };

    const upperCode = code.toUpperCase();
    if (validCodes[upperCode]) {
      setAppliedDiscount(validCodes[upperCode]);
      return true;
    }
    setAppliedDiscount(0);
    return false;
  };

  const applyPromoCode = () => {
    if (validatePromoCode(promoCode)) {
      // Code is valid, discount already applied
    } else {
      alert(language === "hindi" ? "अमान्य प्रोमो कोड" : "Invalid promo code");
    }
  };

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (appliedDiscount > 0) {
      return Math.round(originalPrice * (1 - appliedDiscount / 100));
    }
    return originalPrice;
  };

  const handlePurchase = async (productId: string) => {
    setIsSubmitting(true);

    try {
      const product = products.find((p) => p.id === productId);
      if (!product) throw new Error("Product not found");

      const finalAmount = calculateDiscountedPrice(product.price);

      if (supabase && supabaseOnline) {
        // Create PayU payment directly without Edge Functions
        const { paymentHelpers } = await import("../lib/payu");

        // Generate transaction ID
        const txnid =
          `FAMECHASE_${Date.now()}_${Math.random().toString(36).substring(2)}`.toUpperCase();

        // First, ensure user data is saved to Supabase
        let userId = null;
        if (quizData) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .upsert(
              [
                {
                  name: customerInfo.name,
                  email: customerInfo.email,
                  phone: customerInfo.phone,
                  city: customerInfo.city,
                  niche: quizData.niche,
                  primary_platform: quizData.primaryPlatform,
                  follower_count: quizData.followerCount,
                  goals: quizData.goals,
                  quiz_data: quizData,
                },
              ],
              {
                onConflict: "email",
                ignoreDuplicates: false,
              },
            )
            .select()
            .single();

          if (userData) userId = userData.id;
        }

        // Save purchase to Supabase
        const { data: purchaseData, error: purchaseError } = await supabase
          .from("purchases")
          .insert([
            {
              user_id: userId,
              product_id: productId,
              amount: finalAmount,
              discount_amount: product.price - finalAmount,
              promo_code: promoCode || null,
              payment_id: txnid,
              payment_status: "pending",
              payment_method: "payu",
              customer_info: customerInfo,
            },
          ])
          .select()
          .single();

        if (purchaseError) {
          console.error("Purchase creation error:", purchaseError);
          throw new Error("Failed to create purchase record");
        }

        // Create PayU payment data
        const paymentData = {
          txnid: txnid,
          amount: finalAmount,
          productinfo: product.name,
          firstname: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          surl: `${window.location.origin}/payment-success`,
          furl: `${window.location.origin}/payment-failure`,
          udf1: purchaseData.id, // Purchase ID
          udf2: productId, // Product ID
          udf3: finalAmount.toString(), // Amount
          udf4: "",
          udf5: "",
        };

        // Generate hash using PayU helper
        const { generatePayUHash } = await import("../lib/payu");
        const hash = generatePayUHash(paymentData);

        // Redirect to PayU payment gateway
        const form = document.createElement("form");
        form.method = "POST";
        form.action = PAYU_CONFIG.baseUrl;

        // PayU required fields
        const payuFields = {
          key: PAYU_CONFIG.merchantKey,
          txnid: paymentData.txnid,
          amount: paymentData.amount.toString(),
          productinfo: paymentData.productinfo,
          firstname: paymentData.firstname,
          email: paymentData.email,
          phone: paymentData.phone,
          surl: paymentData.surl,
          furl: paymentData.furl,
          udf1: paymentData.udf1,
          udf2: paymentData.udf2,
          udf3: paymentData.udf3,
          udf4: paymentData.udf4,
          udf5: paymentData.udf5,
          hash: hash,
        };

        Object.entries(payuFields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // Fallback to localStorage simulation when Supabase is not configured
        console.log("Supabase not configured, simulating payment...");

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Save purchase to localStorage
        const purchase = {
          id: productId,
          purchaseDate: new Date().toISOString(),
          customerInfo: { ...customerInfo, ...quizData },
          amount: finalAmount,
          product_id: productId,
          payment_status: "success",
        };

        const stored = localStorage.getItem("purchasedProducts");
        const existingPurchases = stored ? JSON.parse(stored) : [];
        const updated = [...existingPurchases, purchase];

        localStorage.setItem("purchasedProducts", JSON.stringify(updated));
        setUserPurchases(updated);

        // Show success (you could redirect to a success page)
        alert("Payment successful! (Demo mode - Supabase not configured)");
        setShowPaymentForm(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProductPurchased = (productId: string) => {
    return (
      userPurchases.some(
        (p) =>
          (p.product_id || p.id) === productId &&
          (p.payment_status === "success" || !p.payment_status),
      ) ||
      (productId !== "complete-bundle" &&
        userPurchases.some(
          (p) =>
            (p.product_id || p.id) === "complete-bundle" &&
            (p.payment_status === "success" || !p.payment_status),
        ))
    );
  };

  const t = {
    english: {
      title: "Creator Tools & Resources",
      subtitle: "Professional tools to accelerate your creator journey",
      premiumTools: "Premium Creator Tools",
      bestseller: "BESTSELLER",
      trending: "TRENDING",
      downloads: "downloads",
      rating: "Rating",
      securePayment: "Secure payment",
      instantDownload: "Instant download",
      buyNow: "Buy Now",
      downloadFree: "Download Free",
      paymentForm: "Complete Your Information",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      city: "City",
      processing: "Processing...",
      paySecure: "Pay Securely",
      backToShop: "Back to Shop",
    },
    hindi: {
      title: "क्रिएटर टूल्स और सं��ाधन",
      subtitle: "आपकी क्रिएटर यात्रा को तेज़ करने के लिए प्रोफेशनल टूल्स",
      premiumTools: "प्रीमियम क्रिएटर टूल्स",
      bestseller: "बेस्टसेलर",
      trending: "ट्रेंडिंग",
      downloads: "डाउनलोड",
      rating: "रेटिंग",
      securePayment: "सुरक्षित भुगतान",
      instantDownload: "तुरंत डाउनलोड",
      buyNow: "अभी खरीदें",
      downloadFree: "फ्री डाउनलोड करें",
      paymentForm: "अपनी जानकारी पूरी करें",
      fullName: "पूरा नाम",
      emailAddress: "ईमेल पता",
      phoneNumber: "फोन नंबर",
      city: "शहर",
      processing: "प्रसंस्करण...",
      paySecure: "सुरक्षित भुगतान करें",
      backToShop: "शॉप पर वापस जाएं",
    },
  };

  const currentLang = t[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              FameChase<span className="text-neon-green">.com</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "english" | "hindi")
                }
                className="bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Value Proposition Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">
                {language === "hindi"
                  ? "प्रीमियम क्रिएटर टूल्स"
                  : "Premium Creator Tools"}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {language === "hindi"
                ? "5000+ क्रिएटर्स का भरोसा • सफलता गारंटी • तुरंत डाउनलोड"
                : "Trusted by 5000+ creators • Success guaranteed • Instant download"}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Configuration Banner */}
        <SupabaseConfigBanner />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {currentLang.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentLang.subtitle}
          </p>
        </div>

        {/* Premium Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentLang.premiumTools}
          </h2>

          <div className="grid gap-8">
            {products.map((product) => {
              const isPurchased = isProductPurchased(product.id);

              return (
                <div
                  key={product.id}
                  className={`border-2 rounded-2xl p-8 relative overflow-hidden ${
                    product.category === "growth-kit"
                      ? "bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
                      : product.category === "course"
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                        : product.category === "masterclass"
                          ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
                          : "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                  }`}
                >
                  <div className="absolute top-4 right-4 space-y-2">
                    {product.category === "growth-kit" && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {currentLang.bestseller}
                      </div>
                    )}
                    {product.category === "course" && (
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {currentLang.trending}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">4.9</span>
                        </div>
                        <span className="text-gray-600">
                          2,547 {currentLang.downloads}
                        </span>
                        {isPurchased && (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            ✅ Purchased
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2 text-gray-700 mb-6">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Value Guarantee */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <Shield className="w-4 h-4" />
                          <span className="font-semibold">
                            {language === "hindi"
                              ? "100% संतुष्टि गारंटी"
                              : "100% Satisfaction Guarantee"}
                          </span>
                        </div>
                        <div className="text-green-600 text-xs mt-1">
                          {language === "hindi"
                            ? "तुरंत डाउनलोड • सफलता गारंटी"
                            : "Instant download • Success guarantee"}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-80">
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            ₹{product.price}
                          </div>
                          {product.original_price > product.price && (
                            <div className="text-lg text-gray-500 line-through">
                              ₹{product.original_price}
                            </div>
                          )}
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                            {Math.round(
                              ((product.original_price - product.price) /
                                product.original_price) *
                                100,
                            )}
                            % OFF
                          </div>

                          {isPurchased ? (
                            <Link
                              to="/downloads"
                              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-all mb-4 inline-block text-center"
                            >
                              <Download className="w-4 h-4 inline mr-2" />
                              Download Products
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleBuyClick(product.id)}
                              className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all mb-4"
                            >
                              {currentLang.buyNow} - ₹{product.price}
                            </button>
                          )}

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-center gap-2">
                              <Shield className="w-4 h-4" />
                              {currentLang.securePayment}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <Download className="w-4 h-4" />
                              {currentLang.instantDownload}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Quiz Required Popup */}
      {showQuizRequiredPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "hindi"
                ? "❌ पहले अपनी ��्रोफाइल बनाएं!"
                : "❌ Complete Your Profile First!"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "hindi"
                ? "प्रीमियम टूल्स को खरीदने से पहले आपको अपनी क्रिएटर प्रोफाइल बनानी होगी। यह केवल 2 मिनट में हो जाएगा!"
                : "Before purchasing premium tools, you need to complete your creator profile. It takes only 2 minutes!"}
            </p>
            <div className="space-y-3">
              <Link
                to="/quiz"
                className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all inline-block"
              >
                {language === "hindi"
                  ? "🎯 अभी प्रोफाइल बनाएं"
                  : "🎯 Create Profile Now"}
              </Link>
              <button
                onClick={() => setShowQuizRequiredPopup(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                {language === "hindi" ? "बाद में" : "Later"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentLang.paymentForm}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.fullName}
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.emailAddress}
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.phoneNumber}
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.city}
                </label>
                <input
                  type="text"
                  value={customerInfo.city}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  placeholder="Mumbai"
                />
              </div>

              {/* Promo Code Section */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "hindi"
                    ? "प्रोमो कोड (वैकल्पिक)"
                    : "Promo Code (Optional)"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                    placeholder={
                      language === "hindi" ? "कोड दर्ज करें" : "Enter code"
                    }
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {language === "hindi" ? "लागू करें" : "Apply"}
                  </button>
                </div>
                {appliedDiscount > 0 && (
                  <div className="mt-2 text-green-600 text-sm font-medium">
                    ✅ {appliedDiscount}%{" "}
                    {language === "hindi"
                      ? "छूट लागू की गई!"
                      : "discount applied!"}
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            {showPaymentForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "hindi" ? "मूल कीमत:" : "Original Price:"}
                  </span>
                  <span className="text-gray-900">
                    ₹{products.find((p) => p.id === showPaymentForm)?.price}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>
                      {language === "hindi" ? "छूट:" : "Discount:"} (
                      {appliedDiscount}%)
                    </span>
                    <span>
                      -₹
                      {(products.find((p) => p.id === showPaymentForm)?.price ||
                        0) -
                        calculateDiscountedPrice(
                          products.find((p) => p.id === showPaymentForm)
                            ?.price || 0,
                        )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                  <span className="text-gray-900">
                    {language === "hindi" ? "कुल राशि:" : "Total Amount:"}
                  </span>
                  <span className="text-blue-600">
                    ₹
                    {calculateDiscountedPrice(
                      products.find((p) => p.id === showPaymentForm)?.price ||
                        0,
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentForm(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchase(showPaymentForm)}
                disabled={
                  isSubmitting ||
                  !customerInfo.name ||
                  !customerInfo.email ||
                  !customerInfo.phone
                }
                className="flex-1 bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    {currentLang.processing}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    {currentLang.paySecure}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 FameChase.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
