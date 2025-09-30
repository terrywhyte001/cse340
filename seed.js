require("dotenv").config();
const mongoose = require("mongoose");
const Inventory = require("./models/inventoryModel.js"); // Ensure correct path

const vehicles = [
  {
    make: "Toyota",
    model: "Sienna",
    year: 2023,
    price: 42000,
    mileage: 12000,
    description: "Spacious and reliable SUV perfect for family trips.",
    image: "/images/sienna.jpeg",
    classification: "SUV"
  },
  {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 25000,
    mileage: 15000,
    description: "Reliable mid-size sedan with advanced safety features.",
    image: "/images/toyota_camry_00-1199x799.jpg",
    classification: "Sedan"
  },
  {
    make: "Toyota",
    model: "Sienna XLE",
    year: 2024,
    price: 47000,
    mileage: 8000,
    description: "Premium SUV with luxury features and comfort for long drives.",
    image: "/images/Toyota_Sienna_XLE_from_Nigeria_(15148474245).jpg",
    classification: "SUV"
  },
  {
    make: "Lexus",
    model: "RX 500h F SPORT+",
    year: 2024,
    price: 65000,
    mileage: 5000,
    description: "High-performance luxury SUV with cutting-edge technology.",
    image: "/images/Lexus_RX_500h_F_SPORT+_(V)_–_f_14072024.jpg",
    classification: "SUV"
  },
];

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB for seeding...");
    await Inventory.deleteMany({});
    console.log("🗑️  Cleared existing vehicles");
    await Inventory.insertMany(vehicles);
    console.log("✅ Vehicles seeded successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
