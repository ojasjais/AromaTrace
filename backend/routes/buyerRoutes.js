const express = require("express");
const router = express.Router();
const {
  getBuyers,
  getBuyer,
  createBuyer,
  updateBuyer,
  deleteBuyer,
} = require("../controllers/buyerController");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, getBuyers);
router.get("/:id", requireAuth, getBuyer);
router.post("/", requireAuth, createBuyer);
router.put("/:id", requireAuth, updateBuyer);
router.delete("/:id", requireAuth, deleteBuyer);

module.exports = router;
