import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  ChevronDown,
  Twitter,
  Star,
  Target,
  TrendingUp,
  CheckCircle,
  Sparkles,
  User,
  Mail,
  MapPin,
  Calendar,
  Download,
  Home,
  FileText,
  Layout,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sanitizeDeep } from "@/lib/sanitize";
import { downloadFile } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuizData {
  name: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  primaryPlatform: string;
  secondaryPlatforms: string[];
  followerCount: string;
  niche: string;
  contentType: string;
  postingFrequency: string;
  experience: string[];
  monthlyIncome: string;
  biggestChallenge: string[];
  goals: string[];
  socialLinks: {
    instagram: string;
    youtube: string;
    linkedin: string;
    website: string;
    twitter: string;
    tiktok: string;
  };
  bio: string;
  language: string;
  engagementRate: string;
}

const initialQuizData: QuizData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  primaryPlatform: "",
  secondaryPlatforms: [],
  followerCount: "",
  niche: "",
  contentType: "",
  postingFrequency: "",
  experience: [],
  monthlyIncome: "",
  biggestChallenge: [],
  goals: [],
  socialLinks: {
    instagram: "",
    youtube: "",
    linkedin: "",
    website: "",
    twitter: "",
    tiktok: "",
  },
  bio: "",
  language: "english",
  engagementRate: "",
};

const languages = {
  english: {
    title: "Creator Success Quiz",
    subtitle: "Get your personalized growth strategy in 3 minutes",
    steps: {
      1: "Platform & Followers",
      2: "Follower Count",
      3: "Other Platforms",
      4: "Content Niche",
      5: "Content Type",
      6: "Posting Frequency",
      7: "Experience",
      8: "Income",
      9: "Biggest Challenge",
      10: "Goals",
      11: "Social Links",
      12: "Engagement Rate",
      13: "Contact Info",
    },
    questions: {
      name: "What's your name?",
      email: "What's your email address?",
      phone: "What's your phone number? (Optional)",
      city: "Which city are you from?",
      primaryPlatform: "What's your primary content platform?",
      followerCount: "How many followers do you have on your primary platform?",
      secondaryPlatforms:
        "Which other platforms do you use? (Select all that apply)",
      niche: "What's your content niche?",
      contentType: "What type of content do you create?",
      postingFrequency: "How often do you post content?",
      experience:
        "How long have you been creating content? (Select all levels you've experienced)",
      monthlyIncome: "What's your current monthly income from content?",
      biggestChallenge:
        "What are your biggest challenges as a creator? (Select max 3)",
      goals: "What are your main goals for the next 6 months? (Select max 3)",
      socialLinks: "Share Your Social Presence (Optional)",
      bio: "Anything more about yourself and your content (optional)",
      engagementRate:
        "What's your average engagement rate? (Average Engagement Rate = (Total Likes + Comments + Shares) ÷ Total Followers × 100)",
    },
    options: {
      platforms: [
        "Instagram",
        "YouTube",
        "LinkedIn",
        "TikTok",
        "Twitter",
        "Facebook",
        "Website/Blog",
      ],
      followerRanges: [
        "Less than 1K",
        "1K - 5K",
        "5K - 10K",
        "10K - 50K",
        "50K - 100K",
        "100K - 500K",
        "500K+",
      ],
      niches: [
        "Fashion & Beauty",
        "Technology & AI",
        "Food & Cooking",
        "Travel & Adventure",
        "Fitness & Health",
        "Personal Finance & Investing",
        "Entertainment & Comedy",
        "Entrepreneurship & Business",
        "Lifestyle & Wellness",
        "Art & Design",
        "Gaming & Esports",
        "Music & Dance",
        "Education & Learning",
        "Sports & Athletics",
        "Motivation & Self-Help",
        "Parenting & Family",
        "DIY & Crafts",
        "Spirituality & Mindfulness",
        "Other",
      ],
      contentTypes: [
        "Photos & Carousels",
        "Short Videos/Reels",
        "Long-form Videos",
        "Live Streams",
        "Stories",
        "Written Posts",
        "Podcasts",
        "Mixed Content",
      ],
      frequencies: [
        "Daily",
        "3-4 times a week",
        "Weekly",
        "2-3 times a month",
        "Monthly",
        "Irregular",
      ],
      experiences: [
        "Just started (0-6 months)",
        "Beginner (6 months - 1 year)",
        "Growing (1-2 years)",
        "Experienced (2-3 years)",
        "Expert (3+ years)",
      ],
      incomes: [
        "₹0 (No income yet)",
        "₹1K–5K",
        "₹5K–15K",
        "₹15K–30K",
        "₹30K–50K",
        "₹50K–1L",
        "₹1L+",
      ],
      challenges: [
        "🔄 Growth & Engagement: Low views & inconsistent engagement",
        "🧠 Growth & Engagement: Staying relevant with fast-moving trends",
        "🔁 Growth & Engagement: Algorithm changes killing reach",
        "🧍‍♀️ Growth & Engagement: Competing with bigger creators",
        "🗣️ Brand & Identity: Struggling to find my unique voice/style",
        "🤝 Brand & Identity: Balancing authenticity with brand appeal",
        "🌱 Brand & Identity: Building a real, connected community",
        "💔 Monetization & Scaling: Can't convert followers into paying customers",
        "🤝 Monetization & Scaling: Not landing brand collaborations",
        "📊 Monetization & Scaling: Confused by analytics & metrics",
        "🥵 Creator Wellness: Burnout & content fatigue",
        "💬 Creator Wellness: Handling trolls/negativity",
        "📱 Creator Wellness: Managing too many platforms at once",
      ],
      goals: [
        "Reach 10K / 50K / 100K+ Followers",
        "Earn ₹25K / ₹50K / ₹1L+ per month",
        "Get Brand Collaborations",
        "Build Personal Brand",
        "Create Viral Content",
        "Post More Consistently",
        "Expand to New Platforms",
      ],
      engagementRates: [
        "Less than 1%",
        "1-3%",
        "3-5%",
        "5-8%",
        "8-12%",
        "More than 12%",
        "I don't know",
      ],
    },
    buttons: {
      next: "Next Step",
      back: "Previous",
      submit: "Get My Creator Analysis",
    },
    freeResources: {
      title: "🎉 Quiz Complete! Here are your FREE Creator Resources",
      subtitle:
        "Download these powerful tools to kickstart your creator journey",
      mediaKit: {
        title: "Professional Media Kit Template",
        description: "Create stunning media kits that brands will love",
      },
      emailTemplates: {
        title: "Brand Outreach Email Templates",
        description: "30+ proven email templates for brand partnerships",
      },
      growthGuide: {
        title: "90-Day Growth Strategy Guide",
        description: "Step-by-step roadmap to grow your following",
      },
      downloadFree: "Download Free",
    },
  },
  hindi: {
    title: "���्रिएटर सक्सेस क्विज़",
    subtitle: "3 मिनट में अपनी व्यक्तिगत ग्रोथ रणनीति पाएं",
    steps: {
      1: "बुन��यादी जानकारी",
      2: "प��लेटफॉर्म और फॉलोअर्स",
      3: "कंटेंट निच",
      4: "कंटेंट प्रकार",
      5: "पोस्टिंग आवृत्ति",
      6: "अनुभव और आय",
      7: "सबसे बड़ी च��नौती",
      8: "लक्ष्य",
      9: "सोशल लिंक्स",
      10: "एंगेजमेंट रेट",
    },
    questions: {
      name: "आपका नाम क्या है?",
      email: "आपका ईमेल पता क्या है?",
      phone: "आपका फोन नंबर क्या है? (वैकल्पिक)",
      city: "आप किस शहर से हैं?",
      primaryPlatform: "आप मुख्यतः किस प्लेटफॉर्म पर कं��ेंट बन���ते हैं?",
      followerCount: "��पके प्राथमिक प��लेटफॉर्�� पर कितने फॉलोअर्स हैं?",
      secondaryPlatforms:
        "आप और ��ौन से प्लेटफॉर्म का उपयोग करते हैं? (कई विकल्प ���ुनें)",
      niche: "आपका कंटें�� किस विषय पर है?",
      contentType: "आप किस प्रकार का कंटेंट बना��े है���?",
      postingFrequency: "आप कितनी बार कंटेंट पोस्ट करते हैं?",
      experience:
        "आप कितने समय से कंटेंट बना रहे हैं? (सभी स्तर चुनें जिनका आपने अनुभव किया है)",
      monthlyIncome: "कंटेंट से आपकी वर्तमान मासिक आय क्या है?",
      engagementRate:
        "आपका औसत एंगेजमेंट रेट क्या है? (औसत एंगेजमेंट रेट = (कुल लाइक + कमेंट + शेयर) ÷ कुल फॉलोअर्�� × 100)",
      biggestChallenge:
        "आपकी सबसे बड़ी चुनौती क्य��� है? 3 तक चुनें – हम सब इसमें एक साथ हैं! आपकी परेशानियों को समझना हमें बेहतर समाधान देने में मदद करता है।",
      goals: "आपके अगले 6 महीने के मुख्य लक्ष्य क्या हैं? (अधिकत��� 3 चुनें)",
      socialLinks: "अपन��� स��शल उपस्थिति साझा करें (वैकल्पिक)",
      bio: "अपने और अपने क��टेंट ���े बारे में कुछ और बताएं (वैकल्पिक)",
    },
    options: {
      platforms: [
        "इंस्टाग्राम",
        "यूट्यूब",
        "लिंक्डइन",
        "टिकटॉक",
        "ट्विटर",
        "फेसबुक",
        "वेबसाइट/ब्लॉग",
      ],
      followerRanges: [
        "1K से कम",
        "1K - 5K",
        "5K - 10K",
        "10K - 50K",
        "50K - 100K",
        "100K - 500K",
        "500K+",
      ],
      niches: [
        "फैशन और ब्यूटी",
        "टेक्नोलॉजी और AI",
        "खाना और खाना बनाना",
        "यात्रा और एड��ेंचर",
        "फिटनेस और स्वास्थ्य",
        "व्यक्तिगत वित्त ��र निवेश",
        "मनोरंजन और कॉमेडी",
        "उद्यमिता और व्यापार",
        "जीवनशैली और कल्याण",
        "कला और डिज़ाइन",
        "गेमिंग और ईस्पोर्ट्स",
        "संगीत ��र नृत्य",
        "शिक्षा और सीखना",
        "ख���ल और एथलेटिक्स",
        "प्रेरणा और स्व-सह��यता",
        "पेरेंटिंग और परिवार",
        "DIY और शिल्प",
        "आध्यात्म और माइंडफुलनेस",
        "अन्य",
      ],
      engagementRates: [
        "1% से कम",
        "1-3%",
        "3-5%",
        "5-8%",
        "8-12%",
        "12% से अधिक",
        "मुझे नहीं पता",
      ],
      contentTypes: [
        "फोटो और करोसेल",
        "छोटे वीडियो/रील्स",
        "लंबे वीडि���ो",
        "लाइव स्ट्रीम",
        "स्टोरीज़",
        "लिखित पोस्ट",
        "पॉडकास्ट",
        "मिश्रित कंटेंट",
      ],
      frequencies: [
        "रोज़ाना",
        "सप्ताह ���ें 3-4 बार",
        "साप्ताहिक",
        "महीने में 2-3 बार",
        "मासिक",
        "अनियमित",
      ],
      experiences: [
        "अभी शुर�� किया (0-6 महीने)",
        "शुरुआती (6 महीने - 1 साल)",
        "बढ़ रहे हैं (1-2 साल)",
        "अनुभवी (2-3 साल)",
        "विशेषज्ञ (3+ साल)",
      ],
      incomes: [
        "₹0 (अभी तक कोई आय नहीं)",
        "₹1K–5K",
        "₹5K–15K",
        "₹15K–30K",
        "₹30K–50K",
        "₹50K–1L",
        "₹1L+",
      ],
      challenges: [
        "🔄 ग्रोथ और एंगेजमेंट: व्यूज़ कम और एंगेजमेंट अनियमित",
        "🧠 ग्रोथ और ए���गेजमेंट: तेज़ बदलते ट्रेंड्स के साथ प्रासंगिक बने रहना",
        "🔁 ग्रोथ और एंगेजमेंट: एल्गोरिदम बदलाव से रीच कम हो जाना",
        "🧍‍♀️ ग्रोथ और एंगेजमेंट: बड़े क्रिएटर्स से प्रतिस्पर्धा करना",
        "🗣️ ब्रांड और पहचान: अपनी यूनिक आवाज़/स्टाइल तय करने में मुश्किल",
        "🤝 ब्रांड और पहचान: प्रामाणिकता और ब्रांड अपील के बीच संतुलन बनाना",
        "🌱 ब्रांड और पहचान: सच्ची, जुड़ी हुई कम्युनिटी बनाना",
        "💔 मोनेटाइज़ेशन और स्केलिंग: फॉलोअर्स को पेड कस्टमर में नहीं बदल पाना",
        "🤝 मोनेटाइज़ेशन और स्केलिंग: ब्रांड कोलैबोरेशन्स न मिलना",
        "📊 मोनेटाइज़ेशन और स्केलिंग: एनालिटिक्स और मेट्रिक्स समझने में उलझन",
        "🥵 क्रिएटर वेलनेस: बर्नआउट और कंटेंट थकान",
        "💬 क्रिएटर वेलनेस: ट्रोल्स/नेगेटिविटी से निपटना",
        "📱 क्रिएटर वेलनेस: एक साथ कई प्लेटफॉर्म संभालना",
      ],
      goals: [
        "10K / 50K / 100K+ फॉलोअर्स तक पहुँचना",
        "₹25K / ₹50K / ₹1L+ मासिक कमाई करना",
        "ब्रांड सहयोग प्राप्त करना",
        "अपना पर्सनल ब्रांड बनाना",
        "वायरल कंटेंट बनाना",
        "ज़्यादा नियमित रूप से पोस्ट करना",
        "नए प्लेटफॉर्म तक विस्तार करना",
      ],
    },
    buttons: {
      next: "अगला कदम",
      back: "पिछला",
      submit: "मेरा क्रिएटर विश्लेषण पाएं",
    },
    freeResources: {
      title: "🎉 क्विज़ पूरा! यहाँ हैं आपके मुफ्त क्रिएटर संसाधन",
      subtitle:
        "अपनी क्रिएटर यात्रा शुरू करने के लिए इन शक्तिशाली टूल्स को डाउनलो�� करें",
      mediaKit: {
        title: "प्रोफेशनल मीडिया किट टेम्प्लेट",
        description: "आक���्षक मीडिया किट बनाएं जो ब्रांड्स को पसंद आएंगे",
      },
      emailTemplates: {
        title: "ब्रांड आउटरीच ईमेल टेम्प्लेट्स",
        description: "ब्रांड पार्टनरशिप के लिए 30+ सिद्ध ईमेल टे��्प्लेट्स",
      },
      growthGuide: {
        title: "90-दिन की ग्रोथ स्ट्रैटेजी गाइड",
        description: "अपनी फॉलोइंग बढ़ाने के लिए स्टेप-बाई-स्टे�� ���ोडमैप",
      },
      downloadFree: "मुफ्त डाउनलोड करें",
    },
  },
};

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFreeResources, setShowFreeResources] = useState(false);
  const navigate = useNavigate();
  const quizContentRef = useRef<HTMLDivElement>(null);
  const [platforms, setPlatforms] = useState<string[]>(
    languages[language].options.platforms,
  );

  const t = sanitizeDeep(languages[language]);
  const totalSteps = 20;

  // Save language preference and update quiz data when language changes
  useEffect(() => {
    localStorage.setItem("famechase-language", language);
    setQuizData((prev) => ({ ...prev, language: language }));
    setPlatforms(languages[language].options.platforms);
  }, [language]);

  const [dnaReport, setDnaReport] = useState<File | null>(null);
  const [dnaOption, setDnaOption] = useState<string>("");

  // Try loading platform options from API with graceful fallback
  useEffect(() => {
    let aborted = false;
    (async () => {
      const sources = ["/api/platforms", "/platforms.json"];
      for (const url of sources) {
        try {
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) continue;
          const contentType = res.headers.get("content-type") || "";
          let data: any = null;
          if (contentType.includes("application/json")) {
            data = await res.json();
          } else {
            const text = await res.text();
            try {
              data = JSON.parse(text);
            } catch {
              continue;
            }
          }
          const list = Array.isArray(data)
            ? data
            : Array.isArray((data as any).platforms)
              ? (data as any).platforms
              : null;
          if (!aborted && list && list.length) {
            setPlatforms(list.map(String));
            return;
          }
        } catch {
          // ignore and fall back
        }
      }
    })();
    return () => {
      aborted = true;
    };
  }, [language]);

  // Scroll behaviors
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    if (showFreeResources) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showFreeResources]);

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  // Challenge category selections (Step 9)
  const [challengeSelections, setChallengeSelections] = useState<
    Record<string, string>
  >({});

  const challengeGroups = (() => {
    const groups: Record<string, string[]> = {
      "Growth & Engagement": [],
      "Brand & Identity": [],
      "Monetization & Scaling": [],
      "Creator Wellness": [],
    };
    const list = languages[language].options.challenges as string[];
    list.forEach((c) => {
      const parts = c.split(": ");
      if (parts.length >= 2) {
        const head = parts[0].replace(/^.*?\s/, "").trim(); // remove emoji
        const item = parts.slice(1).join(": ");
        if (groups[head]) groups[head].push(item);
      }
    });
    return groups;
  })();

  useEffect(() => {
    // Initialize selections from existing data if present
    if (quizData.biggestChallenge && quizData.biggestChallenge.length) {
      const next: Record<string, string> = {};
      quizData.biggestChallenge.forEach((full) => {
        const parts = full.split(": ");
        if (parts.length >= 2) {
          const head = parts[0].replace(/^.*?\s/, "").trim();
          const item = parts.slice(1).join(": ");
          if (challengeGroups[head]) next[head] = item;
        }
      });
      setChallengeSelections(next);
    }
  }, [language]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quizData.primaryPlatform;
      case 2:
        return quizData.followerCount;
      case 3:
        return quizData.secondaryPlatforms.length > 0;
      case 4:
        return quizData.niche;
      case 5:
        return quizData.contentType;
      case 6:
        return quizData.postingFrequency;
      case 7:
        return quizData.experience.length > 0;
      case 8:
        return quizData.monthlyIncome;
      case 9:
        return true;
      case 10:
        return quizData.goals.length > 0;
      case 11:
        return true;
      case 12:
        return quizData.engagementRate;
      case 13:
        return quizData.name && quizData.email && quizData.city;
      case 20:
        if (dnaOption === "upload") return !!dnaReport;
        return !!dnaOption;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        if (quizContentRef.current) {
          quizContentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else if (currentStep === totalSteps) {
      setShowFreeResources(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        if (quizContentRef.current) {
          quizContentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const finalQuizData = { ...quizData, language };
      localStorage.setItem("fameChaseQuizData", JSON.stringify(finalQuizData));

      try {
        await fetch("/api/user-analytics/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizData: finalQuizData }),
        });
      } catch (apiErr) {
        console.warn("Quiz data API save failed (non-blocking):", apiErr);
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase
            .from("users")
            .upsert([{
              name: quizData.name,
              email: quizData.email,
              phone: quizData.phone || null,
              city: quizData.city,
              niche: quizData.niche,
              primary_platform: quizData.primaryPlatform,
              follower_count: quizData.followerCount,
              goals: quizData.goals,
              quiz_data: finalQuizData,
            }], { onConflict: "email" })
            .select();
        } catch (e) {
          console.warn("Supabase save failed (non-blocking):", e);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/results");
      window.scrollTo({ top: 0, behavior: "auto" });
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      navigate("/results");
      window.scrollTo({ top: 0, behavior: "auto" });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSecondaryPlatform = (platform: string) => {
    const selected = quizData.secondaryPlatforms.includes(platform)
      ? quizData.secondaryPlatforms.filter((p) => p !== platform)
      : [...quizData.secondaryPlatforms, platform];
    updateQuizData("secondaryPlatforms", selected);
  };

  const generateDownload = async (type: string, fileName: string) => {
    let content = "";
    const userName = quizData.name || "Creator";
    const fontSizeIndicator = `\n=== DISPLAY INSTRUCTIONS ===\nIMPORTANT: Set Font Size to 18-22pt for comfortable reading\nPlease zoom to 150-200% or increase font size in your viewer\nThis content is optimized for larger text display for better readability\n========================================================\n\n`;

    if (type === "mediaKit") {
      content =
        fontSizeIndicator +
        `${language === "hindi" ? "मीडिया किट" : "MEDIA KIT"} - ${userName}\n\n${language === "hindi" ? "व्यक्तिगत जानकारी:" : "PERSONAL INFO:"}\n${language === "hindi" ? "नाम:" : "Name:"} ${userName}\n${language === "hindi" ? "निच:" : "Niche:"} ${quizData.niche}\n${language === "hindi" ? "प्लेटफॉ���्म:" : "Platform:"} ${quizData.primaryPlatform}\n${language === "hindi" ? "फॉलोअर्स:" : "Followers:"} ${quizData.followerCount}`;
    } else if (type === "emailTemplates") {
      content = fontSizeIndicator + `Email Templates - ${userName}`;
    } else if (type === "growthStrategy") {
      content = fontSizeIndicator + `Growth Strategy - ${userName}`;
    }

    await downloadFile(content, fileName);
  };

  if (showFreeResources) {
    return (
      <div className="min-h-screen bg-white">
        <header className="relative z-10 px-4 py-6 bg-white border-b border-gray-100 sticky top-0 backdrop-blur-sm">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-lg font-bold text-gray-900">
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
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-green to-electric-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.freeResources.title}
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {t.freeResources.subtitle}
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-neon-green transition-colors relative">
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  FREE STARTER
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Basic Media Kit Template
                </h3>
                <p className="text-gray-600 mb-4">
                  Simple media kit template with basic stats and contact info -
                  perfect for getting started
                </p>
                <div className="text-sm text-green-600 mb-4">
                  ✓ Professional template format
                  <br />✓ Industry-standard rate suggestions
                  <br />✓ Easy customization fields
                  <br />✓ Multi-platform rate structure
                </div>
                <button
                  onClick={() =>
                    void generateDownload(
                      "mediaKit",
                      `${quizData.name || "Creator"}_Basic_Media_Kit_${language}.pdf`,
                    )
                  }
                  className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  {t.freeResources.downloadFree}
                </button>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-neon-green transition-colors relative">
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  FREE STARTER
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Basic Email Templates (6)
                </h3>
                <p className="text-gray-600 mb-4">
                  Essential outreach templates to get you started with brand
                  partnerships
                </p>
                <div className="text-sm text-green-600 mb-4">
                  ✓ 6 proven email templates
                  <br />✓ Professional follow-up sequences
                  <br />✓ Ready-to-use pitch formats
                  <br />✓ Brand outreach best practices
                </div>
                <button
                  onClick={() =>
                    void generateDownload(
                      "emailTemplates",
                      `Basic_Email_Templates_${language}.pdf`,
                    )
                  }
                  className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  {t.freeResources.downloadFree}
                </button>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-neon-green transition-colors relative">
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  FREE STARTER
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Basic Growth Guide (30-Day)
                </h3>
                <p className="text-gray-600 mb-4">
                  Simple 30-day action plan to get you started on your growth
                  journey
                </p>
                <div className="text-sm text-green-600 mb-4">
                  ✓ Comprehensive 30-day action plan
                  <br />✓ Proven growth strategies
                  <br />✓ Daily actionable tasks
                  <br />✓ Progress tracking templates
                </div>
                <button
                  onClick={() =>
                    void generateDownload(
                      "growthStrategy",
                      `Basic_Growth_Guide_${language}.pdf`,
                    )
                  }
                  className="w-full bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  {t.freeResources.downloadFree}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === "hindi"
                  ? "अपना पूरा विश्लेषण चाहते हैं?"
                  : "Want Your Complete Analysis?"}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === "hindi"
                  ? "व्य��्तिगत SWOT विश्लेषण, ग्रोथ रणनीति, और प्रीमियम टूल्स के साथ अपनी क्रिएटर यात्रा को तेज़ी से आगे बढ़ाएं।"
                  : "Get personalized SWOT analysis, growth strategy, and premium tools to accelerate your creator journey."}
              </p>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-neon-green to-electric-blue text-black font-bold py-4 px-8 rounded-xl text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                {t.buttons.submit}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-10 px-2 md:px-4 py-3 md:py-4 bg-white border-b border-gray-100 sticky top-0 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-base md:text-lg font-bold text-gray-900">
            FameChase<span className="text-neon-green">.com</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/"
              className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
            >
              <Home className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "english" | "hindi")
              }
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-medium"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
            </select>
          </div>
        </div>
      </header>

      <main
        ref={quizContentRef}
        className="container mx-auto px-2 md:px-4 pt-1 pb-32"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-2 md:mb-3">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              {t.title}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 leading-relaxed px-2">
              {t.subtitle}
            </p>
            <div className="flex justify-center gap-3 mt-3">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-neon-green animate-pulse" />
              <Star className="w-4 h-4 md:w-6 md:h-6 text-electric-blue animate-pulse" />
              <Target className="w-4 h-4 md:w-6 md:h-6 text-soft-violet animate-pulse" />
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 md:px-8 pt-3 md:pt-6 pb-6 shadow-xl backdrop-blur-sm flex flex-col gap-3 mb-8">
            <div className="text-xs md:text-sm text-gray-500 mb-2">
              Step {currentStep} of {totalSteps}
            </div>
            {isGenerating && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-neon-green to-electric-blue rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Generating Your Creator Analysis...
                </h2>
                <p className="text-gray-600">
                  Our AI is analyzing your responses and creating your
                  personalized toolkit
                </p>
              </div>
            )}

            {!isGenerating && (
              <>
                {currentStep === 1 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Globe className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        Your Main Platform
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        Where do you create and share your content?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.primaryPlatform}
                      </label>
                      <select
                        value={quizData.primaryPlatform}
                        onChange={(e) =>
                          updateQuizData("primaryPlatform", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-electric-blue focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your primary platform</option>
                        {platforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        Your Audience Size
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        How many followers do you currently have?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.followerCount}
                      </label>
                      <select
                        value={quizData.followerCount}
                        onChange={(e) =>
                          updateQuizData("followerCount", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-electric-blue focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your follower count</option>
                        {t.options.followerRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Layout className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        Other Platforms
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        Which other platforms do you use?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.secondaryPlatforms}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(platforms.length
                          ? platforms
                          : languages[language].options.platforms
                        ).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => toggleSecondaryPlatform(platform)}
                            className={`p-2 md:p-3 rounded-lg border-2 text-xs md:text-sm font-medium transition-all duration-300 ${
                              quizData.secondaryPlatforms.includes(platform)
                                ? "bg-gradient-to-r from-neon-green/10 to-electric-blue/10 border-neon-green text-gray-900 shadow-lg"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Content Niche */}
                {currentStep === 4 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        Your Content Niche 🎯
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        What topics do you create content about?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.niche}
                      </label>
                      <select
                        value={quizData.niche}
                        onChange={(e) =>
                          updateQuizData("niche", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-soft-violet focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your niche</option>
                        {t.options.niches.map((niche: string) => (
                          <option key={niche} value={niche}>
                            {niche}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 5: Content Type */}
                {currentStep === 5 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        Content Format 🎥
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        What type of content do you primarily create?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.contentType}
                      </label>
                      <select
                        value={quizData.contentType}
                        onChange={(e) =>
                          updateQuizData("contentType", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-electric-blue focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your content type</option>
                        {t.options.contentTypes.map((type: string) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 6: Posting Frequency */}
                {currentStep === 6 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        Posting Schedule ⏰
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        How often do you share new content?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.postingFrequency}
                      </label>
                      <select
                        value={quizData.postingFrequency}
                        onChange={(e) =>
                          updateQuizData("postingFrequency", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-electric-blue focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your posting frequency</option>
                        {t.options.frequencies.map((freq: string) => (
                          <option key={freq} value={freq}>
                            {freq}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 7: Experience */}
                {currentStep === 7 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        Your Creator Journey 🚀
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        How long have you been creating content?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.experience}
                      </label>
                      <select
                        value={quizData.experience[0] || ""}
                        onChange={(e) =>
                          updateQuizData(
                            "experience",
                            e.target.value ? [e.target.value] : [],
                          )
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-soft-violet focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your experience level</option>
                        {t.options.experiences.map((exp: string) => (
                          <option key={exp} value={exp}>
                            {exp}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 8: Monthly Income */}
                {currentStep === 8 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        Current Income 💰
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        What's your current monthly income from content
                        creation?
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.monthlyIncome}
                      </label>
                      <select
                        value={quizData.monthlyIncome}
                        onChange={(e) =>
                          updateQuizData("monthlyIncome", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-soft-violet focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your monthly income</option>
                        {t.options.incomes.map((income: string) => (
                          <option key={income} value={income}>
                            {income}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 9: Biggest Challenge (1 per head) */}
                {currentStep === 9 && (
                  <div className="space-y-6">
                    <div className="text-center mb-2 md:mb-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        {t.questions.biggestChallenge}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        {language === "hindi"
                          ? "हर श्रेणी से एक विकल्प चुनें।"
                          : "You can choose one from each category."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {Object.keys(challengeGroups).map((head) => (
                        <div key={head} className="grid gap-2">
                          <label className="block text-gray-900 font-semibold text-base">
                            {head}
                          </label>
                          <select
                            value={challengeSelections[head] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const next = {
                                ...challengeSelections,
                                [head]: val,
                              };
                              setChallengeSelections(next);
                              const combined: string[] = Object.entries(next)
                                .filter(([, v]) => v)
                                .map(([h, v]) => {
                                  const emoji = h.includes("Growth")
                                    ? "🔄"
                                    : h.includes("Brand")
                                      ? "🧠"
                                      : h.includes("Monetization")
                                        ? "💔"
                                        : "🥵";
                                  return `${emoji} ${h}: ${v}`;
                                });
                              updateQuizData("biggestChallenge", combined);
                            }}
                            className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 rounded-lg focus:border-orange-500 focus:outline-none"
                          >
                            <option value="">
                              {language === "hindi" ? "एक चुनें" : "Select one"}
                            </option>
                            {challengeGroups[head].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 10: Goals (max 3, scrollable) */}
                {currentStep === 10 && (
                  <div className="space-y-6">
                    <div className="text-center mb-2 md:mb-4">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        {t.questions.goals}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        {language === "hindi"
                          ? "अगले 6 महीनों के लिए अधिकतम 3 लक्ष्य चुनें।"
                          : "Select up to 3 goals for the next 6 months."}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1 text-black">
                      {t.options.goals.map((goal: string) => {
                        const selected = quizData.goals.includes(goal);
                        return (
                          <label
                            key={goal}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-sm md:text-base transition ${selected ? "border-neon-green bg-neon-green/10" : "border-gray-200 hover:border-gray-300"} text-black`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                const list = quizData.goals;
                                if (selected) {
                                  updateQuizData(
                                    "goals",
                                    list.filter((g: string) => g !== goal),
                                  );
                                } else if (list.length < 3) {
                                  updateQuizData("goals", [...list, goal]);
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <span>{goal}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 11: Social Links (optional) */}
                {currentStep === 11 && (
                  <div className="space-y-4 pb-6">
                    <div className="text-center mb-2 md:mb-4">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        {t.questions.socialLinks}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 px-2">
                        {language === "hindi"
                          ? "अ��ने प्रोफाइल लिंक साझा करें।"
                          : "Share your profile links."}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1 text-black">
                      {(
                        [
                          "instagram",
                          "youtube",
                          "linkedin",
                          "website",
                          "twitter",
                          "tiktok",
                        ] as const
                      ).map((key) => (
                        <div key={key}>
                          <label className="block text-gray-900 font-medium text-sm mb-1 capitalize">
                            {key}
                          </label>
                          <input
                            type="text"
                            value={(quizData.socialLinks as any)[key]}
                            onChange={(e) =>
                              updateQuizData("socialLinks", {
                                ...quizData.socialLinks,
                                [key]: e.target.value,
                              })
                            }
                            className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:border-electric-blue focus:outline-none text-sm"
                            placeholder={
                              language === "hindi"
                                ? `${key} URL दर्ज करें`
                                : `Enter your ${key} URL`
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 12: Engagement Rate */}
                {currentStep === 12 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <div className="text-center mb-2 md:mb-3">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        Engagement Rate 💯
                      </h2>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                        {t.questions.engagementRate}
                      </label>
                      <select
                        value={quizData.engagementRate}
                        onChange={(e) =>
                          updateQuizData("engagementRate", e.target.value)
                        }
                        className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-3 md:py-4 rounded-lg focus:border-electric-blue focus:outline-none transition-colors text-sm md:text-base"
                      >
                        <option value="">Select your engagement rate</option>
                        {t.options.engagementRates.map((er: string) => (
                          <option key={er} value={er}>
                            {er}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 13: Contact Info */}
                {currentStep === 13 && (
                  <div className="space-y-4 pb-8">
                    <div className="text-center mb-2 md:mb-4">
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                        Contact Information 📇
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-gray-900 font-medium text-sm mb-1">
                          {t.questions.name}
                        </label>
                        <input
                          type="text"
                          value={quizData.name}
                          onChange={(e) =>
                            updateQuizData("name", e.target.value)
                          }
                          className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:border-electric-blue focus:outline-none text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-900 font-medium text-sm mb-1">
                          {t.questions.email}
                        </label>
                        <input
                          type="email"
                          value={quizData.email}
                          onChange={(e) =>
                            updateQuizData("email", e.target.value)
                          }
                          className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:border-electric-blue focus:outline-none text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-900 font-medium text-sm mb-1">
                          {t.questions.city}
                        </label>
                        <input
                          type="text"
                          value={quizData.city}
                          onChange={(e) =>
                            updateQuizData("city", e.target.value)
                          }
                          className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:border-electric-blue focus:outline-none text-sm"
                          placeholder="City"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 20: DNA Report Upload */}
                {currentStep === 20 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        DNA Report for Deeper Analysis?
                      </h2>
                      <p className="text-gray-600">
                        Optional: Upload your DNA report for 99% accurate personalization
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border-2 border-dashed border-purple-200 p-8 text-center transition-all hover:border-purple-400">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="w-8 h-8 text-purple-500" />
                      </div>
                      <p className="text-gray-900 font-semibold mb-1">Upload DNA Report</p>
                      <p className="text-xs text-gray-500 mb-4">PDF, TXT, or Image files supported</p>
                      
                      <input
                        type="file"
                        id="dna-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDnaReport(file);
                            setDnaOption("upload");
                            // Auto-move for Option 1: DNA Upload
                            setTimeout(() => {
                              if (currentStep < totalSteps) {
                                setCurrentStep(currentStep + 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }, 500);
                          }
                        }}
                        accept=".pdf,.txt,image/*"
                      />
                      <label
                        htmlFor="dna-upload"
                        className="cursor-pointer bg-purple-50 text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors inline-block"
                      >
                        {dnaReport ? dnaReport.name : "Choose File"}
                      </label>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => setDnaOption("upload")}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          dnaOption === "upload"
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-100 hover:border-purple-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🧬</span>
                          <span className="font-semibold text-gray-900">Yes, I want to upload my DNA report</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          dnaOption === "upload" ? "bg-purple-500 border-purple-500" : "border-gray-200"
                        }`}>
                          {dnaOption === "upload" && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setDnaOption("have_no_upload");
                          setDnaReport(null);
                          // Auto-move for other options
                          setTimeout(() => {
                            if (currentStep < totalSteps) {
                              setCurrentStep(currentStep + 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }, 300);
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          dnaOption === "have_no_upload"
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-100 hover:border-purple-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🔒</span>
                          <span className="font-semibold text-gray-900">I have it but prefer not to upload</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          dnaOption === "have_no_upload" ? "bg-purple-500 border-purple-500" : "border-gray-200"
                        }`}>
                          {dnaOption === "have_no_upload" && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setDnaOption("no_report");
                          setDnaReport(null);
                          // Auto-move for other options
                          setTimeout(() => {
                            if (currentStep < totalSteps) {
                              setCurrentStep(currentStep + 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }, 300);
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          dnaOption === "no_report"
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-100 hover:border-purple-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🧘‍♀️</span>
                          <span className="font-semibold text-gray-900">I don't have a DNA report</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          dnaOption === "no_report" ? "bg-purple-500 border-purple-500" : "border-gray-200"
                        }`}>
                          {dnaOption === "no_report" && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Fixed Navigation Buttons - Always Visible During Quiz */}
      {!showFreeResources && !isGenerating && (
        <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
          <div className="container mx-auto max-w-2xl px-2 md:px-4 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-3 md:px-4 py-3 rounded-lg border-2 border-gray-300 text-sm md:text-base font-semibold disabled:opacity-50 text-black hover:bg-gray-50 transition-colors"
              disabled={currentStep === 1}
              aria-label="Previous question"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.buttons.back}</span>
              <span className="sm:hidden">Back</span>
            </button>
            <button
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={!canProceed()}
              className="flex-1 px-3 md:px-4 py-3 rounded-lg bg-gradient-to-r from-neon-green to-electric-blue text-black font-semibold text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              aria-label={
                currentStep === totalSteps ? "Submit quiz" : "Next question"
              }
            >
              <span className="hidden sm:inline">
                {currentStep === totalSteps ? t.buttons.submit : t.buttons.next}
              </span>
              <span className="sm:hidden">
                {currentStep === totalSteps ? "Submit" : "Next"}
              </span>
              <ArrowRight className="w-4 h-4 inline ml-1 md:ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
