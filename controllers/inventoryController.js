const inventoryModel = require("../models/inventoryModel");
const utilities = require("../utilities");

async function buildClassificationView(req, res, next) {
  try {
    const classification = req.params.classification;
    const vehicles = await inventoryModel.getByClassification(classification);

    const grid = utilities.buildClassificationGrid(vehicles);
    res.render("inventory/classification", {
      title: `${classification} Vehicles`,
      nav: utilities.getNav(),
      grid
    });
  } catch (err) {
    next(err);
  }
}

async function buildDetailView(req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await inventoryModel.getById(vehicleId);

    if (!vehicle) {
      return res.status(404).render("error/error", { message: "Vehicle not found" });
    }

    const detail = utilities.buildDetailView(vehicle);
    res.render("inventory/detail", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      nav: utilities.getNav(),
      detail
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  buildClassificationView,
  buildDetailView
};
