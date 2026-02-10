import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CheckCircle,
  CreditCard,
  Download,
  ExternalLink,
  Home,
  Loader2,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import {
  getAllProducts,
  getProductConfig,
  generateProductDownload,
  downloadFile,
  type ProductConfig,
  productConfigs,
} from "../lib/products";
import { supabase, dbHelpers, isSupabaseConfigured } from "@/lib/supabase";
import { sanitizeDeep } from "@/lib/sanitize";
import SupabaseConfigBanner from "../components/SupabaseConfigBanner";

interface PurchasedProduct {
  id: string;
  purchaseDate: string;
  customerInfo: unknown;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  city: string;
}

function ShopNew() {
  const [language, setLanguage] = useState<"english" | "hindi">(() => {
    const savedLanguage = localStorage.getItem("famechase-language");
    return (savedLanguage as "english" | "hindi") || "english";
  });
  const [products, setProducts] = useState<ProductConfig[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [showQuizRequiredPopup, setShowQuizRequiredPopup] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(86400);
  const [recentPurchases, setRecentPurchases] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [showSuccessPage, setShowSuccessPage] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    setProducts(getAllProducts());
    const storedPurchases = localStorage.getItem("purchasedProducts");
    if (storedPurchases) {
      setPurchasedProducts(JSON.parse(storedPurchases));
    }
    const storedQuizData = localStorage.getItem("fameChaseQuizData");
    if (storedQuizData) {
      const data = JSON.parse(storedQuizData);
      setQuizData(data);
      if (data.language) {
        setLanguage(data.language);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("famechase-language", language);
  }, [language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const names = [
      "Rahul from Mumbai",
      "Priya from Delhi",
      "Arjun from Bengaluru",
      "Sneha from Pune",
      "Vikash from Hyderabad",
      "Anita from Chennai",
      "Rohit from Kolkata",
      "Kavya from Ahmedabad",
      "Amit from Jaipur",
    ];

    const addRecentPurchase = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setRecentPurchases((prev) => [randomName, ...prev.slice(0, 4)]);
    };

    addRecentPurchase();
    const interval = setInterval(
      () => {
        if (Math.random() > 0.3) {
          addRecentPurchase();
        }
      },
      Math.random() * 15000 + 15000,
    );

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const checkQuizCompletion = () => {
    const storedQuizData = localStorage.getItem("fameChaseQuizData");
    if (!storedQuizData) {
      return false;
    }

    try {
      const data = JSON.parse(storedQuizData);
      return Boolean(
        data.name &&
          data.niche &&
          data.primaryPlatform &&
          data.followerCount &&
          data.goals,
      );
    } catch (error) {
      console.warn("Unable to parse quiz data", error);
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
    const validCodes: Record<string, number> = {
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
    if (!validatePromoCode(promoCode)) {
      alert(language === "hindi" ? "अमान्य प्रोमो कोड" : "Invalid promo code");
    }
  };

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (appliedDiscount > 0) {
      return Math.round(originalPrice * (1 - appliedDiscount / 100));
    }
    return originalPrice;
  };

  const translations = {
    english: {
      title: "Creator Tools & Resources",
      subtitle: "Professional tools to accelerate your creator journey",
      premiumTools: "Premium Creator Tools",
      bestseller: "BESTSELLER",
      trending: "TRENDING",
      expertGuide: "Expert Guide",
      offerEnds: "Offer ends in",
      downloads: "downloads",
      rating: "Rating",
      securePayment: "Secure payment",
      instantDownload: "Instant download",
      buyNow: "Buy Now",
      downloadFree: "Download Free",
      bundleOffer: "LIMITED TIME BUNDLE OFFER 🔥",
      save: "Save",
      getBundle: "Get Complete Bundle",
      validFor: "Offer valid for next 24 hours only",
      paymentForm: "Complete Your Information",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      city: "City",
      processing: "Processing...",
      paySecure: "Pay Securely",
      downloadYourProducts: "Download Your Products",
      purchaseSuccess: "Purchase Successful! 🎉",
      thanksForPurchase:
        "Thank you for your purchase! Your products are ready for download.",
      backToShop: "Back to Shop",
      recentHeadline: "Creators who just grabbed their kit",
      instamojoNote:
        "After paying with Instamojo, please return and click ‘Download’ to access your product.",
      instamojoNoteShort:
        "After paying, come back and click ‘Download’ to get your files.",
    },
    hindi: {
      title: "क्रिएटर टूल्स और संसाधन",
      subtitle: "आपकी क्रिएटर यात्रा को तेज़ करने के लिए प्रोफेशनल टूल्स",
      premiumTools: "प्रीमियम क्रिएटर टूल्स",
      bestseller: "बेस्टसेलर",
      trending: "ट्रेंडिंग",
      expertGuide: "एक्सपर्ट गाइड",
      offerEnds: "ऑफर समाप्त होता है",
      downloads: "डाउनलोड",
      rating: "रेटिंग",
      securePayment: "सुरक्षित भुगतान",
      instantDownload: "तुरंत डाउनलोड",
      buyNow: "अभी खरीदें",
      downloadFree: "फ्री डाउनलोड करें",
      bundleOffer: "सीमित समय बंडल ऑफर 🔥",
      save: "बचत करें",
      getBundle: "कम्प्लीट बंडल प्राप्त करें",
      validFor: "ऑफर केवल अगले 24 घंटे के लिए मान्य",
      paymentForm: "अपनी जानकारी पूरी करें",
      fullName: "पूरा नाम",
      emailAddress: "ईमेल पता",
      phoneNumber: "फोन नंबर",
      city: "शहर",
      processing: "प्रसंस्करण...",
      paySecure: "सुरक्षित भुगतान करें",
      downloadYourProducts: "अपने प्रोडक्ट्स डाउनलोड करें",
      purchaseSuccess: "खरीदारी सफल! 🎉",
      thanksForPurchase:
        "आपकी खरीदारी के लिए धन्यवाद! आपके प्रोडक्ट्स डाउनलोड के लिए तैयार हैं।",
      backToShop: "शॉप पर वापस जाएं",
      recentHeadline: "अभी-अभी जिन्होंने अपना किट लिया",
      instamojoNote:
        "Instamojo से भुगतान करने के बाद यहाँ लौटें और ‘Download’ पर क्लिक करें।",
      instamojoNoteShort: "भुगतान के बाद वापस आकर ‘Download’ पर क्लिक करें।",
    },
  } as const;

  const currentLang = useMemo(
    () => sanitizeDeep(translations[language]),
    [language],
  );

  const handlePurchase = async (productId: string | null) => {
    if (!productId) {
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const purchase: PurchasedProduct = {
      id: productId,
      purchaseDate: new Date().toISOString(),
      customerInfo: { ...customerInfo, ...quizData },
    };

    const updated = [...purchasedProducts, purchase];
    setPurchasedProducts(updated);
    localStorage.setItem("purchasedProducts", JSON.stringify(updated));

    setIsSubmitting(false);
    setShowPaymentForm(null);
    setShowSuccessPage(productId);
  };

  const handleDownload = async (
    productId: string | null,
    downloadId: string,
  ) => {
    if (!productId) {
      return;
    }
    const content = generateProductDownload(
      productId,
      downloadId,
      language,
      quizData,
    );
    const product = getProductConfig(productId);
    const download = product?.downloads.find((item) => item.id === downloadId);

    if (content && download) {
      const localizedFileName = `${download.fileName}_${language}.pdf`;
      await downloadFile(content, localizedFileName);
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data } = await supabase.auth.getUser();
          const userId = data.user?.id;
          if (userId) {
            await dbHelpers.recordDownload({
              user_id: userId,
              product_id: productId,
              download_id: downloadId,
              downloaded_at: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.warn("Unable to record download", error);
      }
    }
  };

  const handleBundleDownload = () => {
    const bundleProducts = [
      "complete-growth-kit",
      "reels-mastery",
      "brand-masterclass",
      "youtube-mastery",
      "facebook-posting-mastery",
    ];

    bundleProducts.forEach((productId, index) => {
      const product = getProductConfig(productId);
      if (product) {
        product.downloads.forEach((download) => {
          setTimeout(
            () => {
              void handleDownload(productId, download.id);
            },
            (index + 1) * 300,
          );
        });
      }
    });
  };

  const isProductPurchased = (productId: string) => {
    return (
      purchasedProducts.some((purchase) => purchase.id === productId) ||
      (productId !== "complete-bundle" &&
        purchasedProducts.some((purchase) => purchase.id === "complete-bundle"))
    );
  };

  if (showSuccessPage) {
    const product = getProductConfig(showSuccessPage);
    if (!product) {
      return null;
    }

    return (
      <div className="min-h-screen bg-white">
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
                  onChange={(event) =>
                    setLanguage(event.target.value as "english" | "hindi")
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

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-green to-electric-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {currentLang.purchaseSuccess}
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {currentLang.thanksForPurchase}
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentLang.downloadYourProducts}
              </h2>

              {showSuccessPage === "complete-bundle" ? (
                <div className="grid gap-4 max-w-md mx-auto">
                  <button
                    onClick={handleBundleDownload}
                    className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Complete Bundle (All Products)
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.downloads.map((download) => (
                    <div
                      key={download.id}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-neon-green transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Download className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {download.name}
                      </h3>
                      <button
                        onClick={() =>
                          void handleDownload(showSuccessPage, download.id)
                        }
                        className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        {currentLang.downloadFree}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSuccessPage(null)}
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              {currentLang.backToShop}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
                onChange={(event) =>
                  setLanguage(event.target.value as "english" | "hindi")
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
        <SupabaseConfigBanner />

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {currentLang.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentLang.subtitle}
          </p>
        </div>

        {recentPurchases.length > 0 && (
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mb-10">
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Zap className="w-4 h-4 text-neon-green" />
              <span>{currentLang.recentHeadline}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentPurchases.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

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
                    {product.category === "masterclass" && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {currentLang.expertGuide}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {language === "hindi" &&
                        product.id === "complete-growth-kit"
                          ? "कम्प्लीट क्रिएटर ग्रोथ किट"
                          : language === "hindi" &&
                              product.id === "reels-mastery"
                            ? "इंस्टाग्राम रील्स मास्टरी कोर्स"
                            : language === "hindi" &&
                                product.id === "brand-masterclass"
                              ? "ब्रांड कोलैबोरेशन मास्टरक्लास"
                              : language === "hindi" &&
                                  product.id === "complete-bundle"
                                ? "कम्प्लीट क्रिएटर बंडल"
                                : product.name}
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
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            ✅ Purchased
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2 text-gray-700 mb-6">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <Shield className="w-4 h-4" />
                          <span className="font-semibold">
                            {language === "hindi"
                              ? "100% संतुष्टि गारंटी"
                              : "100% Satisfaction Guarantee"}
                          </span>
                        </div>
                        <p className="text-green-600 text-xs mt-1">
                          {language === "hindi"
                            ? "तुरंत डाउनलोड • सफलता की गारंटी"
                            : "Instant download • Success guarantee"}
                        </p>
                      </div>
                    </div>

                    <div className="lg:w-80">
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            ₹{product.price}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-lg text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </div>
                          )}
                          <div className="text-sm text-blue-600 font-medium mt-2">
                            💰{" "}
                            {language === "hindi"
                              ? "प्रोमो कोड से अतिरिक्त छूट प्राप्त करें"
                              : "Get extra discount with promo codes"}
                          </div>
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                            {Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100,
                            )}
                            % OFF
                          </div>

                          {isPurchased ? (
                            <button
                              onClick={() => setShowSuccessPage(product.id)}
                              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-all mb-4"
                            >
                              <Download className="w-4 h-4 inline mr-2" />
                              Download Products
                            </button>
                          ) : (
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
                              >
                                <ExternalLink className="w-4 h-4" />
                                Pay with Instamojo
                              </a>
                              <p className="text-xs text-gray-600 mb-4 text-center">
                                {currentLang.instamojoNote}
                              </p>
                            </>
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

      {showQuizRequiredPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "hindi"
                ? "❌ पहले अपनी प्रोफाइल पूर्ण करें"
                : "❌ Complete Your Profile First"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "hindi"
                ? "प्रीमियम टूल्स खरीदने से पहले आपको केवल 2 मिनट का क्विज़ पूरा करना होगा।"
                : "Before purchasing premium tools, please finish the 2-minute creator quiz."}
            </p>
            <div className="space-y-3">
              <Link
                to="/quiz"
                className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all inline-block"
              >
                {language === "hindi"
                  ? "🎯 अभी क्विज़ लें"
                  : "🎯 Take the Quiz Now"}
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
                  onChange={(event) =>
                    setCustomerInfo({
                      ...customerInfo,
                      name: event.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  placeholder={
                    language === "hindi"
                      ? "अपना नाम लिखें"
                      : "Enter your full name"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang.emailAddress}
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(event) =>
                    setCustomerInfo({
                      ...customerInfo,
                      email: event.target.value,
                    })
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
                  onChange={(event) =>
                    setCustomerInfo({
                      ...customerInfo,
                      phone: event.target.value,
                    })
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
                  onChange={(event) =>
                    setCustomerInfo({
                      ...customerInfo,
                      city: event.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  placeholder={
                    language === "hindi" ? "शहर लिखें" : "Enter your city"
                  }
                />
              </div>

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
                    onChange={(event) =>
                      setPromoCode(event.target.value.toUpperCase())
                    }
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
                      ? "छूट लागू की गई"
                      : "discount applied"}
                  </div>
                )}
              </div>
            </div>

            {showPaymentForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "hindi" ? "मूल कीमत:" : "Original Price:"}
                  </span>
                  <span className="text-gray-900">
                    ₹{getProductConfig(showPaymentForm)?.price}
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
                      {(getProductConfig(showPaymentForm)?.price ?? 0) -
                        calculateDiscountedPrice(
                          getProductConfig(showPaymentForm)?.price ?? 0,
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
                      getProductConfig(showPaymentForm)?.price ?? 0,
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 mb-4">
              <a
                href="https://www.instamojo.com/@famechase"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Pay with Instamojo
              </a>
              <p className="text-xs text-gray-600 text-center">
                {currentLang.instamojoNoteShort}
              </p>
            </div>

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
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
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

      <div className="fixed bottom-4 right-4 md:hidden z-40">
        <div className="flex items-center justify-between gap-3 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-green" />
            <div className="text-sm font-bold">
              {language === "hindi" ? "⏰ सीमित समय!" : "⏰ Limited Time!"}
            </div>
          </div>
          <div className="text-xs font-mono bg-white text-gray-900 px-2 py-1 rounded">
            {formatTimeLeft()}
          </div>
          <Link
            to="/quiz"
            className="bg-neon-green text-black px-3 py-1 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors"
          >
            {language === "hindi" ? "शुरू करें" : "Start Quiz"}
          </Link>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 FameChase.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ShopNew;
