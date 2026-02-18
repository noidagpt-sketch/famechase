import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Users,
  Star,
  ChevronDown,
  Download,
  CheckCircle,
  TrendingUp,
  Target,
  DollarSign,
  Globe,
  Mail,
  Shield,
  FileText,
  Phone,
  MapPin,
  Clock,
  X,
  Menu,
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
      subtitle:
        "Limited time offer. Get lifetime access to all creator tools absolutely free.",
    },
    header: {
      takeQuiz: "Take Quiz",
      shop: "Shop",
      getStartedFree: "Get Started Free",
    },
    hero: {
      badge: "India’s Platform for Creator & Marketer Growth",
      title: "Learn How to Grow and Monetize Your Content Effectively",
      titleHighlight: "",
      subtitle:
        "Get your personalized Creator Growth Kit, Professional Media Kit, and AI-powered strategy in just 3 minutes.",
      proofPoints: [
        "100% Free Analysis",
        "Instant Download",
        "Real Business Tools",
      ],
      ctaPrimary: "Start Your Creator Quiz Now",
      ctaSecondary: "Browse Creator Tools",
      stats: {
        creators: "10,000+",
        creatorsLabel: "Creators Helped",
        successRate: "98%",
        successRateLabel: "Success Rate",
        rating: "4.9/5",
        ratingLabel: "Rating",
      },
    },
    whatYouGet: {
      title: "What You Get Instantly",
      subtitle:
        "Complete your quiz and get immediate access to professional tools worth ₹10,000+ absolutely free",
      deliverables: {
        fameScore: {
          title: "Personalized Fame Score",
          description:
            "AI-powered analysis of your content, audience, and growth potential with actionable insights.",
          badge: "✓ Instant PDF Report",
        },
        mediaKit: {
          title: "Professional Media Kit",
          description:
            "Custom-designed media kit template with your stats, audience demographics, and rate cards.",
          badge: "✓ Editable Template",
        },
        growthStrategy: {
          title: "Growth Strategy Plan",
          description:
            "3-month action plan with content ideas, posting schedule, and monetization roadmap.",
          badge: "✓ Step-by-step Guide",
        },
      },
      premiumUpgrade: {
        badge: "🚀 UPGRADE TO PRO",
        title: "Complete Creator Business Kit - ₹497",
        subtitle:
          "Everything you need to turn your content into a profitable business",
        features: [
          "30+ Email Templates",
          "Live Profile Page",
          "Analytics Dashboard",
          "Priority Support",
        ],
        cta: "Start Free Quiz & Unlock Pro",
      },
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "From unknown creator to income earner in 3 simple steps",
      steps: [
        {
          number: "1",
          title: "📝 Complete Quiz (3 mins)",
          description:
            "Answer questions about your content, audience, goals, and current challenges. Our AI analyzes everything.",
        },
        {
          number: "2",
          title: "🔍 Get Instant Analysis",
          description:
            "Receive your Fame Score, personalized growth strategy, and professional tools immediately.",
        },
        {
          number: "3",
          title: "💰 Start Earning Today",
          description:
            "Use your media kit and outreach templates to land your first paid collaboration within 30 days.",
        },
      ],
      cta: "Start Your Creator Journey Now",
      ctaSubtext:
        "Join 10,000+ creators who've transformed their passion into profit",
    },
    successStories: {
      title: "Creator Success Stories",
      subtitle: "Real creators, real results, real income growth",
      stories: [
        {
          name: "Ananya Sharma",
          role: "Beauty Creator",
          avatar: "A",
          testimonial:
            "Using the professional media kit template, I secured my first brand collaboration within 2 weeks. The pricing guide helped me negotiate ₹35K for a single post.",
          result: "+₹35K first brand deal",
        },
        {
          name: "Vikash Malhotra",
          role: "Tech Reviewer",
          avatar: "V",
          testimonial:
            "The growth strategy helped me understand my audience better. I optimized my content using the insights and grew from 5K to 25K followers in 4 months.",
          result: "+20K followers in 4 months",
        },
        {
          name: "Meera Singh",
          role: "Lifestyle Blogger",
          avatar: "M",
          testimonial:
            "The email templates were game-changers. I used them to reach out to 50 brands and got responses from 12. Now I have consistent monthly collaborations.",
          result: "+12 active brand partnerships",
        },
      ],
    },
    finalCta: {
      title: "Ready to Turn Your Content Into Consistent Income?",
      subtitle:
        "Join thousands of creators who've built successful businesses using our proven framework",
      cta: "Get Your Free Creator Kit Now",
      benefits: [
        "✓ 100% Free Forever",
        "✓ Instant Access",
        "✓ No Credit Card Required",
      ],
    },
    footer: {
      description: "Empowering creators to build profitable businesses",
      links: ["Take Quiz", "Shop", "Results"],
      copyright:
        "© 2025 FameChase.com. All rights reserved. | Built for creators, by creators.",
      legal: {
        about: "About FameChase",
        contact: "Contact Us",
        privacy: "Privacy Policy",
        refund: "Refund Policy",
        terms: "Terms & Conditions",
      },
    },
  },
  hindi: {
    promo: {
      message:
        "🚀 लॉन्च प्रोमो: सभी प्रीमियम प्रोडक्ट्स 45 दिन के लिए बिल्कुल FREE!",
      subtitle:
        "सीमित समय का ऑफर। सभी क्रिएटर टूल्स तक आजीवन एक्सेस बिल्कुल मुफ्त पाएं।",
    },
    header: {
      takeQuiz: "क्विज़ लें",
      shop: "खरीदारी",
      getStartedFree: "मुफ़्त शुरुआत करें",
    },
    hero: {
      badge:
        "🏆 भारत का #1 क्रिएटर्स और मार्केटर्स के लिए ग्रोथ प्लेटफॉर्म - 10,000+ सफलता की कहानियां",
      title: "अपने कंटेंट को बदलें",
      titleHighlight: "₹50K+ मासिक आय में",
      subtitle:
        "केवल 3 मिनट में अपना व्यक्तिगत क्रिएटर ग्रोथ किट, प्रोफेशनल मीडिया किट, और AI-पावर्ड रणनीति प्राप्त करें।",
      proofPoints: [
        "100% मुफ्त विश्लेषण",
        "तुरंत डाउनलोड",
        "असली बिजनेस टूल्स",
      ],
      ctaPrimary: "अपना क्रिएटर क्विज़ अभी शुरू करें",
      ctaSecondary: "क्रिएटर टूल्स देखें",
      stats: {
        creators: "10,000+",
        creatorsLabel: "क्रिएटर्स की मदद की",
        successRate: "98%",
        successRateLabel: "सफलता दर",
        rating: "4.9/5",
        ratingLabel: "रेटिंग",
      },
    },
    whatYouGet: {
      title: "आपको तुरंत मिलता है",
      subtitle:
        "अपना क्विज़ पूरा करें और ₹10,000+ मूल्य के प्रोफेशनल टूल्स तक बिल्कुल मुफ्त तुरंत पहुँच प्राप्त करें",
      deliverables: {
        fameScore: {
          title: "व्यक्तिगत फेम स्कोर",
          description:
            "आपके कंटेंट, ऑडियंस, और विकास क्षमता का AI-powered विश्लेषण जिसमें कार्यशील सुझाव हैं।",
          badge: "✓ तुरंत PDF रिपोर्ट",
        },
        mediaKit: {
          title: "प्रोफेशनल मीडिया किट",
          description:
            "आपके आंकड़ों, ऑडियंस डेमोग्राफिक्स, और रेट कार्ड के साथ कस्टम-डिज़ाइन मीडिया किट टेम्प्लेट।",
          badge: "✓ संपादन योग्य टेम्प्लेट",
        },
        growthStrategy: {
          title: "विकास रणनीति योजना",
          description:
            "कंटेंट आइडिया, पोस्टिंग शेड्यूल, और मुद्रीकरण रोडमैप के साथ 3-महीने की कार्य योजना।",
          badge: "✓ चरणबद्ध गाइड",
        },
      },
      premiumUpgrade: {
        badge: "🚀 प्रो में अपग्रेड करें",
        title: "कम्प्लीट क्रिएटर बिज़नेस किट - ₹497",
        subtitle:
          "अपने कंटेंट को लाभदायक व्यवसाय में बदलने के लिए आवश्यक सब कुछ",
        features: [
          "30+ ईमेल टेम्प्लेट्स",
          "लाइव प्रोफाइल पेज",
          "एनालिटिक्स डैशबोर्ड",
          "प्राथमिकता सहायता",
        ],
        cta: "मुफ्त क्विज़ शुरू करें और प्रो अनलॉक करें",
      },
    },
    howItWorks: {
      title: "यह कैसे काम करता है",
      subtitle: "अज्ञात क्रिएटर से आय कमाने वाले तक केवल 3 सरल चरणों में",
      steps: [
        {
          number: "1",
          title: "📝 क्विज़ पूरा करें (3 मिनट)",
          description:
            "अपने कंटेंट, ऑडियंस, लक्ष्यों और वर्तमान चुनौतियों के बारे में प्रश्नों के उत्तर दें। हमारा AI सब कुछ विश्लेषित करता है।",
        },
        {
          number: "2",
          title: "🔍 तुरंत विश्लेषण प्राप्त करें",
          description:
            "अपना फेम स्कोर, व्यक्तिगत विकास रणनीति और प्रोफेशनल टूल्स तुरंत प्राप्त करें।",
        },
        {
          number: "3",
          title: "💰 आज ही कमाना शुरू करें",
          description:
            "30 दिनों के भीतर अपना पहला पेड कोलैबोरेशन हासिल करने के लिए अपनी मीडिया किट और आउटरीच टेम्प्लेट्स का उपयोग करें।",
        },
      ],
      cta: "अपनी क्रिएटर यात्रा अभी शुरू करें",
      ctaSubtext:
        "10,000+ क्रिएटर्स से जुड़ें जिन्होंने अपने जुनून को लाभ में बदला है",
    },
    successStories: {
      title: "क्रिएटर सफलता की कहानियां",
      subtitle: "असली क्रिएटर्स, असली परिणाम, असली आय वृद्धि",
      stories: [
        {
          name: "अनन्या शर्मा",
          role: "ब्यूटी क्रिएटर",
          avatar: "अ",
          testimonial:
            "प्रोफेशनल मीडिया किट टेम्प्लेट का उपयोग करके, मैंने 2 सप्ताह के भीतर अपना पहला ब्रांड कोलैबोरेशन सुरक्षित किया। प्राइसिंग गाइड ने मुझे एक पोस्ट के लिए ₹35K नेगोसिएट करने में मदद की।",
          result: "+₹35K पहला ब्रांड डील",
        },
        {
          name: "विकाश मल्होत्रा",
          role: "टेक रिव्यूअर",
          avatar: "वि",
          testimonial:
            "ग्रोथ स्ट्रैटेजी ने मुझे अपने ऑडियंस को बेहतर समझने में मदद की। मैंने इनसाइट्स का उपयोग करके कंटेंट को ऑप्टिमाइज़ किया और 4 महीने में 5K से 25K फॉलोअर्स तक पहुँचा।",
          result: "+20K फॉलोअर्स 4 महीने में",
        },
        {
          name: "मीरा सिंह",
          role: "लाइफस्टाइल ब्लॉगर",
          avatar: "मी",
          testimonial:
            "ईमेल टेम्प्लेट्स गेम-चेंजर थे। मैंने उनका उपयोग करके 50 ब्रांड्स तक पहुंचने के लिए किया और 12 से रिस्पॉन्स मिला। अब मेरे पास निरंतर मासिक कोलैबोरेशन हैं।",
          result: "+12 सक्रिय ब्रांड पार्टनरशिप",
        },
      ],
    },
    finalCta: {
      title: "अपने कंटेंट को निरंतर आय में बदलने के लिए तैयार हैं?",
      subtitle:
        "हजारों क्रिएटर्स से जुड़ें जिन्होंने हमारे सिद्ध फ्रेमवर्क का उपयोग करके सफल व्यवसाय बनाए हैं",
      cta: "अपना मुफ्त क्रिएटर किट अभी प्राप्त करें",
      benefits: [
        "✓ 100% हमेशा के लिए मुफ्त",
        "✓ तुरंत पहुँच",
        "✓ कोई क्रेडिट कार्ड आवश्यक नहीं",
      ],
    },
    footer: {
      description: "क्रिएटर्स को लाभदायक व्यवसाय बनाने में सशक्त बनाना",
      links: ["क्विज़ लें", "खरीदारी", "परिणाम"],
      copyright:
        "© 2025 FameChase.com. सभी अधिकार सुरक्षित। | क्रिएटर्स के लिए, क्रिएटर्स द्वारा निर्मित।",
      legal: {
        about: "FameChase के बारे में",
        contact: "संपर्क करें",
        privacy: "गोपनीयता नीति",
        refund: "रिफंड नीति",
        terms: "नियम और शर्तें",
      },
    },
  },
};

export default function Index() {
  const [language, setLanguage] = useState<"english" | "hindi">(() => {
    const saved = localStorage.getItem("famechase-language");
    return (saved as any) || "english";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("famechase-language", language);
  }, [language]);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-black text-gray-900">
              FameChase<span className="text-blue-600">.com</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/quiz" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">{t.header.takeQuiz}</Link>
            <Link to="/shop" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">{t.header.shop}</Link>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <Link to="/quiz" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              {t.header.getStartedFree}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
            <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold p-2 border-b">{t.header.takeQuiz}</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold p-2 border-b">{t.header.shop}</Link>
            <div className="flex items-center justify-between p-2">
              <span className="font-bold text-gray-600">Language</span>
              <select value={language} onChange={(e) => { setLanguage(e.target.value as any); setIsMenuOpen(false); }} className="border rounded-lg px-2 py-1">
                {languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <Link to="/quiz" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white p-4 rounded-2xl text-center font-black shadow-lg">{t.header.getStartedFree}</Link>
          </div>
        )}
      </header>

      {/* Promo Bar */}
      <div className="pt-20">
        <div className="bg-blue-600 text-white py-3">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-bold animate-pulse">{t.promo.message}</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              {t.hero.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
              {t.hero.title} <span className="text-blue-600">{t.hero.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/quiz" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group">
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="w-full sm:w-auto bg-gray-50 text-gray-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all">
                {t.hero.ctaSecondary}
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-gray-400">
              {t.hero.proofPoints.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Link to="/" className="text-2xl font-black text-gray-900 mb-6 block">
                FameChase<span className="text-blue-600">.com</span>
              </Link>
              <p className="text-gray-500 max-w-sm mb-8">{t.footer.description}</p>
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <Mail className="w-5 h-5 text-gray-400" />
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {t.footer.links.map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(" ", "-")}`} className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-gray-500 hover:text-blue-600 font-medium">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-500 hover:text-blue-600 font-medium">Terms & Conditions</Link></li>
                <li><Link to="/refund" className="text-gray-500 hover:text-blue-600 font-medium">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center border-t border-gray-200 pt-10">
            <p className="text-gray-400 text-sm font-medium">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
