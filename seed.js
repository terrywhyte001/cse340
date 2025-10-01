require("dotenv").config();
const mongoose = require("mongoose");
const Inventory = require("./models/inventoryModel.js");
const Classification = require("./models/classificationModel.js"); // New classification model

const classificationsData = [
  { classification_name: "SUV" },
  { classification_name: "Sedan" },
];

const vehiclesData = [
  {
    inv_make: "Toyota",
    inv_model: "Sienna",
    inv_year: 2023,
    inv_price: 42000,
    inv_mileage: 12000,
    inv_description: "Spacious and reliable SUV perfect for family trips.",
    inv_image: "/images/sienna.jpeg",
    classification_name: "SUV"
  },
  {
    inv_make: "Toyota",
    inv_model: "Camry",
    inv_year: 2022,
    inv_price: 25000,
    inv_mileage: 15000,
    inv_description: "Reliable mid-size sedan with advanced safety features.",
    inv_image: "/images/toyota_camry_00-1199x799.jpg",
    classification_name: "Sedan"
  },
  {
    inv_make: "Toyota",
    inv_model: "Sienna XLE",
    inv_year: 2024,
    inv_price: 47000,
    inv_mileage: 8000,
    inv_description: "Premium SUV with luxury features and comfort for long drives.",
    inv_image: "/images/Toyota_Sienna_XLE_from_Nigeria_(15148474245).jpg",
    classification_name: "SUV"
  },
  {
    inv_make: "Lexus",
    inv_model: "RX 500h F SPORT+",
    inv_year: 2024,
    inv_price: 65000,
    inv_mileage: 5000,
    inv_description: "High-performance luxury SUV with cutting-edge technology.",
    inv_image: "/images/Lexus_RX_500h_F_SPORT+_(V)_–_f_14072024.jpg",
    classification_name: "SUV"
  },
];

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB for Week 4 seeding...");

    // Clear existing data
    await Inventory.deleteMany({});
    await Classification.deleteMany({});
    console.log("🗑️  Cleared existing vehicles and classifications");

    // Insert classifications
    const classifications = await Classification.insertMany(classificationsData);

    // Map classification_name to classification_id
    const vehiclesWithIds = vehiclesData.map(vehicle => {
      const classification = classifications.find(c => c.classification_name === vehicle.classification_name);
      return { ...vehicle, classification_id: classification._id };
    });

    // Insert vehicles
    await Inventory.insertMany(vehiclesWithIds);
    console.log("✅ Vehicles seeded successfully with classifications!");

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });

