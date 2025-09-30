require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");

const inventoryRoutes = require("./routes/inventoryRoutes.js"); // ensure correct path

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Helper for safe rendering ----------
app.response.renderSafe = function(view, options = {}, status = 200) {
  try {
    this.status(status).render(view, options);
  } catch (err) {
    console.error("Render error:", err.message);
    this.status(status).send(options.message || "Error rendering view");
  }
};

// ---------- Routes ----------
app.use("/inventory", inventoryRoutes);

// ---------- Intentional Error Route ----------
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional server error!"));
});

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.renderSafe("error/error", { message: "404 Not Found" }, 404);
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error("💥 ERROR:", err.stack);
  res.renderSafe("error/error", { message: err.message || "Something went wrong!" }, 500);
});

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

