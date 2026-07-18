const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { z } = require("zod");

const { getBatchInsights } = require("../controllers/aiController");
const requireAuth = require("../middleware/requireAuth");

// Define a rate limiter specifically for the AI endpoint to prevent abuse
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 15, // Max 15 requests per 5 minutes per IP
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI request attempts. Please try again in 5 minutes." },
});

// Zod validation schema for POST /api/ai/insights
const aiRequestSchema = z.object({
  batchId: z.union([
    z.number(),
    z.string().transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) throw new Error("batchId must be a valid integer");
      return parsed;
    }),
  ]),
  mode: z.enum(["botanical", "formulation", "optimization"]).optional().default("botanical"),
  customQuery: z
    .string()
    .max(500, "Custom questions are limited to 500 characters")
    .optional(),
});

// Validation middleware
const validateAIRequest = (req, res, next) => {
  const result = aiRequestSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }

  req.body = result.data;
  next();
};

// POST /api/ai/insights - Protected with JWT, rate limited, and validated
router.post("/insights", requireAuth, aiLimiter, validateAIRequest, getBatchInsights);

module.exports = router;
