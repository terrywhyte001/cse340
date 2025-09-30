const Inventory = require("../models/Inventory");


// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Inventory.find();
    res.render("inventory/index", { vehicles });
  } catch (err) {
    res.status(500).render("error/error", { message: "Error fetching vehicles" });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Inventory.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).render("error/error", { message: "Vehicle not found" });
    }
    res.render("inventory/detail", { vehicle });
  } catch (err) {
    res.status(500).render("error/error", { message: "Error fetching vehicle" });
  }
};

