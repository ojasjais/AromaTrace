const prisma = require("../config/prisma");

// GET All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventory: true,
        batches: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// GET Single Product
exports.getProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventory: true,
        batches: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

// CREATE Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        category,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

// UPDATE Product
exports.updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name, description, category } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

// DELETE Product
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};