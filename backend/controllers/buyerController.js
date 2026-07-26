const prisma = require("../config/prisma");

// In-memory fallback dataset for seamless demo operation if database connection is transient
let memoryBuyers = [
  {
    id: 1,
    name: "Eleanor Vance",
    company: "Aetheria Perfumes Ltd.",
    email: "eleanor@aetheria.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Grasse, France",
    status: "Active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Marcus Aurelius Thorne",
    company: "Botanica Botanicals Co.",
    email: "m.thorne@botanicabotanicals.io",
    phone: "+44 20 7946 0912",
    address: "45 Kensington High St, London, UK",
    status: "Active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Sophia Lin",
    company: "Zenith Essential Oils",
    email: "sophia@zenitharoma.com",
    phone: "+65 6789 0123",
    address: "12 Marina Boulevard, Singapore",
    status: "Inactive",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET All Buyers
exports.getBuyers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let buyers;

    try {
      const whereClause = {};
      if (status && status !== "All") {
        whereClause.status = status;
      }
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      buyers = await prisma.buyer.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB Buyer fallback active:", dbErr.message);
      buyers = memoryBuyers;
      if (status && status !== "All") {
        buyers = buyers.filter((b) => b.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        buyers = buyers.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.company.toLowerCase().includes(q) ||
            b.email.toLowerCase().includes(q)
        );
      }
    }

    res.status(200).json(buyers);
  } catch (error) {
    console.error("getBuyers error:", error);
    res.status(500).json({ message: "Failed to fetch buyers" });
  }
};

// GET Single Buyer
exports.getBuyer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let buyer;

    try {
      buyer = await prisma.buyer.findUnique({ where: { id } });
    } catch {
      buyer = memoryBuyers.find((b) => b.id === id);
    }

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.status(200).json(buyer);
  } catch (error) {
    console.error("getBuyer error:", error);
    res.status(500).json({ message: "Failed to fetch buyer details" });
  }
};

// CREATE Buyer
exports.createBuyer = async (req, res) => {
  try {
    const { name, company, email, phone, address, status } = req.body;
    if (!name || !company || !email) {
      return res.status(400).json({ message: "Name, company, and email are required" });
    }

    let newBuyer;
    try {
      newBuyer = await prisma.buyer.create({
        data: {
          name,
          company,
          email,
          phone: phone || null,
          address: address || null,
          status: status || "Active",
        },
      });
    } catch (dbErr) {
      console.warn("DB Create Buyer fallback active:", dbErr.message);
      newBuyer = {
        id: Date.now(),
        name,
        company,
        email,
        phone: phone || null,
        address: address || null,
        status: status || "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryBuyers.unshift(newBuyer);
    }

    res.status(201).json(newBuyer);
  } catch (error) {
    console.error("createBuyer error:", error);
    res.status(500).json({ message: "Failed to create buyer", error: error.message });
  }
};

// UPDATE Buyer
exports.updateBuyer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, company, email, phone, address, status } = req.body;

    let updatedBuyer;
    try {
      updatedBuyer = await prisma.buyer.update({
        where: { id },
        data: {
          name,
          company,
          email,
          phone: phone || null,
          address: address || null,
          status,
        },
      });
    } catch (dbErr) {
      console.warn("DB Update Buyer fallback active:", dbErr.message);
      const index = memoryBuyers.findIndex((b) => b.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Buyer not found" });
      }
      memoryBuyers[index] = {
        ...memoryBuyers[index],
        name: name || memoryBuyers[index].name,
        company: company || memoryBuyers[index].company,
        email: email || memoryBuyers[index].email,
        phone: phone !== undefined ? phone : memoryBuyers[index].phone,
        address: address !== undefined ? address : memoryBuyers[index].address,
        status: status || memoryBuyers[index].status,
        updatedAt: new Date().toISOString(),
      };
      updatedBuyer = memoryBuyers[index];
    }

    res.status(200).json(updatedBuyer);
  } catch (error) {
    console.error("updateBuyer error:", error);
    res.status(500).json({ message: "Failed to update buyer", error: error.message });
  }
};

// DELETE Buyer
exports.deleteBuyer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    try {
      await prisma.buyer.delete({ where: { id } });
    } catch {
      memoryBuyers = memoryBuyers.filter((b) => b.id !== id);
    }

    res.status(204).send();
  } catch (error) {
    console.error("deleteBuyer error:", error);
    res.status(500).json({ message: "Failed to delete buyer", error: error.message });
  }
};
