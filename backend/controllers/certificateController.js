const prisma = require("../config/prisma");

let memoryCertificates = [
  {
    id: 1,
    certificateNumber: "CERT-2026-8812",
    buyerId: 1,
    buyerName: "Aetheria Perfumes Ltd.",
    batchId: 2,
    batchName: "Lavender Oil",
    status: "Valid",
    issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    certificateNumber: "CERT-2026-4409",
    buyerId: 2,
    buyerName: "Botanica Botanicals Co.",
    batchId: 4,
    batchName: "Peppermint Oil",
    status: "Valid",
    issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    certificateNumber: "CERT-2025-9011",
    buyerId: 3,
    buyerName: "Zenith Essential Oils",
    batchId: 7,
    batchName: "Rosemary Oil",
    status: "Expired",
    issueDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

// GET All Certificates
exports.getCertificates = async (req, res) => {
  try {
    const { search, status } = req.query;
    let certificates;

    try {
      const whereClause = {};
      if (status && status !== "All") {
        whereClause.status = status;
      }
      if (search) {
        whereClause.OR = [
          { certificateNumber: { contains: search, mode: "insensitive" } },
          { buyerName: { contains: search, mode: "insensitive" } },
          { batchName: { contains: search, mode: "insensitive" } },
        ];
      }

      certificates = await prisma.certificate.findMany({
        where: whereClause,
        orderBy: { issueDate: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB Certificate fallback active:", dbErr.message);
      certificates = memoryCertificates;
      if (status && status !== "All") {
        certificates = certificates.filter((c) => c.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        certificates = certificates.filter(
          (c) =>
            c.certificateNumber.toLowerCase().includes(q) ||
            c.buyerName.toLowerCase().includes(q) ||
            (c.batchName && c.batchName.toLowerCase().includes(q))
        );
      }
    }

    res.status(200).json(certificates);
  } catch (error) {
    console.error("getCertificates error:", error);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

// GET Single Certificate
exports.getCertificate = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let certificate;

    try {
      certificate = await prisma.certificate.findUnique({ where: { id } });
    } catch {
      certificate = memoryCertificates.find((c) => c.id === id);
    }

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json(certificate);
  } catch (error) {
    console.error("getCertificate error:", error);
    res.status(500).json({ message: "Failed to fetch certificate" });
  }
};

// CREATE / GENERATE Certificate
exports.createCertificate = async (req, res) => {
  try {
    const { buyerId, buyerName, batchId, batchName, expiryDays } = req.body;

    if (!buyerName) {
      return res.status(400).json({ message: "Buyer name is required" });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certificateNumber = `CERT-2026-${randomSuffix}`;
    const issueDate = new Date();
    const days = parseInt(expiryDays, 10) || 365;
    const expiryDate = new Date(issueDate.getTime() + days * 24 * 60 * 60 * 1000);

    let newCertificate;
    try {
      newCertificate = await prisma.certificate.create({
        data: {
          certificateNumber,
          buyerId: buyerId ? parseInt(buyerId, 10) : null,
          buyerName,
          batchId: batchId ? parseInt(batchId, 10) : null,
          batchName: batchName || null,
          status: "Valid",
          issueDate,
          expiryDate,
        },
      });
    } catch (dbErr) {
      console.warn("DB Create Certificate fallback active:", dbErr.message);
      newCertificate = {
        id: Date.now(),
        certificateNumber,
        buyerId: buyerId ? parseInt(buyerId, 10) : null,
        buyerName,
        batchId: batchId ? parseInt(batchId, 10) : null,
        batchName: batchName || null,
        status: "Valid",
        issueDate: issueDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
      };
      memoryCertificates.unshift(newCertificate);
    }

    res.status(201).json(newCertificate);
  } catch (error) {
    console.error("createCertificate error:", error);
    res.status(500).json({ message: "Failed to generate certificate", error: error.message });
  }
};

// DELETE Certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    try {
      await prisma.certificate.delete({ where: { id } });
    } catch {
      memoryCertificates = memoryCertificates.filter((c) => c.id !== id);
    }

    res.status(204).send();
  } catch (error) {
    console.error("deleteCertificate error:", error);
    res.status(500).json({ message: "Failed to delete certificate", error: error.message });
  }
};
