// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Inventory = require("./models/inventoryModel.js");

// Arrays of sample data to randomize vehicles
const makes = ["Toyota", "Ford", "Honda", "Chevrolet", "Nissan", "BMW", "Kia"];
const models = ["Camry", "F-150", "CR-V", "Altima", "X5", "Sorento", "Silverado"];
const classifications = ["Sedan", "Truck", "SUV", "Coupe", "Van", "Hatchback"];
const descriptions = [
  "Reliable and efficient vehicle.",
  "Spacious interior with modern tech.",
  "Best-selling model with great reviews.",
  "Fuel-efficient and comfortable ride.",
  "Powerful engine with excellent towing capacity.",
];

// Function to generate a random integer between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate random vehicle objects
const generateVehicles = (num) => {
  const vehicles = [];
  for (let i = 0; i < num; i++) {
    const makeIndex = randomInt(0, makes.length - 1);
    const modelIndex = randomInt(0, models.length - 1);
    const classificationIndex = randomInt(0, classifications.length - 1);
    const descriptionIndex = randomInt(0, descriptions.length - 1);

    vehicles.push({
      make: makes[makeIndex],
      model: models[modelIndex],
      year: randomInt(2015, 2025),
      price: randomInt(15000, 50000),
      mileage: randomInt(0, 100000),
      description: descriptions[descriptionIndex],
      image: `/images/${models[modelIndex].toLowerCase()}.jpg`,
      classification: classifications[classificationIndex],
    });
  }
  return vehicles;
};

// Number of vehicles to seed
const NUM_VEHICLES = 20;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB for seeding...");

    // Clear existing data
    await Inventory.deleteMany({});

    // Insert random vehicles
    const vehicles = generateVehicles(NUM_VEHICLES);
    const inserted = await Inventory.insertMany(vehicles);
    console.log(`✅ ${inserted.length} vehicles seeded successfully!`);

    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
