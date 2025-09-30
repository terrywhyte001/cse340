const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Routes
router.get("/", inventoryController.getAllVehicles);
router.get("/:id", inventoryController.getVehicleById);

module.exports = router;
