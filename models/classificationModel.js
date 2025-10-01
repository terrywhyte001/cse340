const mongoose = require("mongoose");

const classificationSchema = new mongoose.Schema({
  classification_name: { type: String, required: true, trim: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Classification", classificationSchema);
