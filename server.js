require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const inventoryRoutes = require("./routes/inventoryRoutes"); // ✅ corrected filename

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

// Intentional error route for Task 3
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional server error!"));
});

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error/error", { message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error/error", { message: "404 Not Found" });
});

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // stop app if DB fails
  });

