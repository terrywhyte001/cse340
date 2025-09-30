require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/inventory", inventoryRoutes);

// Intentional error route (Task 3)
app.get("/trigger-error", (req, res, next) => {
  try {
    throw new Error("Intentional server error!");
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error/error", { message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error/error", { message: "404 Not Found" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
