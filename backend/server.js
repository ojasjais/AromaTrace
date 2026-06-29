const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AromaTrace Backend Running");
});

const batches = [
  {
    id: 1,
    name: "Rosemary Oil",
    quantity: 50,
    status: "Completed"
  },
  {
    id: 2,
    name: "Lavender Oil",
    quantity: 30,
    status: "Processing"
  }
];

// API 1 Get Batches

app.get("/api/batches", (req, res) => {
  res.status(200).json(batches);
});

//API 2 Get Single Batch

app.get("/api/batches/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const batch = batches.find((b) => b.id === id);

  if (!batch) {
    return res.status(404).json({
      message: "Batch not found",
    });
  }

  res.status(200).json(batch);
});

//API 3 Create Batch (post)

app.post("/api/batches", (req, res) => {
  const newBatch = {
    id: batches.length + 1,
    name: req.body.name,
    quantity: req.body.quantity,
    status: req.body.status,
  };

  batches.push(newBatch);

  res.status(201).json(newBatch);
});

//API 4 Update Batch(put)

app.put("/api/batches/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const batch = batches.find((b) => b.id === id);

  if (!batch) {
    return res.status(404).json({
      message: "Batch not found",
    });
  }

  batch.name = req.body.name || batch.name;
  batch.quantity = req.body.quantity || batch.quantity;
  batch.status = req.body.status || batch.status;

  res.status(200).json(batch);
});

//API 5 Delete Batch(delete)

app.delete("/api/batches/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = batches.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Batch not found",
    });
  }

  batches.splice(index, 1);

  res.status(204).send();
});

//API 6 Search Batch(get)

app.get("/api/batches/search/:name", (req, res) => {
  const name = req.params.name.toLowerCase();

  const result = batches.filter((b) =>
    b.name.toLowerCase().includes(name)
  );

  res.status(200).json(result);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

