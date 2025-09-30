// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Inventory = require("./models/inventoryModel.js"); // 👈 added .js extension

const vehicles = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 25000,
    mileage: 15000,
    description: "Reliable mid-size sedan with advanced safety features.",
    image: "/images/camry.jpg",
    classification: "Sedan",
  },
  {
    make: "Ford",
    model: "F-150",
    year: 2021,
    price: 35000,
    mileage: 20000,
    description: "Best-selling pickup truck with powerful towing capacity.",
    image: "/images/f150.jpg",
    classification: "Truck",
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2023,
    price: 32000,
    mileage: 5000,
    description: "Compact SUV with spacious interior and modern tech.",
    image: "/images/crv.jpg",
    classification: "SUV",
  },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB for seeding...");
    await Inventory.deleteMany({});
    await Inventory.insertMany(vehicles);
    console.log("✅ Vehicles seeded successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
