const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { body } = require("express-validator");

// ----------------------
// Week 4: Management & Forms
// ----------------------

// Task 1: Management View
router.get("/manage", inventoryController.buildManagement);

// Task 2: Add Classification
router.get("/add-classification", inventoryController.buildAddClassification);
router.post(
  "/add-classification",
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Classification name is required")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("No spaces or special characters allowed"),
  inventoryController.addClassification
);

// Task 3: Add Inventory
router.get("/add-inventory", inventoryController.buildAddInventory);
router.post(
  "/add-inventory",
  [
    body("inv_make").trim().notEmpty().withMessage("Make is required"),
    body("inv_model").trim().notEmpty().withMessage("Model is required"),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year is invalid"),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price is invalid"),
    body("inv_mileage").isInt({ min: 0 }).withMessage("Mileage is invalid"),
    body("inv_description").trim().notEmpty().withMessage("Description is required"),
    body("classification_id").notEmpty().withMessage("Classification is required"),
  ],
  inventoryController.addInventory
);

// ----------------------
// Existing Vehicle Routes
// ----------------------

// List all vehicles
router.get("/", inventoryController.getAllVehicles);

// Vehicle detail by ID
router.get("/:id", inventoryController.getVehicleById);

module.exports = router;
