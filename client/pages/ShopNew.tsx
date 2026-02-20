import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Award, CheckCircle, CreditCard, Download, ExternalLink, Home, Loader2, Shield, Target, Zap, Menu, X } from "lucide-react";
import { getAllProducts, getProductConfig, generateProductDownload, downloadFile, type ProductConfig } from "../lib/products";
import { sanitizeDeep } from "@/lib/sanitize";
import SupabaseConfigBanner from "../components/SupabaseConfigBanner";

interface PurchasedProduct { id: string; purchaseDate: string; customerInfo: any; }
interface CustomerInfo { name: string; email: string; phone: string; city: string; }

function ShopNew() {
  const [language, setLanguage] = useState<"english" | "hindi">(() => (localStorage.getItem("famechase-language") as any) || "english");
  const [products, setProducts] = useState<ProductConfig[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [showQuizRequiredPopup, setShowQuizRequiredPopup] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: "", email: "", phone: "", city: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [showSuccessPage, setShowSuccessPage] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/product-settings");
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          const mappedProducts = data.products.map((p: any) => ({
            id: p.product_id,
            name: p.product_name || p.product_id,
            price: p.price || 0,
            originalPrice: p.original_price || 0,
            description: p.description || "",
            isEnabled: p.is_visible,
            category: p.category || "course",
            features: p.features ? p.features.split("\n") : [],
            downloads: getProductConfig(p.product_id)?.downloads || []
          }));
          setProducts(mappedProducts.filter((p: any) => p.isEnabled));
        } else {
          setProducts(getAllProducts());
        }
      } catch {
        setProducts(getAllProducts());
      }
    };
    fetchProducts();

    const storedPurchases = localStorage.getItem("purchasedProducts");
    if (storedPurchases) setPurchasedProducts(JSON.parse(storedPurchases));
    const storedQuizData = localStorage.getItem("fameChaseQuizData");
    if (storedQuizData) {
      const data = JSON.parse(storedQuizData);
      setQuizData(data);
      if (data.language) setLanguage(data.language);
    }
  }, []);

  const checkQuizCompletion = () => {
    if (!quizData) return false;
    return Boolean(quizData.name && quizData.email && quizData.niche && quizData.goals);
  };

  const handleBuyClick = (productId: string) => {
    if (!checkQuizCompletion()) { setShowQuizRequiredPopup(true); return; }
    setShowPaymentForm(productId);
  };

  const handleInstamojoClick = (productId: string) => {
    if (!checkQuizCompletion()) { setShowQuizRequiredPopup(true); return; }
    const product = products.find(p => p.id === productId);
    if (product) {
      const purpose = encodeURIComponent(`FameChase - ${product.name}`.substring(0, 30));
      const amount = Math.round(product.price * (1 - appliedDiscount / 100));
      window.open(`https://www.instamojo.com/@famechase/?amount=${amount}&purpose=${purpose}`, "_blank");
    }
  };

  const handleLaunchOfferClick = (productId: string) => {
    if (!checkQuizCompletion()) { setShowQuizRequiredPopup(true); return; }
    handlePurchase(productId);
  };

  const handlePurchase = async (productId: string | null) => {
    if (!productId) return;
    setIsSubmitting(true);
    const product = products.find(p => p.id === productId);
    try {
      await fetch("/api/user-analytics/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName: product?.name, amount: product?.price, paymentStatus: "success", paymentMethod: "free_promo", customerName: customerInfo.name || quizData?.name, customerEmail: customerInfo.email || quizData?.email, customerPhone: customerInfo.phone || quizData?.phone, customerCity: customerInfo.city || quizData?.city }),
      });
    } catch {}
    const purchase = { id: productId, purchaseDate: new Date().toISOString(), customerInfo: { ...customerInfo, ...quizData } };
    const updated = [...purchasedProducts, purchase];
    setPurchasedProducts(updated);
    localStorage.setItem("purchasedProducts", JSON.stringify(updated));
    setIsSubmitting(false);
    setShowPaymentForm(null);
    setShowSuccessPage(productId);
  };

  const handleDownload = async (productId: string | null, downloadId: string) => {
    if (!productId) return;
    const content = generateProductDownload(productId, downloadId, language, quizData);
    const product = getProductConfig(productId);
    const download = product?.downloads.find(d => d.id === downloadId);
    if (content && download) {
      const fileName = `${download.fileName}_${language}.pdf`;
      await downloadFile(content, fileName);
      try {
        await fetch("/api/user-analytics/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: quizData?.email || "anonymous", downloadType: download.type, fileName, productId }),
        });
      } catch {}
    }
  };

  const isProductPurchased = (id: string) => purchasedProducts.some(p => p.id === id || p.id === "complete-bundle");

  if (showSuccessPage) {
    const product = products.find(p => p.id === showSuccessPage) || getProductConfig(showSuccessPage);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
            <p className="text-gray-600">Download your products below. All files include your personalized data.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product?.downloads.map(d => (
              <div key={d.id} className="bg-white p-5 border border-gray-200 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 text-center">{d.name}</h3>
                <button onClick={() => handleDownload(showSuccessPage, d.id)} className="bg-neon-green hover:bg-green-400 text-black px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors">
                  <Download className="w-4 h-4"/> Download
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setShowSuccessPage(null)} className="mt-8 block mx-auto text-gray-500 font-medium hover:text-gray-700 transition-colors">Back to Shop</button>
        </div>
      </div>
    );
  }

  const getProductColors = (id: string) => {
    switch(id) {
      case "complete-growth-kit": return { bg: "bg-gradient-to-br from-green-50 to-emerald-50", accent: "bg-neon-green", text: "text-green-600", border: "border-green-200" };
      case "reels-mastery":
      case "instagram-reels-mastery": return { bg: "bg-gradient-to-br from-purple-50 to-pink-50", accent: "bg-purple-600", text: "text-purple-600", border: "border-purple-200" };
      case "brand-masterclass":
      case "brand-collaboration-masterclass": return { bg: "bg-gradient-to-br from-orange-50 to-amber-50", accent: "bg-orange-500", text: "text-orange-600", border: "border-orange-200" };
      case "youtube-mastery": return { bg: "bg-gradient-to-br from-red-50 to-rose-50", accent: "bg-red-600", text: "text-red-600", border: "border-red-200" };
      case "facebook-posting-mastery": return { bg: "bg-gradient-to-br from-blue-50 to-indigo-50", accent: "bg-blue-600", text: "text-blue-600", border: "border-blue-200" };
      case "complete-bundle": return { bg: "bg-gradient-to-br from-indigo-50 to-blue-50", accent: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-200" };
      default: return { bg: "bg-gray-50", accent: "bg-blue-600", text: "text-blue-600", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-neon-green">FameChase</span>
            <span className="text-gray-900">.com</span>
          </Link>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/quiz" className="text-gray-600 hover:text-gray-900 font-medium">Take Quiz</Link>
            <Link to="/shop" className="text-gray-600 hover:text-gray-900 font-medium">Shop</Link>
            <Link to="/quiz" className="bg-neon-green text-black px-6 py-2 rounded-full font-semibold hover:bg-green-400 transition-colors">Get Started Free</Link>
            <select value={language} onChange={e => setLanguage(e.target.value as any)} className="bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium">
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </nav>

          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4 md:hidden">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium p-2 border-b">Home</Link>
              <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="text-base font-medium p-2 border-b">Take Quiz</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-base font-medium p-2 border-b">Shop</Link>
              <div className="flex items-center justify-between p-2">
                <span className="text-base font-medium text-gray-600">Language:</span>
                <select value={language} onChange={e => { setLanguage(e.target.value as any); setIsMenuOpen(false); }} className="border rounded-lg px-3 py-1 text-sm">
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      {showPromo && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-3 px-4 relative overflow-hidden">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <p className="text-sm md:text-base font-semibold flex-1 text-center">
              🚀 Launch Promo: All Premium Products Are FREE for 45 Days!
            </p>
            <button onClick={() => setShowPromo(false)} className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-neon-green/10 border border-neon-green/30 rounded-full px-6 py-3 mb-6">
            <span className="text-neon-green text-sm font-semibold">Professional Creator Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Creator Tools & Resources</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Professional tools to accelerate your creator journey and start earning from your content.</p>
        </div>
        
        <div className="grid gap-8">
          {products.map(p => {
            const colors = getProductColors(p.id);
            const isPurchased = isProductPurchased(p.id);
            const needsQuiz = !checkQuizCompletion();
            
            return (
              <div key={p.id} className={`${colors.bg} p-6 md:p-8 border ${colors.border} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${colors.accent} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>{p.category}</span>
                      {p.id === "complete-growth-kit" && <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Bestseller</span>}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{p.name}</h3>
                    <p className="text-gray-600 mb-5 text-sm leading-relaxed">{p.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700 list-none">
                          <CheckCircle className={`w-4 h-4 ${colors.text} shrink-0 mt-0.5`}/> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-black/5 flex flex-wrap items-center gap-4 text-xs font-semibold text-green-600">
                      <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 100% Satisfaction Guarantee</span>
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Instant Download</span>
                    </div>
                  </div>
                  <div className="md:w-60 flex flex-col gap-3">
                    <div className="text-center p-5 bg-white/70 rounded-xl border border-black/5 relative">
                      <div className="text-3xl font-bold text-gray-900">₹{p.price}</div>
                      <div className="text-sm text-gray-400 line-through font-medium">₹{p.originalPrice}</div>
                      <div className="mt-2 text-red-600 text-xs font-bold bg-red-50 py-1 px-3 rounded-full inline-block">
                        SAVE ₹{p.originalPrice - p.price}
                      </div>
                      {isPurchased && (
                        <div className="absolute top-2 right-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                      {isPurchased && !needsQuiz ? (
                        <button onClick={() => setShowSuccessPage(p.id)} className="w-full bg-neon-green text-black text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 shadow-sm transition-colors">
                          <Download className="w-4 h-4"/> Download Products
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleInstamojoClick(p.id)} className="w-full bg-gray-900 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors">
                            <ExternalLink className="w-4 h-4"/> Pay via Instamojo
                          </button>
                          <button onClick={() => handleLaunchOfferClick(p.id)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-3 rounded-xl hover:shadow-lg transition-all">
                            Get Free for 45 Days (Launch Offer)
                          </button>
                          <p className="text-xs text-gray-400 text-center italic leading-snug px-2">Return and click "Download Products" after paying with Instamojo.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Creator Journey?</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">Take our free quiz to get personalized insights and unlock your growth potential.</p>
            <Link to="/quiz" className="inline-flex items-center gap-2 bg-neon-green text-black px-8 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors text-lg">
              <Target className="w-5 h-5" /> Start Free Quiz Now
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">&copy; 2025 FameChase.com. All rights reserved. | Built for creators, by creators.</p>
        </div>
      </footer>

      {showQuizRequiredPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Profile First</h3>
            <p className="text-gray-500 mb-6 text-sm">Before purchasing premium tools, please finish the 2-minute creator quiz so your downloads are personalized.</p>
            <div className="flex flex-col gap-3">
              <Link to="/quiz" className="bg-neon-green text-black text-sm font-bold py-3 rounded-xl hover:bg-green-400 shadow-lg transition-colors">Take the Quiz Now</Link>
              <button onClick={() => setShowQuizRequiredPopup(false)} className="text-gray-400 text-sm font-medium hover:text-gray-600 py-1">Maybe Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopNew;
