import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Award, CheckCircle, CreditCard, Download, ExternalLink, Home, Loader2, Shield, Target, Zap, Menu } from "lucide-react";
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
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Purchase Successful!</h1>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {product?.downloads.map(d => (
            <div key={d.id} className="p-4 border rounded-xl flex flex-col items-center">
              <h3 className="font-bold mb-2 text-center">{d.name}</h3>
              <button onClick={() => handleDownload(showSuccessPage, d.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Download className="w-4 h-4"/> Download</button>
            </div>
          ))}
        </div>
        <button onClick={() => setShowSuccessPage(null)} className="mt-8 block mx-auto text-gray-500 font-medium">Back to Shop</button>
      </div>
    );
  }

  const getProductColors = (id: string) => {
    switch(id) {
      case "complete-growth-kit": return { bg: "bg-[#e8f5f1]", accent: "bg-[#00c853]", text: "text-[#00c853]", border: "border-[#00c853]/20" };
      case "instagram-reels-mastery": return { bg: "bg-[#f5eefc]", accent: "bg-[#9c27b0]", text: "text-[#9c27b0]", border: "border-[#9c27b0]/20" };
      case "brand-collaboration-masterclass": return { bg: "bg-[#fff3e0]", accent: "bg-[#ff9800]", text: "text-[#ff9800]", border: "border-[#ff9800]/20" };
      default: return { bg: "bg-gray-50", accent: "bg-blue-600", text: "text-blue-600", border: "border-gray-100" };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-50 shadow-sm">
        <Link to="/" className="text-xl font-bold text-[#00c853]">FameChase<span className="text-gray-900">.com</span></Link>
        
        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853] uppercase tracking-widest">Take Quiz</Link>
          <Link to="/shop" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853] uppercase tracking-widest">Shop</Link>
          <button className="bg-[#00c853] text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase">Get Started Free</button>
          <select value={language} onChange={e => setLanguage(e.target.value as any)} className="border rounded-lg px-2 py-1 text-[10px] font-medium focus:ring-1 focus:ring-[#00c853] outline-none">
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4 md:hidden">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium p-2 border-b">Home</Link>
            <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium p-2 border-b">Take Quiz</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium p-2 border-b">Shop</Link>
            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium text-gray-600">Language:</span>
              <select value={language} onChange={e => { setLanguage(e.target.value as any); setIsMenuOpen(false); }} className="border rounded-lg px-3 py-1 text-sm">
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>
        )}
      </header>

      <div className="bg-gradient-to-r from-[#9c27b0] to-[#e91e63] text-white text-center py-2 text-[10px] font-bold uppercase tracking-widest relative">
        🚀 Launch Promo: All Premium Products Are FREE for 45 Days!
        <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100">✕</span>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Creator Tools & Resources</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Professional tools to accelerate your creator journey.</p>
          <div className="h-1 w-20 bg-[#00c853] mx-auto mt-4 rounded-full"></div>
          <h3 className="mt-8 text-lg font-black text-gray-900 uppercase tracking-tight">Premium Creator Tools</h3>
        </div>
        
        <div className="grid gap-6">
          {products.map(p => {
            const colors = getProductColors(p.id);
            const isPurchased = isProductPurchased(p.id);
            const needsQuiz = !checkQuizCompletion();
            
            return (
              <div key={p.id} className={`${colors.bg} p-6 border ${colors.border} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${colors.accent} text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter`}>{p.category}</span>
                      {p.id === "complete-growth-kit" && <span className="bg-[#00b0ff] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Bestseller</span>}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{p.name}</h3>
                    <p className="text-gray-600 mb-4 text-[10px] font-medium leading-relaxed">{p.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-6">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-[10px] text-gray-600 font-medium list-none">
                          <CheckCircle className={`w-3 h-3 ${colors.text} shrink-0 mt-0.5`}/> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-black/5 flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-[#00c853]">
                      <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5" /> 100% Satisfaction Guarantee</span>
                      <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Instant Download • Start Learning Now</span>
                    </div>
                  </div>
                  <div className="md:w-56 flex flex-col gap-3">
                    <div className="text-center p-4 bg-white/50 rounded-lg border border-black/5 relative">
                      <div className="text-3xl font-black text-gray-900">₹{p.price}</div>
                      <div className="text-[10px] text-gray-400 line-through font-bold">₹{p.originalPrice}</div>
                      <div className="mt-1 text-red-500 text-[8px] font-black bg-red-50 py-0.5 px-2 rounded-full inline-block">HOT DEAL</div>
                      {isPurchased && (
                        <div className="absolute top-2 right-2 text-[#00c853]">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {isPurchased && !needsQuiz ? (
                        <button onClick={() => setShowSuccessPage(p.id)} className="w-full bg-[#00c853] text-white text-[10px] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#00a846] shadow-sm">
                          <Download className="w-3 h-3"/> Download Products
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleBuyClick(p.id)} className="w-full bg-gray-900 text-white text-[10px] font-black py-2.5 rounded-lg hover:bg-black transition-colors">Buy Now</button>
                          <button onClick={() => handleInstamojoClick(p.id)} className="w-full bg-[#0070ba] text-white text-[10px] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#005ea6]">
                            <ExternalLink className="w-3 h-3"/> Pay Instamojo
                          </button>
                          <button onClick={() => handleLaunchOfferClick(p.id)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black py-2.5 rounded-lg uppercase tracking-tight hover:shadow-lg transition-all animate-pulse">
                            Get Free for 45 Days (Launch Offer)
                          </button>
                          <p className="text-[8px] text-gray-400 text-center italic leading-tight px-4 font-bold">Return and click download after paying with Instamojo.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showQuizRequiredPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Complete Profile First</h3>
            <p className="text-gray-500 mb-6 text-[10px] font-medium">Before purchasing premium tools, please finish the 2-minute creator quiz.</p>
            <div className="flex flex-col gap-2">
              <Link to="/quiz" className="bg-[#00c853] text-white text-xs font-black py-3 rounded-xl hover:bg-[#00a846] shadow-lg shadow-[#00c853]/20">Take the Quiz Now</Link>
              <button onClick={() => setShowQuizRequiredPopup(false)} className="text-gray-400 text-[10px] font-bold hover:text-gray-600 py-1">Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopNew;
