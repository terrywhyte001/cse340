 const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
  price: { type: Number, required: true, min: 0 },
  mileage: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, default: "" },
  image: { type: String, trim: true, default: "/images/no-image.png" },
  classification_id: { type: mongoose.Schema.Types.ObjectId, ref: "Classification", required: true },
  createdAt: { type: Date, default: Date.now }
});

// Optional: index for faster searches by classification
inventorySchema.index({ classification_id: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);

