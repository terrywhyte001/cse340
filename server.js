// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const inventoryRoutes = require("./routes/inventoryRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Routes ----------
app.use("/inventory", inventoryRoutes);

// Intentional error route for testing
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional server error!"));
});

// ---------- 404 Handler ----------
app.use((req, res) => {
  // Safe fallback in case EJS is missing
  try {
    res.status(404).render("error/error", { message: "404 Not Found" });
  } catch {
    res.status(404).send("404 Not Found");
  }
});

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  try {
    res.status(500).render("error/error", { message: err.message || "Something went wrong!" });
  } catch {
    res.status(500).send(err.message || "Something went wrong!");
  }
});

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
