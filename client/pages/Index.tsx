import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  Target, 
  Zap, 
  Award, 
  BarChart3, 
  Smartphone, 
  Globe, 
  ShieldCheck,
  Menu,
  X,
  Star,
  ChevronDown,
  Download,
  TrendingUp,
  DollarSign,
  Mail,
  Shield,
  FileText,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

interface Language {
  code: "english" | "hindi";
  name: string;
}

const languages: Language[] = [
  { code: "english", name: "English" },
  { code: "hindi", name: "हिंदी" },
];

const translations = {
  english: {
    promo: {
      message: "🚀 Launch Promo: All Premium Products Are FREE for 45 Days!",
      subtitle: "Limited time offer. Get lifetime access to all creator tools absolutely free.",
    },
    header: {
      takeQuiz: "Take Quiz",
      shop: "Shop",
      getStartedFree: "Get Started Free",
    },
    hero: {
      badge: "India's Platform for Creators & Marketers Growth",
      title: "Learn How to Grow and Monetize Your Content Effectively",
      subtitle: "Get your personalized Creator Growth Kit, Professional Media Kit, and AI-powered strategy in just 3 minutes.",
      proofPoints: [
        "100% Free Analysis",
        "Instant Download",
        "Real Business Tools",
      ],
      ctaPrimary: "Start Your Creator Quiz Now",
      ctaSecondary: "Browse Creator Tools",
    },
    whatYouGet: {
      title: "What You Get Instantly",
      subtitle: "Complete your quiz and get immediate access to professional tools worth ₹10,000+ absolutely free",
      deliverables: {
        fameScore: {
          title: "Personalized Fame Score",
          description: "An advanced analysis of your content, audience, and growth potential with actionable insights.",
          badge: "✓ Instant PDF Report",
        },
        mediaKit: {
          title: "Professional Media Kit",
          description: "Custom-designed media kit template with your stats, audience demographics, and rate cards.",
          badge: "✓ Editable Template",
        },
        growthStrategy: {
          title: "Growth Strategy Plan",
          description: "A 3-month action plan with content ideas, posting schedule, and monetization roadmap.",
          badge: "✓ Step-by-Step Guide",
        },
      },
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "From unknown creator to income earner in 3 simple steps",
      steps: [
        {
          number: "1",
          title: "Complete Quiz (3 mins)",
          description: "Answer questions about your content, audience, goals, and current challenges. Our AI analyzes everything.",
        },
        {
          number: "2",
          title: "Get Instant Analysis",
          description: "Receive your Fame Score, personalized growth strategy, and professional tools immediately.",
        },
        {
          number: "3",
          title: "Start Earning Today",
          description: "Use your media kit and growth template to land your first brand collaboration within 30 days.",
        },
      ],
      cta: "Start Your Creator Journey Now",
      ctaSubtext: "Join 10,000+ creators who've transformed their passion into profit",
    },
    successStories: {
      title: "Creator Success Stories",
      subtitle: "Real creators, real results, real income growth",
      stories: [
        {
          name: "Ananya Sharma",
          role: "Beauty Creator",
          text: "Using the professional media kit template, I secured my first brand collaboration within 2 weeks. The pricing guide helped me negotiate ₹25k for a single post!",
          tag: "₹25k first brand deal",
        },
        {
          name: "Vikash Malhotra",
          role: "Tech Reviewer",
          text: "The growth strategy helped me understand my audience better. I optimized my content using the insights and grew from 5k to 25k followers in 4 months.",
          tag: "+20k followers in 4 months",
        },
        {
          name: "Meera Singh",
          role: "Lifestyle Blogger",
          text: "The email templates were game-changers. I used them to reach out to 10 brands and got responses from 4! Now I have consistent monthly collaborations.",
          tag: "4 brand deals partnered",
        },
      ],
    },
    finalCta: {
      title: "Ready to Turn Your Content Into Consistent Income?",
      subtitle: "Join thousands of creators who've built successful businesses using our proven framework",
      cta: "Get Your Free Creator Kit Now",
      subtext: "100% Free Forever • Instant Access • No Credit Card Required",
    },
    footer: {
      tagline: "Empowering creators to build profitable businesses",
      copyright: "© 2026 FameChase. All rights reserved.",
    }
  },
  hindi: {
    promo: {
      message: "🚀 लॉन्च प्रोमो: सभी प्रीमियम प्रोडक्ट्स 45 दिन के लिए बिल्कुल FREE!",
      subtitle: "सीमित समय का ऑफर। सभी क्रिएटर टूल्स तक आजीवन एक्सेस बिल्कुल मुफ्त पाएं।",
    },
    header: {
      takeQuiz: "क्विज़ लें",
      shop: "खरीदारी",
      getStartedFree: "मुफ़्त शुरुआत करें",
    },
    hero: {
      badge: "भारत का #1 क्रिएटर्स और मार्केटर्स के लिए ग्रोथ प्लेटफॉर्म",
      title: "अपने कंटेंट को बदलें ₹50K+ मासिक आय में",
      subtitle: "केवल 3 मिनट में अपना व्यक्तिगत क्रिएटर ग्रोथ किट, प्रोफेशनल मीडिया किट, और AI-पावर्ड रणनीति प्राप्त करें।",
      proofPoints: [
        "100% मुफ्त विश्लेषण",
        "तुरंत डाउनलोड",
        "असली बिजनेस टूल्स",
      ],
      ctaPrimary: "अपना क्रिएटर क्विज़ अभी शुरू करें",
      ctaSecondary: "क्रिएटर टूल्स देखें",
    },
    whatYouGet: {
      title: "आपको तुरंत मिलता है",
      subtitle: "अपना क्विज़ पूरा करें और ₹10,000+ मूल्य के प्रोफेशनल टूल्स तक बिल्कुल मुफ्त तुरंत पहुँच प्राप्त करें",
      deliverables: {
        fameScore: {
          title: "व्यक्तिगत फेम स्कोर",
          description: "आपके कंटेंट, ऑडियंस, और विकास क्षमता का AI-powered विश्लेषण जिसमें कार्यशील सुझाव हैं।",
          badge: "✓ तुरंत PDF रिपोर्ट",
        },
        mediaKit: {
          title: "प्रोफेशनल मीडिया किट",
          description: "आपके आंकड़ों, ऑडियंस डेमोग्राफिक्स, और रेट कार्ड के साथ कस्टम-डिज़ाइन मीडिया किट टेम्प्लेट।",
          badge: "✓ संपादन योग्य टेम्प्लेट",
        },
        growthStrategy: {
          title: "विकास रणनीति योजना",
          description: "कंटेंट आइडिया, पोस्टिंग शेड्यूल, और मुद्रीकरण रोडमैप के साथ 3-महीने की कार्य योजना।",
          badge: "✓ चरणबद्ध गाइड",
        },
      },
    },
    howItWorks: {
      title: "यह कैसे काम करता है",
      subtitle: "अज्ञात क्रिएटर से आय कमाने वाले तक केवल 3 सरल चरणों में",
      steps: [
        {
          number: "1",
          title: "क्विज़ पूरा करें (3 मिनट)",
          description: "अपने कंटेंट, ऑडियंस, लक्ष्यों और वर्तमान चुनौतियों के बारे में प्रश्नों के उत्तर दें। हमारा AI सब कुछ विश्लेषित करता है।",
        },
        {
          number: "2",
          title: "तुरंत विश्लेषण प्राप्त करें",
          description: "अपना फेम स्कोर, व्यक्तिगत विकास रणनीति और प्रोफेशनल टूल्स तुरंत प्राप्त करें।",
        },
        {
          number: "3",
          title: "आज ही कमाना शुरू करें",
          description: "30 दिनों के भीतर अपना पहला पेड कोलैबोरेशन हासिल करने के लिए अपनी मीडिया किट और आउटरीच टेम्प्लेट्स का उपयोग करें।",
        },
      ],
      cta: "अपनी क्रिएटर यात्रा अभी शुरू करें",
      ctaSubtext: "10,000+ क्रिएटर्स से जुड़ें जिन्होंने अपने जुनून को लाभ में बदला है",
    },
    successStories: {
      title: "क्रिएटर सफलता की कहानियां",
      subtitle: "असली क्रिएटर्स, असली परिणाम, असली आय वृद्धि",
      stories: [
        {
          name: "अनन्या शर्मा",
          role: "ब्यूटी क्रिएटर",
          text: "प्रोफेशनल मीडिया किट टेम्प्लेट का उपयोग करके, मैंने 2 सप्ताह के भीतर अपना पहला ब्रांड कोलैबोरेशन सुरक्षित किया। प्राइसिंग गाइड ने मुझे एक पोस्ट के लिए ₹25k नेगोसिएट करने में मदद की।",
          tag: "₹25k पहला ब्रांड डील",
        },
        {
          name: "विकाश मल्होत्रा",
          role: "टेक रिव्यूअर",
          text: "ग्रोथ स्ट्रैटेजी ने मुझे अपने ऑडियंस को बेहतर समझने में मदद की। मैंने इनसाइट्स का उपयोग करके कंटेंट को ऑप्टिमाइज़ किया और 4 महीने में 5K से 25K फॉलोअर्स तक पहुँचा।",
          tag: "+20K फॉलोअर्स 4 महीने में",
        },
        {
          name: "मीरा सिंह",
          role: "लाइफस्टाइल ब्लॉगर",
          text: "ईमेल टेम्प्लेट्स गेम-चेंजर थे। मैंने उनका उपयोग करके 10 ब्रांड्स तक पहुंचने के लिए किया और 4 से रिस्पॉन्स मिला। अब मेरे पास निरंतर मासिक कोलैबोरेशन हैं।",
          tag: "4 सक्रिय ब्रांड पार्टनरशिप",
        },
      ],
    },
    finalCta: {
      title: "अपने कंटेंट को निरंतर आय में बदलने के लिए तैयार हैं?",
      subtitle: "हजारों क्रिएटर्स से जुड़ें जिन्होंने हमारे सिद्ध फ्रेमवर्क का उपयोग करके सफल व्यवसाय बनाए हैं",
      cta: "अपना मुफ्त क्रिएटर किट अभी प्राप्त करें",
      subtext: "100% हमेशा के लिए मुफ्त • तुरंत पहुँच • कोई क्रेडिट कार्ड आवश्यक नहीं",
    },
    footer: {
      tagline: "क्रिएटर्स को लाभदायक व्यवसाय बनाने में सशक्त बनाना",
      copyright: "© 2026 FameChase. सभी अधिकार सुरक्षित।",
    }
  },
};

export default function Index() {
  const [language, setLanguage] = useState<"english" | "hindi" >(() => {
    const saved = localStorage.getItem("famechase-language");
    return (saved as any) || "english";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("famechase-language", language);
  }, [language]);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#00c853]">FameChase<span className="text-gray-900">.com</span></Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/quiz" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853] uppercase tracking-widest">{t.header.takeQuiz}</Link>
            <Link to="/shop" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853] uppercase tracking-widest">{t.header.shop}</Link>
            <Link to="/quiz" className="bg-[#00c853] text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase">
              {t.header.getStartedFree}
            </Link>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-[10px] font-bold border rounded-lg px-2 py-1 outline-none"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] pt-20 px-4 flex flex-col gap-6 md:hidden">
          <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold p-2 border-b">{t.header.takeQuiz}</Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold p-2 border-b">{t.header.shop}</Link>
          <div className="flex items-center justify-between p-2">
            <span className="font-bold text-gray-600">Language</span>
            <select value={language} onChange={(e) => { setLanguage(e.target.value as any); setIsMenuOpen(false); }} className="border rounded-lg px-2 py-1">
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
          <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="bg-[#00c853] text-white py-4 rounded-xl text-center font-bold">{t.header.getStartedFree}</Link>
        </div>
      )}

      {/* Top Banner */}
      <div className="pt-16">
        <div className="bg-gradient-to-r from-[#9c27b0] to-[#e91e63] text-white text-center py-2 text-[10px] font-bold uppercase tracking-widest relative">
          {t.promo.message}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-70">✕</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block bg-[#e8f5f1] text-[#00c853] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">{t.hero.badge}</span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">{t.hero.title}</h1>
          <p className="text-gray-500 text-sm md:text-lg font-medium mb-10 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/quiz" className="w-full md:w-auto bg-[#00c853] text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 hover:bg-[#00a846] transition-all shadow-lg shadow-[#00c853]/20">
              {t.hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/shop" className="w-full md:w-auto bg-white border border-gray-200 text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-gray-50 transition-all">
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {t.hero.proofPoints.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black mb-4">{t.whatYouGet.title} <span className="text-[#00c853]">Instantly</span></h2>
            <p className="text-gray-500 text-sm font-medium">{t.whatYouGet.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00c853] group-hover:text-white transition-colors">
                <Award className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.whatYouGet.deliverables.fameScore.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">{t.whatYouGet.deliverables.fameScore.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-[#00c853] uppercase tracking-widest">
                <CheckCircle className="w-3 h-3" /> {t.whatYouGet.deliverables.fameScore.badge}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00c853] group-hover:text-white transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.whatYouGet.deliverables.mediaKit.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">{t.whatYouGet.deliverables.mediaKit.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-[#00c853] uppercase tracking-widest">
                <CheckCircle className="w-3 h-3" /> {t.whatYouGet.deliverables.mediaKit.badge}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00c853] group-hover:text-white transition-colors">
                <Target className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">{t.whatYouGet.deliverables.growthStrategy.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">{t.whatYouGet.deliverables.growthStrategy.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-[#00c853] uppercase tracking-widest">
                <CheckCircle className="w-3 h-3" /> {t.whatYouGet.deliverables.growthStrategy.badge}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black mb-4">{t.howItWorks.title}</h2>
            <p className="text-gray-500 text-sm font-medium">{t.howItWorks.subtitle}</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gray-100 z-0"></div>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {t.howItWorks.steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-20 h-20 bg-[#00c853] text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00c853]/20 border-8 border-white">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link to="/quiz" className="bg-[#00c853] text-white font-bold py-4 px-10 rounded-full hover:bg-[#00a846] transition-all shadow-xl shadow-[#00c853]/30 inline-flex items-center gap-2">
              {t.howItWorks.cta} <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.howItWorks.ctaSubtext}</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black mb-4">{t.successStories.title.split(" ")[0]} <span className="text-[#00c853]">{t.successStories.title.split(" ").slice(1).join(" ")}</span></h2>
            <p className="text-gray-500 text-sm font-medium">{t.successStories.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.successStories.stories.map((s) => (
              <div key={s.name} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative pt-12">
                <div className="absolute top-0 left-8 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#e91e63] to-[#9c27b0] flex items-center justify-center text-white font-bold shadow-md">
                  {s.name[0]}
                </div>
                <div className="mb-4">
                  <h4 className="font-bold text-sm">{s.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{s.role}</span>
                </div>
                <p className="text-gray-600 text-xs italic leading-relaxed mb-6">"{s.text}"</p>
                <div className="text-[#00c853] text-[8px] font-black uppercase tracking-widest bg-[#e8f5f1] px-2 py-1 rounded-full inline-block">
                  <CheckCircle className="w-2 h-2 inline mr-1" /> {s.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-6 leading-tight">{t.finalCta.title}</h2>
          <p className="text-gray-500 text-sm font-medium mb-10">{t.finalCta.subtitle}</p>
          
          <Link to="/quiz" className="bg-[#00c853] text-white font-bold py-5 px-12 rounded-full hover:bg-[#00a846] transition-all shadow-xl shadow-[#00c853]/30 inline-flex items-center gap-2 group text-lg">
            {t.finalCta.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.finalCta.subtext}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="text-sm font-bold text-[#00c853] mb-4 block">FameChase<span className="text-gray-900">.com</span></Link>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-8">{t.footer.tagline}</p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link to="/quiz" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853]">Take Quiz</Link>
            <Link to="/shop" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853]">Shop</Link>
            <Link to="/results" className="text-[10px] font-bold text-gray-600 hover:text-[#00c853]">Results</Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[8px] font-bold text-gray-300 uppercase tracking-tighter">
            <Link to="#">About FameChase</Link>
            <Link to="#">Contact Us</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Return Policy</Link>
            <Link to="#">Terms & Conditions</Link>
          </div>
          <p className="mt-8 text-[8px] font-bold text-gray-300 uppercase tracking-tighter">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
