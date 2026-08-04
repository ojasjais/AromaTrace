const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const { validateRegister, validateLogin } = require("../middleware/validateAuth");
const { authLimiter } = require("../middleware/rateLimiter");
const { passport, googleOAuthEnabled, issueTokenForUser } = require("../config/passport");

// const getFrontendUrl = (req) => {
//   const referer = req?.headers?.referer || req?.headers?.origin;
//   if (referer) {
//     try {
//       const urlObj = new URL(referer);
//       if (urlObj.hostname !== "localhost" && urlObj.hostname !== "127.0.0.1") {
//         return urlObj.origin;
//       }
//     } catch {
//       // invalid URL header
//     }
//   }

//   const envUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "";
//   if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
//     return envUrl;
//   }

//   if (envUrl) {
//     return envUrl;
//   }

//   return "http://localhost:5173";
// };

const getFrontendUrl = () => {
  return process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
};

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", requireAuth, getMe);

if (googleOAuthEnabled()) {
  router.get(
  "/google",
  (req, res, next) => {
    console.log("========== GOOGLE OAUTH ==========");
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
    console.log("Google Configured:", googleOAuthEnabled());
    console.log("==================================");

    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);
  // router.get(
  //   "/google",
  //   passport.authenticate("google", {
  //     scope: ["profile", "email"],
  //     prompt: "select_account",
  //     session: false,
  //   })
  // );

 router.get("/google/callback", (req, res, next) => {
  console.log("GOOGLE CALLBACK HIT");

  const frontendUrl = getFrontendUrl();

  passport.authenticate("google", { session: false }, (err, user) => {
    console.log("Passport Error:", err);
    console.log("User:", user);

    if (err || !user) {
      console.error("Google OAuth Error:", err);
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    const token = issueTokenForUser(user);

    console.log("Frontend URL:", frontendUrl);
    console.log("Redirect URL:", `${frontendUrl}/login?token=${token}`);

    return res.redirect(`${frontendUrl}/login?token=${token}`);
  })(req, res, next);
});

} else {
  const prisma = require("../config/prisma");

  router.get("/google", (req, res) => {
    res.redirect(`/api/auth/google/mock-callback`);
  });

  router.get("/google/mock-callback", async (req, res) => {
    const frontendUrl = getFrontendUrl();
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
      res.redirect(`${frontendUrl}/login?token=${token}`);
    } catch (error) {
      console.error("Mock OAuth Callback Error:", error);
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  });
}

module.exports = router;
