const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/productRoutes");
const batchRoutes = require("./routes/batchRoutes");

app.get("/", (req, res) => {
  res.send("AromaTrace Backend Running");
});

app.use("/api/products", productRoutes);
app.use("/api/batches", batchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
