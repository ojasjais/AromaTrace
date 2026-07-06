const prisma = require("../config/prisma");

// GET All Batches
exports.getBatches = async (req, res) => {
  try {
    const batches = await prisma.batch.findMany();

    res.status(200).json(batches);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch batches",
    });
  }
};

// GET Single Batch
exports.getBatch = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const batch = await prisma.batch.findUnique({
      where: { id },
    });

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch batch",
    });
  }
};

// CREATE Batch
exports.createBatch = async (req, res) => {
  try {
    const { name, quantity, status } = req.body;

    const newBatch = await prisma.batch.create({
      data: {
        name,
        quantity: Number(quantity),
        status,
      },
    });

    res.status(201).json(newBatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create batch",
      error: error.message,
    });
  }
};

// UPDATE Batch
exports.updateBatch = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name, quantity, status } = req.body;

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        name,
        quantity: Number(quantity),
        status,
      },
    });

    res.status(200).json(batch);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    res.status(500).json({
      message: "Failed to update batch",
      error: error.message,
    });
  }
};

// DELETE Batch
exports.deleteBatch = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.batch.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete batch",
      error: error.message,
    });
  }
};

// SEARCH Batch
exports.searchBatch = async (req, res) => {
  try {
    const name = req.params.name;

    const result = await prisma.batch.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to search batches",
      error: error.message,
    });
  }
};