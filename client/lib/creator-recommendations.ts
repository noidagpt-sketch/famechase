import {
  CreatorProfile,
  CreatorScores,
  RevenueProjection,
  CreatorRecommendation,
} from "./creator-model";

export function generateRecommendations(
  profile: CreatorProfile,
  scores: CreatorScores,
  projections: RevenueProjection
): CreatorRecommendation[] {
  const recommendations: CreatorRecommendation[] = [];

  if (profile.engagementRate < 3) {
    recommendations.push({
      category: "engagement",
      priority: "critical",
      title: "Hook & Retention Strategy",
      titleHindi: "हुक और रिटेंशन रणनीति",
      description: `Your engagement rate (${profile.engagementRate}%) is below the 3% threshold. This means your content isn't capturing attention effectively.`,
      descriptionHindi: `आपकी एंगेजमेंट रेट (${profile.engagementRate}%) 3% से नीचे है। इसका मतलब है कि आपका कंटेंट प्रभावी ढंग से ध्यान आकर्षित नहीं कर रहा।`,
      actions: [
        "Open every post with a pattern-interrupt hook in the first 1-2 seconds",
        "Use text overlays that create curiosity (questions, bold claims, numbers)",
        "End every video with a question or call-to-action to boost comments",
        "Test 5 different hook styles this week and track which gets highest saves",
        "Reply to every comment within 1 hour to signal engagement to the algorithm",
      ],
      actionsHindi: [
        "हर पोस्ट की शुरुआत पहले 1-2 सेकंड में ध्यान खींचने वाले हुक से करें",
        "टेक्स्ट ओवरले का उपयोग करें जो जिज्ञासा पैदा करे (सवाल, बोल्ड दावे, नंबर)",
        "हर वीडियो के अंत में एक सवाल या कॉल-टू-एक्शन रखें",
        "इस सप्ताह 5 अलग-अलग हुक स्टाइल टेस्ट करें और ट्रैक करें",
        "हर कमेंट का 1 घंटे के अंदर जवाब दें",
      ],
      expectedImpact: "Engagement rate can increase from " + profile.engagementRate + "% to 5-8% within 4-6 weeks",
      expectedImpactHindi: "एंगेजमेंट रेट 4-6 सप्ताह में " + profile.engagementRate + "% से बढ़कर 5-8% हो सकता है",
      timeframe: "4-6 weeks",
    });
  }

  if (scores.algorithmAlignmentScore < 45) {
    recommendations.push({
      category: "reach",
      priority: "critical",
      title: "Distribution & Reach Strategy",
      titleHindi: "डिस्ट्रीब्यूशन और रीच रणनीति",
      description: `Your algorithm alignment score (${scores.algorithmAlignmentScore}/100) indicates low reach. Your content isn't being pushed by the algorithm.`,
      descriptionHindi: `आपका एल्गोरिदम अलाइनमेंट स्कोर (${scores.algorithmAlignmentScore}/100) कम रीच दर्शाता है।`,
      actions: [
        "Switch to short-form video (Reels/Shorts) for 80% of your content",
        "Post during peak hours: 7-9 PM IST on weekdays, 11 AM-1 PM on weekends",
        "Use 8-12 niche-specific hashtags per post (mix trending + niche)",
        "Create shareable content (tips, lists, how-tos) that triggers saves",
        "Cross-post to 2-3 platforms to diversify reach",
        "Use trending audio within 24 hours of it trending",
      ],
      actionsHindi: [
        "अपने 80% कंटेंट को शॉर्ट-फॉर्म वीडियो (रील्स/शॉर्ट्स) में बदलें",
        "पीक ऑवर्स में पोस्ट करें: वीकडेज़ पर शाम 7-9 बजे IST",
        "प्रति पोस्ट 8-12 निच-स्पेसिफिक हैशटैग का उपयोग करें",
        "शेयर करने योग्य कंटेंट बनाएं (टिप्स, लिस्ट, हाउ-टू)",
        "2-3 प्लेटफॉर्म पर क्रॉस-पोस्ट करें",
        "ट्रेंडिंग ऑडियो का 24 घंटे के अंदर उपयोग करें",
      ],
      expectedImpact: "Reach can increase 2-4x within 30 days with consistent execution",
      expectedImpactHindi: "लगातार करने पर 30 दिनों में रीच 2-4 गुना बढ़ सकती है",
      timeframe: "2-4 weeks",
    });
  }

  if (scores.monetizationReadinessScore < 50 || profile.income === 0) {
    const ratePerPost = projections.brandRatePerPost;
    recommendations.push({
      category: "monetization",
      priority: profile.followers >= 5000 ? "critical" : "high",
      title: "Monetization Funnel Strategy",
      titleHindi: "मोनेटाइज़ेशन फनल रणनीति",
      description: `${profile.income === 0 ? "You're not earning from your content yet" : "Your income is below potential"}. With ${profile.followerRange} followers in ${profile.niche}, you should be earning ₹${projections.realisticMonthly.toLocaleString("en-IN")}/month.`,
      descriptionHindi: `${profile.income === 0 ? "आप अभी अपने कंटेंट से नहीं कमा रहे" : "आपकी आय क्षमता से कम है"}। ${profile.niche} में ${profile.followerRange} फॉलोअर्स के साथ, आपको ₹${projections.realisticMonthly.toLocaleString("en-IN")}/महीना कमाना चाहिए।`,
      actions: [
        `Create a professional media kit showcasing your ${profile.followerRange} audience`,
        `Set your minimum rate at ₹${ratePerPost.toLocaleString("en-IN")} per post`,
        "Send 5 personalized brand pitches every week to relevant brands",
        "Start affiliate marketing with 2-3 products in your niche immediately",
        "Create a lead magnet (free guide/checklist) to build an email list",
        "Offer package deals: 3 posts + stories at 25% discount for long-term partnerships",
      ],
      actionsHindi: [
        `अपने ${profile.followerRange} ऑडियंस को दिखाते हुए एक प्रोफेशनल मीडिया किट बनाएं`,
        `अपनी न्यूनतम दर ₹${ratePerPost.toLocaleString("en-IN")} प्रति पोस्ट रखें`,
        "हर सप्ताह 5 पर्सनलाइज्ड ब्रांड पिच भेजें",
        "तुरंत अपने निच में 2-3 प्रोडक्ट्स के लिए एफिलिएट मार्केटिंग शुरू करें",
        "ईमेल लिस्ट बनाने के लिए एक लीड मैग्नेट (फ्री गाइड) बनाएं",
        "पैकेज डील्स ऑफर करें: 3 पोस्ट + स्टोरीज़ 25% डिस्काउंट पर",
      ],
      expectedImpact: `Can generate ₹${projections.conservativeMonthly.toLocaleString("en-IN")}-₹${projections.realisticMonthly.toLocaleString("en-IN")}/month within 60 days`,
      expectedImpactHindi: `60 दिनों में ₹${projections.conservativeMonthly.toLocaleString("en-IN")}-₹${projections.realisticMonthly.toLocaleString("en-IN")}/महीना कमा सकते हैं`,
      timeframe: "30-60 days",
    });
  }

  if (scores.consistencyScore < 60) {
    recommendations.push({
      category: "consistency",
      priority: "high",
      title: "Content System Protocol",
      titleHindi: "कंटेंट सिस्टम प्रोटोकॉल",
      description: `Your posting frequency (${profile.postingFrequency}) is limiting growth. The algorithm rewards consistent creators with more reach.`,
      descriptionHindi: `आपकी पोस्टिंग फ्रीक्वेंसी (${profile.postingFrequency}) ग्रोथ को सीमित कर रही है। एल्गोरिदम लगातार क्रिएटर्स को ज़्यादा रीच देता है।`,
      actions: [
        "Block 2 hours every Sunday for batch-creating next week's content",
        "Create a 30-day content calendar with themes for each day",
        "Prepare 5 content templates you can reuse (saves 70% of creation time)",
        "Schedule posts using Later or Buffer for consistent publishing",
        "Start with 3 posts/week minimum, then scale to 5 posts/week in month 2",
        "Keep a running ideas list on your phone — add 3 ideas daily",
      ],
      actionsHindi: [
        "हर रविवार 2 घंटे ब्लॉक करें अगले सप्ताह का कंटेंट बनाने के लिए",
        "हर दिन के लिए थीम के साथ 30-दिन का कंटेंट कैलेंडर बनाएं",
        "5 कंटेंट टेम्प्लेट तैयार करें जो आप दोबारा उपयोग कर सकें",
        "Later या Buffer का उपयोग करके पोस्ट शेड्यूल करें",
        "न्यूनतम 3 पोस्ट/सप्ताह से शुरू करें, फिर 5/सप्ताह तक बढ़ाएं",
        "अपने फोन पर एक आइडिया लिस्ट रखें — रोज़ 3 आइडिया जोड़ें",
      ],
      expectedImpact: "Consistent posting can increase reach by 2-3x and follower growth by 40% within 30 days",
      expectedImpactHindi: "लगातार पोस्टिंग से 30 दिनों में रीच 2-3 गुना और फॉलोअर ग्रोथ 40% बढ़ सकती है",
      timeframe: "2-4 weeks",
    });
  }

  if (scores.authorityScore < 50 && profile.followers >= 1000) {
    recommendations.push({
      category: "growth",
      priority: "medium",
      title: "Authority Building Strategy",
      titleHindi: "ऑथोरिटी बिल्डिंग रणनीति",
      description: `Your authority score (${scores.authorityScore}/100) can be improved. Building authority attracts better brand deals and loyal followers.`,
      descriptionHindi: `आपका ऑथोरिटी स्कोर (${scores.authorityScore}/100) सुधारा जा सकता है। ऑथोरिटी बनाने से बेहतर ब्रांड डील्स और लॉयल फॉलोअर्स मिलते हैं।`,
      actions: [
        "Share data-backed insights and original research in your niche",
        "Collaborate with 2-3 creators at similar or higher level monthly",
        "Create long-form educational content (carousel posts, detailed guides)",
        "Build social proof: showcase testimonials, results, milestones",
        "Develop a unique framework or methodology in your niche",
      ],
      actionsHindi: [
        "अपने निच में डेटा-बैक्ड इनसाइट्स और ओरिजिनल रिसर्च शेयर करें",
        "हर महीने 2-3 समान या उच्च लेवल के क्रिएटर्स के साथ कोलैब करें",
        "लॉन्ग-फॉर्म एजुकेशनल कंटेंट बनाएं (कैरोसल, डिटेल्ड गाइड्स)",
        "सोशल प्रूफ बनाएं: टेस्टिमोनियल्स, रिजल्ट्स, माइलस्टोन्स दिखाएं",
        "अपने निच में एक यूनिक फ्रेमवर्क विकसित करें",
      ],
      expectedImpact: "Authority score can reach 65+ within 60-90 days, unlocking premium partnerships",
      expectedImpactHindi: "ऑथोरिटी स्कोर 60-90 दिनों में 65+ तक पहुंच सकता है",
      timeframe: "60-90 days",
    });
  }

  if (profile.goals.some(g => g.includes("Brand") || g.includes("brand"))) {
    recommendations.push({
      category: "monetization",
      priority: "high",
      title: "Brand Partnership Accelerator",
      titleHindi: "ब्रांड पार्टनरशिप एक्सेलरेटर",
      description: `Based on your goal to get brand collaborations, here's a targeted plan for your ${profile.niche} niche.`,
      descriptionHindi: `ब्रांड कोलैबोरेशन के आपके लक्ष्य के आधार पर, आपके ${profile.niche} निच के लिए एक टार्गेटेड प्लान।`,
      actions: [
        "Build a 50-brand target list in your niche using Instagram search",
        "Craft 3 pitch templates (cold, warm, and follow-up)",
        `Price your collaborations: ₹${projections.brandRatePerPost.toLocaleString("en-IN")} (post), ₹${projections.brandRatePerReel.toLocaleString("en-IN")} (reel), ₹${projections.brandRatePerStory.toLocaleString("en-IN")} (story)`,
        "Create case studies from past content showing reach/engagement results",
        "Join creator platforms: Plixxo, One Impression, Influencer.in",
      ],
      actionsHindi: [
        "Instagram सर्च का उपयोग करके अपने निच में 50-ब्रांड टार्गेट लिस्ट बनाएं",
        "3 पिच टेम्प्लेट तैयार करें (कोल्ड, वॉर्म, और फॉलो-अप)",
        `अपनी कोलैबोरेशन प्राइसिंग: ₹${projections.brandRatePerPost.toLocaleString("en-IN")} (पोस्ट), ₹${projections.brandRatePerReel.toLocaleString("en-IN")} (रील)`,
        "पिछले कंटेंट से केस स्टडीज़ बनाएं जो रीच/एंगेजमेंट रिजल्ट दिखाएं",
        "क्रिएटर प्लेटफॉर्म जॉइन करें: Plixxo, One Impression, Influencer.in",
      ],
      expectedImpact: `Land 2-5 brand partnerships within 30-60 days at ₹${projections.brandRatePerPost.toLocaleString("en-IN")}+ per post`,
      expectedImpactHindi: `30-60 दिनों में 2-5 ब्रांड पार्टनरशिप ₹${projections.brandRatePerPost.toLocaleString("en-IN")}+ प्रति पोस्ट पर`,
      timeframe: "30-60 days",
    });
  }

  if (profile.goals.some(g => g.includes("₹25K") || g.includes("₹50K") || g.includes("₹1L") || g.includes("income") || g.includes("Earn"))) {
    recommendations.push({
      category: "monetization",
      priority: "high",
      title: "Income Growth Roadmap",
      titleHindi: "इनकम ग्रोथ रोडमैप",
      description: `Your revenue projection shows potential of ₹${projections.realisticMonthly.toLocaleString("en-IN")}/month. Here's how to get there.`,
      descriptionHindi: `आपकी रेवेन्यू प्रोजेक्शन ₹${projections.realisticMonthly.toLocaleString("en-IN")}/महीना की क्षमता दिखाती है।`,
      actions: [
        "Diversify income: brand deals (40%) + affiliate (30%) + digital products (30%)",
        `Target ${Math.ceil(projections.realisticMonthly / projections.brandRatePerPost)} brand collaborations per month`,
        "Launch a low-ticket digital product (₹99-499) leveraging your expertise",
        "Build an email list of 1000+ subscribers for direct monetization",
        "Negotiate long-term contracts (3-6 months) for stable income",
      ],
      actionsHindi: [
        "आय विविधीकरण: ब्रांड डील्स (40%) + एफिलिएट (30%) + डिजिटल प्रोडक्ट्स (30%)",
        `प्रति माह ${Math.ceil(projections.realisticMonthly / projections.brandRatePerPost)} ब्रांड कोलैबोरेशन टार्गेट करें`,
        "अपनी विशेषज्ञता का उपयोग करके एक लो-टिकट डिजिटल प्रोडक्ट (₹99-499) लॉन्च करें",
        "डायरेक्ट मोनेटाइज़ेशन के लिए 1000+ सब्सक्राइबर्स की ईमेल लिस्ट बनाएं",
        "स्थिर आय के लिए लॉन्ग-टर्म कॉन्ट्रैक्ट (3-6 महीने) नेगोशिएट करें",
      ],
      expectedImpact: `Realistic monthly income of ₹${projections.realisticMonthly.toLocaleString("en-IN")} achievable within 90 days`,
      expectedImpactHindi: `₹${projections.realisticMonthly.toLocaleString("en-IN")} की रियलिस्टिक मंथली इनकम 90 दिनों में प्राप्त करने योग्य`,
      timeframe: "60-90 days",
    });
  }

  recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations;
}
