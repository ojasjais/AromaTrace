const express = require("express");
const router = express.Router();
const {
  getCertificates,
  getCertificate,
  createCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, getCertificates);
router.get("/:id", requireAuth, getCertificate);
router.post("/", requireAuth, createCertificate);
router.delete("/:id", requireAuth, deleteCertificate);

module.exports = router;
