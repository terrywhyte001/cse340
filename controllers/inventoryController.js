const Inventory = require("../models/Inventory");

// Get all vehicles
exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Inventory.find();
    res.render("inventory/index", { vehicles });
  } catch (err) {
    next(err);
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Inventory.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).render("error/error", { message: "Vehicle not found" });
    }
    res.render("inventory/detail", { vehicle });
  } catch (err) {
    next(err);
  }
};

// Create new vehicle
exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = new Inventory(req.body);
    await vehicle.save();
    res.redirect("/inventory");
  } catch (err) {
    next(err);
  }
};

// Update vehicle
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).render("error/error", { message: "Vehicle not found" });
    }
    res.redirect(`/inventory/${vehicle._id}`);
  } catch (err) {
    next(err);
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Inventory.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).render("error/error", { message: "Vehicle not found" });
    }
    res.redirect("/inventory");
  } catch (err) {
    next(err);
  }
};
