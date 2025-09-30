const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  color: { type: String },
  mileage: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
