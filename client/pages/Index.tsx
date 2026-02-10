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
        title: "Complete Creator Business Kit - ��497",
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
        "�� 2025 FameChase.com. All rights reserved. | Built for creators, by creators.",
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
        "100% मुफ��त विश्लेषण",
        "तुरंत डाउनलोड",
        "असली बिज���नेस टूल्स",
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
        "अपना क्विज़ पूरा करें और ₹10,000+ मूल्य के प्रोफेशनल टूल्स ���क बिल्कुल ���ुफ्त तुरंत पहुँच प्राप्त करें",
      deliverables: {
        fameScore: {
          title: "व्यक्तिगत फेम स्कोर",
          description:
            "आपके कंटेंट, ऑडियंस, और विकास क्षमता का AI-powered विश्ल��षण जिसमें कार��यशील सुझाव हैं।",
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
          "अपने ���ंटें��� को लाभदायक व्यवसाय में बदलने के लिए आवश्यक सब कुछ",
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
          title: "📝 क्विज़ प���रा करें (3 मिनट)",
          description:
            "अपने कंटेंट, ऑडियंस, लक्ष्यों और वर्तमान चुनौतियों के बारे में प्रश्नों के उत्तर दें। हमारा AI सब कुछ विश्लेषित करता है।",
        },
        {
          number: "2",
          title: "🔍 तुरंत वि��्लेषण प्राप्त करें",
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
      cta: "अपनी क्रिएटर या���्रा अभी शुरू करें",
      ctaSubtext:
        "10,000+ क्रिएटर्स से जुड़ें जिन्होंने अपने जुनून को लाभ में बदला है",
    },
    successStories: {
      title: "क्रिएटर सफलता की कहानियां",
      subtitle: "अ���ली क्रिएटर्स, असली परिणाम, असली आय व��द्धि",
      stories: [
        {
          name: "अन���्या शर्मा",
          role: "ब्यूटी क्रिएटर",
          avatar: "अ",
          testimonial:
            "प्रोफेशनल मीडिया किट टेम्प्लेट का उपयोग करके, मैंने 2 सप्ताह के भीतर अपना पहला ब्रांड कोलैबोरेशन सुरक्षित किया। प्राइसिंग गाइड ने मुझे एक पोस्ट के लिए ₹35K नेगोसिएट करने में मदद की।",
          result: "+₹35K पहला ब्रांड डील",
        },
        {
          name: "विकाश मल्हो��्रा",
          role: "टेक रिव्यूअर",
          avatar: "वि",
          testimonial:
            "ग्रोथ स्ट्र��टेजी ने मुझे अपने ऑडिय��स को बेहतर समझने में मदद की। मैंने इनसाइट्स का उपयोग करके कंटेंट को ऑप्टिमाइज़ किया और 4 महीने में 5K से 25K फॉलोअर्स तक पहुँचा।",
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
      title: "अपने कंटेंट को निरंतर आय में बदलने के ल���ए तैयार हैं?",
      subtitle:
        "हजारों क्रिएटर्स से जुड़ें जिन्होंने हमारे सिद्ध फ्रेमवर्क का उपयोग करके सफल व्यवसाय बन���ए हैं",
      cta: "अपना मुफ्त क���रिएटर ��िट अभी प्राप्त करें",
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

const legalContent = {
  english: {
    about: {
      title: "📄 About FameChase",
      content: `FameChase helps aspiring influencers and creators unlock their growth potential. Whether you're just starting out or looking to turn your audience into income, we provide personalized insights, tools, and digital products to accelerate your journey.

With AI-powered reports, custom growth strategies, and creator kits designed for Indian and global platforms, we make it easier to grow, brand, and monetize your content—step by step.

Our mission is to make influencer success accessible, strategic, and profitable for creators of all levels.`,
    },
    contact: {
      title: "📬 Contact Us",
      content: `Have a question, feedback, or partnership inquiry? We're here to help!

📧 Email us at: mail@famechase.com
📍 Address: E- Block, 1406, Fusion Tower, GBN
📱 Mobile: 8009785785`,
    },
    privacy: {
      title: "🔒 Privacy Policy",
      content: `Effective Date: July 9, 2025

At FameChase, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.

1. What We Collect:
• Personal details (name, email) via forms or purchases
• Quiz responses to generate personalized results
• Device and usage data (via cookies or analytics tools)

2. How We Use It:
• To provide personalized growth plans
• To deliver downloadable content
• To improve our services and user experience
• To communicate updates and offers

3. Your Data Is Safe:
We never sell or share your data with third parties. All information is stored securely and used only for service delivery and improvement.

You can request deletion or correction of your data at any time by emailing mail@famechase.com.`,
    },
    terms: {
      title: "📜 Terms & Conditions (T&C) By Famechase.com",
      content: `Effective Date: July 9, 2025

By using FameChase.com, you agree to the following terms:

1. Use of Service:
Our services and digital downloads are for personal, non-commercial use. You may not redistribute, resell, or republish them.

2. Payments:
All purchases are final. Refunds are governed by our Refund Policy.

3. Intellectual Property:
All content, designs, and tools provided are the intellectual property of FameChase. Unauthorized use is prohibited.

4. Service Availability:
We reserve the right to modify or discontinue services (free or paid) at any time.

5. Contact:
For any questions, email us at mail@famechase.com

by famechase.com`,
    },
    refund: {
      title: "↩️ Refund Policy",
      content: `Effective Date: July 9, 2025

For digital products delivered instantly after purchase, we do not offer refunds.
If you were charged by mistake or have a billing concern, email mail@famechase.com within 7 days and we will review on a case-by-case basis.`,
    },
  },
  hindi: {
    about: {
      title: "📄 FameChase के बारे में",
      content: `FameChase इच्छुक इन्फ्लुएंसर्स और क्रिएटर्स को उनकी विकास क्षमता को अनलॉक करने में मदद करता है। चाहे आप अभी शुरुआत कर र��े हों या अपने ऑडियंस को आय में बदलना चाह रहे हों, हम आपकी यात्रा को तेज़ करने के लिए व्यक्तिगत अंतर्दृष्टि, टूल्स, और डिजिटल उत्पाद प्रदान करते हैं।

AI-powered रिपोर्ट्स, कस्टम ग्रोथ स्ट्रैटेजीज़, और भारतीय और वैश्विक प्लेटफॉर्म के लिए डिज़ाइन किए गए क्रिएटर किट्स के साथ, हम आपके कंटेंट को बढ़ने, ब्रांड करने, और मुद्रीकर�� करन����� को आसान बनाते हैं—चरणबद्ध तरीके से।

हमारा मिशन सभी स्तरों के क्रिएटर्स के लिए इन्फ्लुएंसर सफलता को सुलभ, रणनीतिक, और लाभदायक बनाना है।`,
    },
    contact: {
      title: "📬 संपर्क करें",
      content: `कोई प्रश्न, फीडबैक, या पार्टनरशिप पूछताछ है? हम मदद के लिए यहाँ हैं!

📧 हमें ईमेल करें: mail@famechase.com
📍 Address: E- Block, 1406, Fusion Tower, GBN
📱 Mobile: 8009785785`,
    },
    privacy: {
      title: "🔒 गोपनीयता नीति",
      content: `प्रभावी तिथि: 9 जुलाई, 2025

FameChase में, आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट और सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत��र, उपयोग, और सुरक्षित करते हैं।

1. हम क्या एकत्र करते हैं:
• फॉर्म या खरीदारी क��� माध्यम से व्यक्तिगत विवरण (नाम, ईमेल)
• व्यक्तिगत परिणाम उत्पन्न करने के लिए क्विज़ प्रतिक्रियाएं
• डिवाइस और उपयोग डेटा (कुकीज़ या एनालिटिक्स टूल्स के माध्यम से)

2. हम इसका उपयोग कैसे करते हैं:
• व्यक्तिगत विकास योजनाएं प्रदान करने के लिए
• डाउनलोड योग्य सामग्री वितरित करने के लिए
• हमारी सेवाओं और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए
• अपडेट्स और ऑफर्स संवाद करने के लिए

3. आपका डेटा सुरक्षित है:
हम कभी भी आपका डेटा तीसरे पक्ष क�� न���ीं बेचते या साझा नहीं करते। सभी जानकारी सुरक्षित रूप से स���ग्रहीत की जाती ��ै और केवल सेवा वितरण और सुधार के लिए उपयोग की जाती है।

आप mail@famechase.com पर ईमेल करके किसी भी समय अपने डेटा को हटाने या सुधारने का अनुरोध कर सकते हैं।`,
    },
    terms: {
      title: "📜 नियम और शर्तें (T&C)",
      content: `प्रभावी तिथि: 9 जुलाई, 2025

FameChase.com का उपयोग करके, आप निम्नलिखित शर्तों से सहमत हैं:

1. सेवा का उपयोग:
हमारी सेवाएं और डिजिटल डाउनलोड व्यक्तिगत, गैर-व्यावसायिक उपयोग के लिए हैं। आप उन्हें पुनर्वितरित, पुनर्विक्रय, या पुनर्प्रकाशित नहीं कर सकते।

2. भुगतान:
सभी ��रीदारी अंतिम हैं। रिफंड हमारी रिफंड नीति द्वारा नियंत्रित हैं।

3. बौद्धिक संपदा:
प्रदान की गई सभी सामग्री, डिज़ाइन, और टूल्स FameChase की बौद्धिक ���ंपदा हैं। अनधिकृत उपयोग निषिद्ध है।

4. सेवा उपलब्धता:
हम किसी भी समय सेवाओं (मुफ्त या पेड) को संशोधित या बंद करने का अधिकार सुरक्षित रखते हैं।

5. संपर्क:
किसी भी प्रश्न के लिए, हमें mail@famechase.com पर ईमेल करें

by famechase.com`,
    },
    refund: {
      title: "↩️ रिफंड नीति",
      content: `प्रभावी तिथि: 9 जुलाई, 2025

डिजिटल उत्पाद जो खरीद के बाद तुरंत दिए जाते हैं, उनके लिए हम रिफंड प्रदान नहीं करते।
यदि आपसे ��लत�� से शुल्क लिया गया है या बिलिंग संबंधी कोई चिंता है, तो 7 दिनों के भीतर mail@famechase.com पर ईमेल करें — हम मामले-दर-मामला स���ीक्षा करेंगे।`,
    },
  },
};

import { sanitizeDeep } from "@/lib/sanitize";

export default function Index() {
  const [language, setLanguage] = useState<"english" | "hindi">(() => {
    const saved = localStorage.getItem("famechase-language") as
      | "english"
      | "hindi";
    return saved || "english";
  });
  const [showLegalModal, setShowLegalModal] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(true);

  // Check if promo should be shown (within 45 days)
  useEffect(() => {
    const promoStartDate = localStorage.getItem("famechase-promo-start-date");

    if (!promoStartDate) {
      // First time - set the start date
      localStorage.setItem(
        "famechase-promo-start-date",
        new Date().toISOString(),
      );
      setShowPromo(true);
    } else {
      // Check if 45 days have passed
      const startDate = new Date(promoStartDate);
      const currentDate = new Date();
      const daysPassed = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysPassed >= 45) {
        setShowPromo(false);
      } else {
        setShowPromo(true);
      }
    }
  }, []);

  // Sanitize translations to remove stray symbols
  const t = sanitizeDeep(translations[language]);
  const legal = legalContent[language];

  const handleLanguageChange = (newLanguage: "english" | "hindi") => {
    setLanguage(newLanguage);
    localStorage.setItem("famechase-language", newLanguage);
  };

  const openLegalModal = (type: string) => {
    setShowLegalModal(type);
  };

  const closeLegalModal = () => {
    setShowLegalModal(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 bg-white border-b border-gray-100 sticky top-0 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            FameChase<span className="text-neon-green">.com</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/quiz"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              {t.header.takeQuiz}
            </Link>
            <Link
              to="/shop"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              {t.header.shop}
            </Link>
            <Link
              to="/quiz"
              className="bg-neon-green text-black px-6 py-2 rounded-full font-semibold hover:bg-green-400 transition-colors"
            >
              {t.header.getStartedFree}
            </Link>
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) =>
                handleLanguageChange(e.target.value as "english" | "hindi")
              }
              className="bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
            </select>
          </nav>
        </div>
      </header>

      {/* Launch Promo Banner */}
      {showPromo && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="container mx-auto relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                {t.promo.message}
              </h3>
              <p className="text-sm md:text-base opacity-90">
                {t.promo.subtitle}
              </p>
            </div>
            <button
              onClick={() => setShowPromo(false)}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              aria-label="Close promo banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-neon-green/10 border border-neon-green/30 rounded-full px-6 py-3 mb-8">
            <span className="text-neon-green text-sm font-semibold">
              {t.hero.badge}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {t.hero.title}
            {t.hero.titleHighlight && (
              <>
                <br />
                <span className="inline-block lg:inline bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent mt-[11px] lg:mt-0">
                  {t.hero.titleHighlight}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Proof Points */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {t.hero.proofPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm border"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-medium">{point}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/quiz"
              className="bg-gradient-to-r from-neon-green to-green-400 text-black font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/shop"
              className="bg-white border-2 border-electric-blue text-electric-blue font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-electric-blue hover:text-white hover:shadow-lg"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </main>

      {/* What You Get Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.whatYouGet.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-neon-green">
                {t.whatYouGet.title.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.whatYouGet.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Deliverable 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border">
              <div className="w-16 h-16 bg-neon-green/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t.whatYouGet.deliverables.fameScore.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.whatYouGet.deliverables.fameScore.description}
              </p>
              <div className="text-neon-green font-semibold">
                {t.whatYouGet.deliverables.fameScore.badge}
              </div>
            </div>

            {/* Free Deliverable 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border">
              <div className="w-16 h-16 bg-electric-blue/10 rounded-xl flex items-center justify-center mb-6">
                <Download className="w-8 h-8 text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t.whatYouGet.deliverables.mediaKit.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.whatYouGet.deliverables.mediaKit.description}
              </p>
              <div className="text-electric-blue font-semibold">
                {t.whatYouGet.deliverables.mediaKit.badge}
              </div>
            </div>

            {/* Free Deliverable 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border">
              <div className="w-16 h-16 bg-soft-violet/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-soft-violet" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t.whatYouGet.deliverables.growthStrategy.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.whatYouGet.deliverables.growthStrategy.description}
              </p>
              <div className="text-soft-violet font-semibold">
                {t.whatYouGet.deliverables.growthStrategy.badge}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.howItWorks.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-neon-green">
                {t.howItWorks.title.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {t.howItWorks.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-neon-green to-green-400 rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto shadow-lg">
                      {step.number}
                    </div>
                    {index < t.howItWorks.steps.length - 1 && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-neon-green to-electric-blue hidden md:block md:w-32 md:left-full"></div>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {t.howItWorks.cta}
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-gray-500 mt-4">{t.howItWorks.ctaSubtext}</p>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.successStories.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-neon-green">
                {t.successStories.title.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.successStories.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.successStories.stories.map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                    {story.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {story.name}
                    </div>
                    <div className="text-gray-600 text-sm">{story.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{story.testimonial}"</p>
                <div className="text-neon-green font-semibold">
                  {story.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-neon-green/10 via-electric-blue/10 to-soft-violet/10">
        <div className="container mx-auto px-4 text-center">
          {language === "hindi" ? (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.finalCta.title}
            </h2>
          ) : (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.finalCta.title.split("Consistent")[0]}
              <br />
              <span className="bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
                Consistent Income?
              </span>
            </h2>
          )}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t.finalCta.subtitle}
          </p>

          <div className="mb-8">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-6 px-12 rounded-full text-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {t.finalCta.cta}
              <ArrowRight className="w-8 h-8" />
            </Link>
          </div>

          <div className="text-gray-600">{t.finalCta.benefits.join(" • ")}</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-gray-900 mb-4">
              FameChase<span className="text-neon-green">.com</span>
            </div>
            <p className="text-gray-600 mb-6">{t.footer.description}</p>

            {/* Navigation Links */}
            <div className="flex justify-center gap-8 mb-6">
              <Link to="/quiz" className="text-gray-600 hover:text-gray-900">
                {t.footer.links[0]}
              </Link>
              <Link to="/shop" className="text-gray-600 hover:text-gray-900">
                {t.footer.links[1]}
              </Link>
              <Link to="/results" className="text-gray-600 hover:text-gray-900">
                {t.footer.links[2]}
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              <button
                onClick={() => openLegalModal("about")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                {t.footer.legal.about}
              </button>
              <button
                onClick={() => openLegalModal("contact")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                {t.footer.legal.contact}
              </button>
              <button
                onClick={() => openLegalModal("privacy")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                {t.footer.legal.privacy}
              </button>
              <button
                onClick={() => openLegalModal("refund")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                {t.footer.legal.refund}
              </button>
              <button
                onClick={() => openLegalModal("terms")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                {t.footer.legal.terms}
              </button>
            </div>

            <p className="text-gray-500 text-sm">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {legal[showLegalModal as keyof typeof legal]?.title}
              </h3>
              <button
                onClick={closeLegalModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
              {legal[showLegalModal as keyof typeof legal]?.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
