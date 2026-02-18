import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Sanitize content for PDF rendering by removing unsupported Unicode characters
function sanitizeContentForPDF(content: string): string {
  const replacements: [RegExp, string][] = [
    [/╔/g, "┌"], [/╕/g, "┐"], [/╖/g, "┐"], [/╗/g, "┐"], [/╘/g, "└"], [/╙/g, "└"], [/╚/g, "└"], [/╛/g, "┘"], [/╜/g, "┘"], [/╝/g, "┘"],
    [/╞/g, "├"], [/╟/g, "├"], [/╠/g, "├"], [/╡/g, "┤"], [/╢/g, "┤"], [/╣/g, "┤"], [/╤/g, "┬"], [/╥/g, "┬"], [/╦/g, "┬"], [/╧/g, "┴"],
    [/╨/g, "┴"], [/╩/g, "┴"], [/╪/g, "┼"], [/╫/g, "┼"], [/╬/g, "┼"], [/═/g, "-"], [/║/g, "|"], [/╒/g, "┌"], [/╓/g, "┌"], [/╔/g, "┌"],
    [/–/g, "-"], [/—/g, "--"], [/…/g, "..."], [/'/g, "'"], [/'/g, "'"], [/"/g, '"'], [/"/g, '"'], [/"/g, '"'],
  ];

  let sanitized = content;
  for (const [pattern, replacement] of replacements) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  sanitized = sanitized
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < 256) return char;
      const mapping: { [key: string]: string } = {
        "₹": "Rs", "€": "EUR", "£": "GBP", "¥": "JPY", "©": "(c)", "®": "(R)", "™": "(TM)", "✓": "checkmark", "✔": "check",
        "✕": "x", "✖": "x", "★": "*", "✨": "*", "→": "->", "←": "<-", "↑": "^", "↓": "v", "⚡": "!", "🔥": "!",
      };
      return mapping[char] || " ";
    })
    .join("");

  return sanitized;
}

export interface ProductConfig {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  isEnabled: boolean;
  category: "growth-kit" | "course" | "masterclass" | "bundle";
  downloads: ProductDownload[];
}

export interface ProductDownload {
  id: string;
  name: string;
  type: "pdf" | "template" | "guide" | "video" | "audio" | "zip";
  language: "english" | "hindi" | "both";
  content: string | ((language: "english" | "hindi", userData?: any) => string);
  fileName: string;
}

export const productConfigs: ProductConfig[] = [
  {
    id: "complete-growth-kit",
    name: "Complete Creator Growth Kit",
    price: 99,
    originalPrice: 199,
    description: "Everything you need to grow from 0 to 10K followers and start monetizing",
    isEnabled: true,
    category: "growth-kit",
    features: [
      "Personalized Media Kit PDF", "30+ Email Templates", "Professional Pricing Calculator", "Content Calendar Template",
      "Growth Strategy Workbook", "Hashtag Research Guide", "Rate Card Templates", "Contract Templates", "BONUS: Real Creator Income Reports"
    ],
    downloads: [
      { id: "media-kit-template", name: "Professional Media Kit Template", type: "template", language: "both", content: generateMediaKitContent, fileName: "Professional_Media_Kit_Template" },
      { id: "email-templates", name: "30+ Brand Outreach Email Templates", type: "template", language: "both", content: generateEmailTemplatesContent, fileName: "Brand_Outreach_Email_Templates" },
      { id: "pricing-calculator", name: "Professional Pricing Calculator", type: "template", language: "both", content: generatePricingCalculatorContent, fileName: "Creator_Pricing_Calculator" },
      { id: "content-calendar", name: "Content Calendar Template (3 months)", type: "template", language: "both", content: generateContentCalendarContent, fileName: "Content_Calendar_3_Months" },
      { id: "growth-strategy", name: "Growth Strategy Workbook", type: "guide", language: "both", content: generateGrowthStrategyContent, fileName: "Creator_Growth_Strategy_Workbook" },
      { id: "hashtag-guide", name: "Hashtag Research Guide", type: "guide", language: "both", content: generateHashtagGuideContent, fileName: "Hashtag_Research_Master_Guide" },
      { id: "rate-cards", name: "Rate Card Templates", type: "template", language: "both", content: generateRateCardContent, fileName: "Professional_Rate_Card_Templates" },
      { id: "contracts", name: "Contract Templates", type: "template", language: "both", content: generateContractContent, fileName: "Creator_Contract_Templates" },
      { id: "premium-tools", name: "Premium Tools Guide", type: "guide", language: "both", content: generatePremiumToolsContent, fileName: "Premium_Creator_Tools_Guide" },
    ],
  },
  {
    id: "reels-mastery",
    name: "Instagram Reels Mastery Course",
    price: 197,
    originalPrice: 397,
    description: "Learn the viral formula that gets millions of views consistently",
    isEnabled: true,
    category: "course",
    features: [
      "2-hour video training", "50+ Viral Reel Ideas", "Editing Templates & Transitions", "Music & Sound Selection Guide",
      "Algorithm Optimization Secrets", "Case Studies from 1M+ creators", "BONUS: Live monthly Q&A sessions"
    ],
    downloads: [
      { id: "viral-reel-ideas", name: "50+ Viral Reel Ideas", type: "guide", language: "both", content: generateViralReelIdeasContent, fileName: "50_Viral_Reel_Ideas_Guide" },
      { id: "editing-templates", name: "Editing Templates & Transitions", type: "template", language: "both", content: generateEditingTemplatesContent, fileName: "Reel_Editing_Templates_Pack" },
      { id: "music-guide", name: "Music & Sound Selection Guide", type: "guide", language: "both", content: generateMusicGuideContent, fileName: "Reel_Music_Selection_Guide" },
      { id: "algorithm-secrets", name: "Algorithm Optimization Secrets", type: "guide", language: "both", content: generateAlgorithmSecretsContent, fileName: "Instagram_Algorithm_Secrets" },
      { id: "case-studies", name: "Case Studies from 1M+ Creators", type: "guide", language: "both", content: generateCaseStudiesContent, fileName: "Viral_Creator_Case_Studies" },
    ],
  },
  {
    id: "brand-masterclass",
    name: "Brand Collaboration Masterclass",
    price: 149,
    originalPrice: 299,
    description: "Get paid partnerships with top brands - step by step system",
    isEnabled: true,
    category: "masterclass",
    features: ["Brand Outreach Email Scripts", "Media Kit Templates (10 designs)", "Negotiation Tactics & Rate Cards", "Contract Templates", "50+ Brand Contact Database", "Pitch Deck Templates"],
    downloads: [
      { id: "brand-outreach-scripts", name: "Brand Outreach Email Scripts", type: "template", language: "both", content: generateBrandOutreachScriptsContent, fileName: "Brand_Outreach_Email_Scripts" },
      { id: "media-kit-designs", name: "Media Kit Templates (10 designs)", type: "template", language: "both", content: generateMediaKitDesignsContent, fileName: "Media_Kit_Template_Collection" },
      { id: "negotiation-tactics", name: "Negotiation Tactics & Rate Cards", type: "guide", language: "both", content: generateNegotiationTacticsContent, fileName: "Brand_Negotiation_Tactics_Guide" },
      { id: "brand-contracts", name: "Contract Templates", type: "template", language: "both", content: generateBrandContractContent, fileName: "Brand_Partnership_Contracts" },
      { id: "brand-database", name: "50+ Brand Contact Database", type: "template", language: "both", content: generateBrandDatabaseContent, fileName: "Brand_Contact_Database_50plus" },
      { id: "pitch-decks", name: "Pitch Deck Templates", type: "template", language: "both", content: generatePitchDeckContent, fileName: "Brand_Pitch_Deck_Templates" },
    ],
  },
  {
    id: "youtube-mastery",
    name: "YouTube Mastery Course",
    price: 297,
    originalPrice: 597,
    description: "Complete YouTube growth and monetization blueprint for creators",
    isEnabled: true,
    category: "course",
    features: ["2-hour video training", "YouTube SEO optimization secrets", "Monetization strategies", "Thumbnail design templates", "Viral content frameworks", "Analytics mastery"],
    downloads: [
      { id: "youtube-seo-guide", name: "YouTube SEO Optimization Guide", type: "guide", language: "both", content: generateYouTubeSEOContent, fileName: "YouTube_SEO_Mastery_Guide" },
      { id: "youtube-monetization", name: "Complete Monetization Strategies", type: "guide", language: "both", content: generateYouTubeMonetizationContent, fileName: "YouTube_Monetization_Blueprint" },
      { id: "thumbnail-templates", name: "Viral Thumbnail Templates", type: "template", language: "both", content: generateThumbnailTemplatesContent, fileName: "YouTube_Thumbnail_Templates" },
      { id: "youtube-analytics", name: "YouTube Analytics Mastery Guide", type: "guide", language: "both", content: generateYouTubeAnalyticsContent, fileName: "YouTube_Analytics_Mastery" },
    ],
  },
  {
    id: "facebook-posting-mastery",
    name: "Facebook Posting Mastery Course",
    price: 197,
    originalPrice: 397,
    description: "Master Facebook organic reach and engagement for maximum impact",
    isEnabled: true,
    category: "course",
    features: ["2-hour video training series", "Facebook algorithm secrets 2024", "Post optimization techniques", "Community building strategies", "Facebook groups monetization", "Content calendar templates"],
    downloads: [
      { id: "facebook-algorithm-guide", name: "Facebook Algorithm Secrets 2024", type: "guide", language: "both", content: generateFacebookAlgorithmContent, fileName: "Facebook_Algorithm_Secrets_2024" },
      { id: "facebook-posting-strategies", name: "High-Engagement Posting Strategies", type: "guide", language: "both", content: generateFacebookPostingContent, fileName: "Facebook_Posting_Strategies" },
      { id: "facebook-groups-monetization", name: "Facebook Groups Monetization Guide", type: "guide", language: "both", content: generateFacebookGroupsContent, fileName: "Facebook_Groups_Monetization" },
      { id: "facebook-content-calendar", name: "Facebook Content Calendar Templates", type: "template", language: "both", content: generateFacebookCalendarContent, fileName: "Facebook_Content_Calendar_Templates" },
    ],
  },
  {
    id: "complete-bundle",
    name: "Complete Creator Bundle",
    price: 497,
    originalPrice: 997,
    description: "Get ALL premium products for 70% OFF - Save ₹700+",
    isEnabled: true,
    category: "bundle",
    features: ["Growth Kit", "Reels Mastery", "YouTube Mastery", "Facebook Mastery", "Brand Masterclass", "1-on-1 Strategy Call"],
    downloads: [],
  },
];

export function getAllProducts() { return productConfigs.filter(p => p.isEnabled); }
export function getProductConfig(id: string) { return productConfigs.find(p => p.id === id); }

export async function downloadFile(content: string, fileName: string) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage();
  const { width, height } = page.getSize();
  let y = height - 50;

  const sanitized = sanitizeContentForPDF(content);
  const lines = sanitized.split("\n");

  for (const line of lines) {
    if (y < 50) {
      page = doc.addPage();
      y = height - 50;
    }
    page.drawText(line, { x: 50, y, size: 10, font, color: rgb(0, 0, 0) });
    y -= 15;
  }

  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

export function generateProductDownload(productId: string, downloadId: string, language: "english" | "hindi", userData?: any) {
  const product = getProductConfig(productId);
  const download = product?.downloads.find(d => d.id === downloadId);
  if (typeof download?.content === "function") return (download.content as any)(language, userData);
  return (download?.content as string) || "";
}

// Content generators
function generateMediaKitContent(_lang: any, data: any) { 
  const userText = `USER INFO:\nName: ${data?.name || "Creator"}\nEmail: ${data?.email || "N/A"}\nPhone: ${data?.phone || "N/A"}\nCity: ${data?.city || "N/A"}\nNiche: ${data?.niche || "N/A"}\nFollowers: ${data?.followerCount || "N/A"}\n\n`;
  return userText + `📱 PROFESSIONAL MEDIA KIT TEMPLATE\n\n1. Profile Summary\n2. Audience Demographics\n3. Engagement Metrics\n4. Past Collaborations\n5. Rate Cards\n\nUse this to pitch to top brands!`; 
}
function generateEmailTemplatesContent(_lang: any, data: any) { 
  const userText = `USER INFO: ${data?.name || "Creator"} (${data?.email || "N/A"})\n\n`;
  return userText + "📧 30+ BRAND OUTREACH EMAIL TEMPLATES\n\nTemplate 1: Cold Outreach\nTemplate 2: Follow-up\nTemplate 3: Rate Negotiation\n\nCustomize these with your niche!"; 
}
function generatePricingCalculatorContent() { return "💰 PROFESSIONAL PRICING CALCULATOR\n\nCalculation Formula: (Followers * ER * 0.5) + Production Cost\n\nUse this to never undercharge again!"; }
function generateContentCalendarContent() { return "📅 3-MONTH CONTENT CALENDAR\n\nMonth 1: Awareness\nMonth 2: Engagement\nMonth 3: Conversion\n\nDaily prompts included!"; }
function generateGrowthStrategyContent() { return "🚀 CREATOR GROWTH STRATEGY\n\n1. Niche Optimization\n2. Hook Masterclass\n3. Viral Formatting\n4. Retention Secrets"; }
function generateHashtagGuideContent() { return "#️⃣ HASHTAG RESEARCH MASTER GUIDE\n\nRule of 3-3-3:\n3 High volume\n3 Medium volume\n3 Low volume"; }
function generateRateCardContent() { return "💹 PROFESSIONAL RATE CARD TEMPLATES\n\nStandard Rates:\nReel: Rs 2000-5000\nStory: Rs 500-1500\nCarousel: Rs 1500-3000"; }
function generateContractContent(_lang: any, data: any) { 
  const userText = `USER INFO: ${data?.name || "Creator"} (${data?.email || "N/A"})\n\n`;
  return userText + `📄 CREATOR CONTRACT TEMPLATES\n\n1. Deliverables Agreement\n2. Payment Terms (50% upfront)\n3. Usage Rights\n4. Exclusivity Clause`; 
}
function generatePremiumToolsContent() { return "🛠️ PREMIUM CREATOR TOOLS GUIDE\n\nEditing: CapCut, Premiere Pro\nPlanning: Notion, Airtable\nAnalytics: SocialBlade, HypeAuditor"; }
function generateViralReelIdeasContent(_lang: any, data: any) { 
  const userText = `USER INFO: ${data?.name || "Creator"} (${data?.niche || "N/A"})\n\n`;
  return userText + `🎬 50+ VIRAL REEL IDEAS\n\n1. Day in the life\n2. 3 mistakes I made\n3. Hidden hack in [Niche]\n4. Before vs After`; 
}
function generateEditingTemplatesContent() { return "✂️ EDITING TEMPLATES & TRANSITIONS\n\n1. Fast Cuts\n2. Smooth Zoom\n3. Text Overlays\n4. Sound SFX Pack"; }
function generateMusicGuideContent(_lang: any, data: any) { 
  const userText = `USER INFO: ${data?.name || "Creator"} (${data?.niche || "N/A"})\n\n`;
  return userText + `🎵 MUSIC & SOUND SELECTION GUIDE (2024 TRENDS)\n\n1. How to find rising audio\n2. Lo-fi for educational reels\n3. Upbeat for travel\n4. Dramatic for storytelling`; 
}
function generateAlgorithmSecretsContent() { return "🧠 INSTAGRAM ALGORITHM SECRETS\n\n1. Watch time is king\n2. Share to stories within 10 mins\n3. Engage with first 50 comments"; }
function generateCaseStudiesContent() { return "📊 VIRAL CREATOR CASE STUDIES\n\n1. From 0 to 100k in 3 months\n2. Landing a 1 Lakh brand deal\n3. Reclaiming dead reach"; }
function generateBrandOutreachScriptsContent() { return "📧 BRAND OUTREACH SCRIPTS\n\nHigh conversion scripts for Instagram DMs and Emails."; }
function generateMediaKitDesignsContent() { return "🎨 MEDIA KIT DESIGNS\n\n10 layout ideas for your professional media kit."; }
function generateNegotiationTacticsContent() { return "🤝 NEGOTIATION TACTICS & RATE CARDS\n\nHow to double your brand deal value using psychology."; }
function generateBrandContractContent(_lang: any, data: any) { return generateContractContent(_lang, data); }
function generateBrandDatabaseContent() { return "📊 50+ BRAND CONTACT DATABASE\n\nTech, Fashion, Beauty, and Finance brand contacts."; }
function generatePitchDeckContent() { return "🎨 PITCH DECK TEMPLATES\n\nHigh-converting slides to win high-ticket brand deals."; }
function generateYouTubeSEOContent() { return "📺 YOUTUBE SEO MASTER GUIDE\n\nKeywords, Tags, and Description optimization."; }
function generateYouTubeMonetizationContent() { return "💵 YOUTUBE MONETIZATION BLUEPRINT\n\nAdSense, Sponsors, and Affiliate marketing."; }
function generateThumbnailTemplatesContent() { return "🖼️ VIRAL THUMBNAIL TEMPLATES\n\nPsychology of high CTR thumbnails."; }
function generateYouTubeAnalyticsContent() { return "📈 YOUTUBE ANALYTICS MASTERY\n\nUnderstanding CTR, AVD, and Impressions."; }
function generateFacebookAlgorithmContent() { return "🔵 FACEBOOK ALGORITHM SECRETS 2024\n\nHow to get organic reach on FB pages."; }
function generateFacebookPostingContent() { return "📝 HIGH-ENGAGEMENT POSTING STRATEGIES\n\nWhat to post and when for maximum FB reach."; }
function generateFacebookGroupsContent() { return "👥 FACEBOOK GROUPS MONETIZATION\n\nBuilding and earning from FB communities."; }
function generateFacebookCalendarContent() { return "📅 FB CONTENT CALENDAR TEMPLATES\n\n30 days of posting ideas for Facebook."; }
