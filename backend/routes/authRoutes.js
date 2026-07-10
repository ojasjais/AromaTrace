const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const { validateRegister, validateLogin } = require("../middleware/validateAuth");
const { authLimiter } = require("../middleware/rateLimiter");
const { passport, googleOAuthEnabled, issueTokenForUser } = require("../config/passport");

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", requireAuth, getMe);

if (googleOAuthEnabled()) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    }),
    (req, res) => {
      const token = issueTokenForUser(req.user);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/login?token=${token}`);
    }
  );
} else {
  const prisma = require("../config/prisma");

  router.get("/google", (req, res) => {
    res.redirect(`/api/auth/google/mock-callback`);
  });

  router.get("/google/mock-callback", async (req, res) => {
    try {
      let user = await prisma.user.findUnique({ where: { email: "mockuser@example.com" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Mock Google Operator",
            email: "mockuser@example.com",
            password: null,
            role: "user",
            provider: "google",
            providerId: "mock_google_id_12345",
          },
        });
      }
      const token = issueTokenForUser(user);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/login?token=${token}`);
    } catch (error) {
      console.error("Mock OAuth Callback Error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  });
}

module.exports = router;
