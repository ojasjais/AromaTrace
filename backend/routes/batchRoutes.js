const express = require("express");
const router = express.Router();

const {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
  searchBatch,
} = require("../controllers/batchController");
const requireAuth = require("../middleware/requireAuth");

// Public read endpoints (keeps Home page demo working without login)
router.get("/", getBatches);
router.get("/search/:name", searchBatch);
router.get("/:id", getBatch);

// Protected write endpoints (require JWT)
router.post("/", requireAuth, createBatch);
router.put("/:id", requireAuth, updateBatch);
router.delete("/:id", requireAuth, deleteBatch);

module.exports = router;