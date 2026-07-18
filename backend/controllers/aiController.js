const prisma = require("../config/prisma");

/**
 * Generates a mock response for a batch to ensure the app works out-of-the-box
 * even if the user hasn't configured a real Gemini API Key.
 */
const getMockResponse = (batch, mode, customQuery) => {
  const name = batch.name || "Unknown Botanical";
  const quantity = batch.quantity || 100;
  const status = batch.status || "Active";
  
  if (customQuery) {
    return `### AI Consultation Report for ${name} (Batch #${batch.id})

You asked: *"${customQuery}"*

Here is our expert analysis based on this batch's specifications (Volume: ${quantity}L, Status: ${status}):
1. **Direct Answer**: Regarding your query about "${customQuery}", this essential oil batch of ${name} meets standard industrial specifications.
2. **Quality Context**: At ${quantity} Liters, this batch represents a medium-scale production volume. Ensure the storage temperature is maintained below 20°C to preserve volatile aromatic compounds.
3. **Recommendation**: For Q&A queries of this nature, we recommend performing an official GC-MS analysis to verify exact chemical constituents before formulating.
`;
  }

  switch (mode) {
    case "botanical":
      return `### 🌿 Botanical Profile & GC-MS Standards
**Batch Identity:** ${name} (Batch #${batch.id})
**Volume:** ${quantity} Liters

#### 🧬 Chemical Composition Expectations
Typical Gas Chromatography-Mass Spectrometry (GC-MS) expected range values for high-quality **${name}**:
- **Linalool / Active Terpenes:** 35% - 48% (Provides relaxing floral note and antimicrobial properties)
- **Linalyl Acetate:** 30% - 40% (Responsible for sweet-herbacous aroma ester profile)
- **1,8-Cineole / Eucalyptol:** < 2.5% (Keeps the oil smooth and non-camphorous)
- **Camphor:** < 1.2% (Indicates high-grade cosmetic/therapeutic quality)

#### 🛡 Therapeutic & Industrial Properties
- **Aromatherapy:** Promotes relaxation, stress reduction, and sleep aid.
- **Dermatological:** High antioxidant capacity; safe for dilution in skincare formulations.
- **Perfumery Note:** Middle note, providing a clean, fresh herbaceous-floral bridge.
`;
    case "formulation":
      return `### 🧪 Blending & Commercial Formulation Guide
**Batch Identity:** ${name} (Batch #${batch.id})
**Available Quantity:** ${quantity} Liters

#### 🔗 Optimized Blending Partners
This batch of **${name}** blends exceptionally well with:
1. **Citrus Oils (e.g., Bergamot, Sweet Orange):** Enhances top notes, adds brightness.
2. **Woody/Resinous Oils (e.g., Cedarwood, Frankincense):** Fixes the fragrance, increasing scent longevity.
3. **Herbaceous Oils (e.g., Rosemary, Clary Sage):** Deepens the green, refreshing mid-tones.

#### 📊 Dilution Guidelines
- **Cosmetic Skincare (Facial):** 0.5% to 1.0% dilution (approx. 5-10ml per Liter of carrier oil).
- **Body Care / Massage Oils:** 2.0% to 3.0% dilution (approx. 20-30ml per Liter).
- **Commercial Diffusers / Air Mist:** Use pure extract or 10% dilution in perfumer's alcohol.

#### 📝 Commercial Yield Estimation (${quantity} Liters)
Using your current batch volume of **${quantity} Liters**, you can produce:
- **50,000 units** of 10ml retail bottles (at 20% fragrance concentration for Eau de Cologne).
- **100,000 units** of premium aromatherapy soaps (at 1% formulation usage).
`;
    case "optimization":
    default:
      return `### 📈 Storage Optimization & Market Readiness
**Batch Identity:** ${name} (Batch #${batch.id})
**Status:** ${status}

#### 🌡 Critical Storage Parameters
To prevent oxidation and preserve the therapeutic compounds of **${name}**:
- **Ideal Temperature:** 12°C - 15°C (54°F - 59°F). Avoid fluctuations.
- **Container Material:** Amber glass or fluorinated HDPE. Never store in raw aluminum or copper.
- **Headspace Management:** Nitrogen-blanketing is recommended if container headspace exceeds 20% to prevent oxidation.

#### ⏳ Shelf-Life & Stability Indicators
- **Expected Shelf-Life:** 24 - 36 months under optimal sealed nitrogen storage.
- **Spoilage Markers:** Yellowing or darkening of the oil, rising viscosity, or a sour/rancid aroma undertone (indicates peroxide values exceeding 20 meq O2/kg).

#### 🗺 Global Market Positioning
- **Quality Grade:** Premium Organic Extract.
- **Market Demand:** High demand in European cosmetic manufacturing and North American premium wellness markets. Current market index value indicates stable pricing.
`;
  }
};

/**
 * POST /api/ai/insights
 * Generates AI-powered insights for a specific batch.
 */
exports.getBatchInsights = async (req, res) => {
  try {
    const { batchId, mode, customQuery } = req.body;
    
    // Find the batch in the database
    const batch = await prisma.batch.findUnique({
      where: { id: Number(batchId) },
    });

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found in registry",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === "your_gemini_api_key_here";

    if (isMockMode) {
      // Return high-quality mockup data
      const mockResult = getMockResponse(batch, mode, customQuery);
      return res.status(200).json({
        success: true,
        isMocked: true,
        mode,
        insights: mockResult,
        warning: "Running in Demo Mode. Set GEMINI_API_KEY in .env for live AI insights."
      });
    }

    // Determine the prompt based on the selected mode
    let systemInstruction = "You are an expert aroma chemist, master perfumer, and quality assurance analyst for premium botanical extracts and essential oils. Keep your responses structured, professional, and well-formatted in markdown.";
    let prompt = "";

    if (customQuery) {
      prompt = `
Analyze the following essential oil batch and answer the user's specific query.
Batch Details:
- Name: ${batch.name}
- Volume: ${batch.quantity} Liters
- Status: ${batch.status}
- Distilled/Registered Date: ${batch.createdAt}

User Query: "${customQuery}"

Generate a focused, scientifically grounded answer. If the query is unrelated to essential oils, cosmetics, perfumery, chemistry, or the batch data, politely guide the user back to the batch context.
`;
    } else {
      switch (mode) {
        case "botanical":
          prompt = `
Generate a professional botanical profile and chemical composition analysis report for this essential oil batch:
- Name: ${batch.name}
- Volume: ${batch.quantity} Liters
- Status: ${batch.status}
- Distilled/Registered Date: ${batch.createdAt}

Include:
1. Expected active chemical constituents (e.g. Linalool, Pinene, Limonene etc.) with realistic percentage ranges for GC-MS testing.
2. Botanical classification details.
3. Key therapeutic and industrial applications.
Format with clean markdown headings, bold text, and bullet points.
`;
          break;
        case "formulation":
          prompt = `
Generate a blending and commercial formulation guide for this essential oil batch:
- Name: ${batch.name}
- Volume: ${batch.quantity} Liters
- Status: ${batch.status}

Include:
1. Three specific botanical blending partners and why they complement this oil.
2. Recommended dilution ratios for cosmetic/massage products.
3. Yield calculations based on the batch volume of ${batch.quantity} Liters (e.g., how many units of 10ml bottles or 50g soaps can be produced).
Format with clear markdown headings, bold text, and numbered lists.
`;
          break;
        case "optimization":
        default:
          prompt = `
Generate a storage optimization, quality control, and market readiness report for this essential oil batch:
- Name: ${batch.name}
- Volume: ${batch.quantity} Liters
- Status: ${batch.status}
- Distilled/Registered Date: ${batch.createdAt}

Include:
1. Ideal temperature, lighting, and container storage parameters.
2. Shelf-life stability indicators and signs of oxidation or spoilage.
3. Market demand trends and distribution recommendations.
Format with clean markdown headings, bold text, and bullet points.
`;
          break;
      }
    }

    // Call the Google Gemini API with a 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    };

    let response;
    try {
      response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return res.status(504).json({
          message: "AI request timed out. Please try again."
        });
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API returned status ${response.status}:`, errorText);
      
      if (response.status === 429) {
        return res.status(429).json({
          message: "AI service rate limit exceeded. Please try again in a few moments."
        });
      }

      if (response.status === 403 || response.status === 400) {
        return res.status(400).json({
          message: "AI configuration error. Please verify the GEMINI_API_KEY in the backend .env configuration."
        });
      }

      return res.status(502).json({
        message: "Failed to communicate with AI provider API"
      });
    }

    const responseData = await response.json();
    
    // Validate response structure
    const candidates = responseData.candidates;
    if (!candidates || candidates.length === 0 || !candidates[0].content || !candidates[0].content.parts || candidates[0].content.parts.length === 0) {
      return res.status(502).json({
        message: "Invalid response formatting returned from AI API"
      });
    }

    const aiText = candidates[0].content.parts[0].text;

    return res.status(200).json({
      success: true,
      isMocked: false,
      mode,
      insights: aiText
    });

  } catch (error) {
    console.error("AI Insights Error:", error);
    return res.status(500).json({
      message: "An internal server error occurred while processing AI insights",
      error: error.message
    });
  }
};
