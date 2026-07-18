# 🌿 Prompt Engineering & AI Analysis (Week 7)

This document contains the prompt designs, system roles, input/output test examples, and evaluation analysis for the AI-powered insights engine integrated into the AromaTrace application.

---

## 🎭 System Prompt & Role Definition

To ensure consistent, high-quality, and scientifically accurate outputs, all prompt variations share a unified system instruction that defines the AI's persona, expertise, and format guidelines.

**System Prompt:**
> "You are an expert aroma chemist, master perfumer, and quality assurance analyst for premium botanical extracts and essential oils. Keep your responses structured, professional, and well-formatted in markdown."

---

## 📝 Prompt Variations

### 🔹 Variation 1: Botanical Profile & GC-MS Standards (Mode: `botanical`)

*   **Goal:** Provide a standard biochemical identity report, expected chromatography ranges, and basic therapeutic properties of the botanical oil.
*   **System Instructions:** Shared above.
*   **Prompt Template:**
    ```text
    Generate a professional botanical profile and chemical composition analysis report for this essential oil batch:
    - Name: {batchName}
    - Volume: {batchQuantity} Liters
    - Status: {batchStatus}
    - Distilled/Registered Date: {createdAt}

    Include:
    1. Expected active chemical constituents (e.g. Linalool, Pinene, Limonene etc.) with realistic percentage ranges for GC-MS testing.
    2. Botanical classification details.
    3. Key therapeutic and industrial applications.
    Format with clean markdown headings, bold text, and bullet points.
    ```
*   **Example Input:**
    *   **Batch Name:** Organic Lavender (Lavandula angustifolia)
    *   **Volume:** 150 Liters
    *   **Status:** GC-MS Testing
    *   **Date:** July 3, 2026
*   **Example Output:**
    ```markdown
    ### 🌿 Botanical Profile & GC-MS Standards
    **Batch Identity:** Organic Lavender (Lavandula angustifolia)
    **Volume:** 150 Liters

    #### 🧬 Chemical Composition Expectations
    Typical Gas Chromatography-Mass Spectrometry (GC-MS) expected range values for high-quality **Organic Lavender (Lavandula angustifolia)**:
    - **Linalool:** 35% - 48% (Provides relaxing floral note and antimicrobial properties)
    - **Linalyl Acetate:** 30% - 40% (Responsible for sweet-herbacous aroma ester profile)
    - **1,8-Cineole / Eucalyptol:** < 2.5% (Keeps the oil smooth and non-camphorous)
    - **Camphor:** < 1.2% (Indicates high-grade cosmetic/therapeutic quality)

    #### 🛡 Therapeutic & Industrial Properties
    - **Aromatherapy:** Promotes relaxation, stress reduction, and sleep aid.
    - **Dermatological:** High antioxidant capacity; safe for dilution in skincare formulations.
    - **Perfumery Note:** Middle note, providing a clean, fresh herbaceous-floral bridge.
    ```

---

### 🔹 Variation 2: Blending & Commercial Formulation Guide (Mode: `formulation`)

*   **Goal:** Offer concrete commercial utility, suggesting blending combinations, specific dilution rates, and direct yield estimates based on the batch volume.
*   **System Instructions:** Shared above.
*   **Prompt Template:**
    ```text
    Generate a blending and commercial formulation guide for this essential oil batch:
    - Name: {batchName}
    - Volume: {batchQuantity} Liters
    - Status: {batchStatus}

    Include:
    1. Three specific botanical blending partners and why they complement this oil.
    2. Recommended dilution ratios for cosmetic/massage products.
    3. Yield calculations based on the batch volume of {batchQuantity} Liters (e.g., how many units of 10ml bottles or 50g soaps can be produced).
    Format with clear markdown headings, bold text, and numbered lists.
    ```
*   **Example Input:**
    *   **Batch Name:** Organic Peppermint (Mentha piperita)
    *   **Volume:** 80 Liters
    *   **Status:** In Distillation
*   **Example Output:**
    ```markdown
    ### 🧪 Blending & Commercial Formulation Guide
    **Batch Identity:** Organic Peppermint (Mentha piperita)
    **Available Quantity:** 80 Liters

    #### 🔗 Optimized Blending Partners
    This batch of **Organic Peppermint (Mentha piperita)** blends exceptionally well with:
    1. **Eucalyptus Globulus:** Enhances the cooling, respiratory-clearing camphorous effect.
    2. **Lemon (Citrus limon):** Adds a bright, clean, energizing top note ideal for wellness products.
    3. **Rosemary (Rosmarinus officinalis):** Creates a herbaceous, focus-enhancing middle note combination.

    #### 📊 Dilution Guidelines
    - **Cosmetic Skincare (Facial):** 0.2% to 0.5% dilution (approx. 2-5ml per Liter of carrier oil). Peppermint is a strong skin sensitizer.
    - **Body Care / Massage Oils:** 1.0% to 2.0% dilution (approx. 10-20ml per Liter) for muscle rub applications.
    - **Commercial Diffusers / Air Mist:** Use 5-10% dilution in denatured alcohol base.

    #### 📝 Commercial Yield Estimation (80 Liters)
    Using your current batch volume of **80 Liters**, you can produce:
    - **8,000 units** of 10ml retail bottles (at 100% purity for aromatherapy).
    - **26,600 units** of 100ml muscle-cooling sprays (at a 3% active oil dilution rate).
    ```

---

### 🔹 Variation 3: Storage Optimization & Market Readiness (Mode: `optimization`)

*   **Goal:** Provide quality assurance controls, warning signs for product degradation/spoilage, and global commercial market insights.
*   **System Instructions:** Shared above.
*   **Prompt Template:**
    ```text
    Generate a storage optimization, quality control, and market readiness report for this essential oil batch:
    - Name: {batchName}
    - Volume: {batchQuantity} Liters
    - Status: {batchStatus}
    - Distilled/Registered Date: {createdAt}

    Include:
    1. Ideal temperature, lighting, and container storage parameters.
    2. Shelf-life stability indicators and signs of oxidation or spoilage.
    3. Market demand trends and distribution recommendations.
    Format with clean markdown headings, bold text, and bullet points.
    ```
*   **Example Input:**
    *   **Batch Name:** Tea Tree Oil (Melaleuca alternifolia)
    *   **Volume:** 250 Liters
    *   **Status:** Distilled
    *   **Date:** June 15, 2026
*   **Example Output:**
    ```markdown
    ### 📈 Storage Optimization & Market Readiness
    **Batch Identity:** Tea Tree Oil (Melaleuca alternifolia)
    **Status:** Distilled

    #### 🌡 Critical Storage Parameters
    To prevent oxidation and preserve the active compounds of **Tea Tree Oil (Melaleuca alternifolia)**:
    - **Ideal Temperature:** 10°C - 15°C (50°F - 59°F). Avoid temperature fluctuations.
    - **Container Material:** Fluorinated HDPE or stainless steel drums. Avoid PVC or light-permeable glass.
    - **Headspace Management:** Nitrogen-blanketing is recommended if container headspace exceeds 20% to prevent oxidation.

    #### ⏳ Shelf-Life & Stability Indicators
    - **Expected Shelf-Life:** 24 - 36 months under optimal sealed nitrogen storage.
    - **Spoilage Markers:** Yellowing or darkening of the oil, rising viscosity, or a sour/rancid aroma undertone (indicates peroxide values exceeding 20 meq O2/kg).

    #### 🗺 Global Market Positioning
    - **Quality Grade:** Premium Organic Extract.
    - **Market Demand:** High demand in European cosmetic manufacturing and North American premium wellness markets. Current market index value indicates stable pricing.
    ```

---

## 📊 Comparison & Evaluation

| Feature | Prompt Variation 1 (Botanical) | Prompt Variation 2 (Formulation) | Prompt Variation 3 (Optimization) |
| :--- | :--- | :--- | :--- |
| **Output Type** | Markdown Report | Markdown Guide & Yield Calculations | Markdown Report |
| **Primary Value** | Science & Chromatography | Product formulation & Yield statistics | Storage QA & Logistics |
| **Clarity** | Very High | High | Very High |
| **Grounding level** | High (utilizes name) | Extremely High (utilizes quantity metrics) | High (utilizes status & date) |
| **Safety / Risk Warning** | Basic | Detailed (Dilution advice) | Detailed (Oxidation signs) |

### 🏆 Which Prompt Performed Best?

**Prompt Variation 2 (Blending & Commercial Formulation Guide)** performed best overall.

### 🔍 Why it performed better:

1.  **Metric Integration:** Unlike standard AI descriptions which only use the name of the oil, Variation 2 integrates the batch's **Liters quantity** to calculate realistic retail container counts, commercial dilutions, and actual project yields. This makes the report highly customized and actionable for a business.
2.  **Safety Focus:** Dilution recommendations provide crucial safety warnings for operators handling cosmetic ingredients, decreasing liability in essential oil processing.
3.  **Actionable Blending Ratios:** The prompt forces the AI to output specific percentages (e.g. 0.5% facial, 2.0% body) rather than vague terms like "dilute appropriately".
