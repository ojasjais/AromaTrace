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

router.get("/", getBatches);

router.get("/search/:name", searchBatch);

router.get("/:id", getBatch);

router.post("/", createBatch);

router.put("/:id", updateBatch);

router.delete("/:id", deleteBatch);

module.exports = router;