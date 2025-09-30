const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  classification: { type: String, required: true }
});

module.exports = mongoose.model("Inventory", inventorySchema);
