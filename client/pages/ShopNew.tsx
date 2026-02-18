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

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-50 shadow-sm">
        <Link to="/" className="text-xl font-bold">FameChase<span className="text-blue-600">.com</span></Link>
        
        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/quiz" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Take Quiz</Link>
          <select value={language} onChange={e => setLanguage(e.target.value as any)} className="border rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium p-2 border-b">Home</Link>
            <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="text-base font-medium p-2 border-b">Take Quiz</Link>
            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium text-gray-600">Language:</span>
              <select value={language} onChange={e => { setLanguage(e.target.value as any); setIsMenuOpen(false); }} className="border rounded-lg px-3 py-1.5 text-sm font-medium">
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Creator Tools & Resources</h1>
        <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">Professional growth kits and courses to accelerate your influencer journey.</p>
        
        <div className="grid gap-8">
          {products.map(p => {
            const isPurchased = isProductPurchased(p.id);
            const needsQuiz = !checkQuizCompletion();
            
            return (
              <div key={p.id} className="p-6 md:p-8 border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-gray-100 bg-white group">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{p.category}</span>
                      {p.id === "complete-growth-kit" && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Bestseller</span>}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">{p.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm text-gray-700 list-none">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-64 flex flex-col gap-4">
                    <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-3xl font-black text-gray-900 mb-1">₹{p.price}</div>
                      <div className="text-sm text-gray-400 line-through font-medium">₹{p.originalPrice}</div>
                      <div className="mt-2 text-red-500 text-[10px] font-bold bg-red-50 py-1 px-2 rounded-full inline-block">SAVE {Math.round((1 - p.price/p.originalPrice) * 100)}%</div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {isPurchased && !needsQuiz ? (
                        <button onClick={() => setShowSuccessPage(p.id)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
                          <Download className="w-4 h-4"/> Download Products
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleBuyClick(p.id)} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">Buy Now</button>
                          <button onClick={() => handleInstamojoClick(p.id)} className="w-full bg-[#0070ba] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#005ea6] transition-colors">
                            <ExternalLink className="w-4 h-4"/> Pay Instamojo
                          </button>
                          <button onClick={() => handleLaunchOfferClick(p.id)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-tight hover:shadow-lg transition-all animate-pulse">
                            Get Free for 45 Days (Launch Offer)
                          </button>
                          <p className="text-[10px] text-gray-400 text-center italic leading-tight px-4 mt-1">Return and click download after paying with Instamojo.</p>
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
          <div className="bg-white p-8 md:p-10 rounded-3xl max-w-sm w-full text-center shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Complete Your Profile First</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">Before purchasing premium tools, please finish the 2-minute creator quiz.</p>
            <div className="flex flex-col gap-3">
              <Link to="/quiz" className="bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Take the Quiz Now</Link>
              <button onClick={() => setShowQuizRequiredPopup(false)} className="text-gray-400 text-sm font-medium hover:text-gray-600 py-2">Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopNew;
