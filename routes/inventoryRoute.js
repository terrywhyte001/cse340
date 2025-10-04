// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const validate = require("../utilities/management-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleById));

// Management routes
router.get("/", 
  utilities.checkLogin,
  utilities.checkEmployeeAdmin,
  utilities.handleErrors(invController.showManagementView)
);

// Add classification routes
router.get("/add-classification", 
  utilities.checkLogin,
  utilities.checkEmployeeAdmin,
  utilities.handleErrors(invController.showAddClassificationView)
);

router.post("/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeAdmin,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory routes
router.get("/add-inventory", 
  utilities.checkLogin,
  utilities.checkEmployeeAdmin,
  utilities.handleErrors(invController.showAddInventoryView)
);

router.post("/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeAdmin,
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

// Get inventory by classification for management view
router.get("/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Edit inventory routes
router.get("/edit/:invId", 
  utilities.checkLogin,
  utilities.handleErrors(invController.showEditView)
);

router.post("/update",
  utilities.checkLogin,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete inventory routes
router.get("/delete/:invId", 
  utilities.checkLogin,
  utilities.handleErrors(invController.showDeleteView)
);

router.post("/delete",
  utilities.checkLogin,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;

// Task 1: Management View
router.get(
  "/",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  utilities.handleErrors(invController.showManagementView)
);

// Task 2: Get Classification View (Restricted)
router.get(
  "/add-classification",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  utilities.handleErrors(invController.showAddClassificationView)
);

// Add Classification (Restricted)
router.post(
  "/add-classification",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Task 3: Get Inventory view (Restricted)
router.get(
  "/add-inventory",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  utilities.handleErrors(invController.showAddInventoryView)
);

//  Add Inventory (Restricted)
router.post(
  "/add-inventory",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

//Edit inventory route
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Edit vehicle inventory by id and show view
router.get(
  "/edit/:inv_id",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  utilities.handleErrors(invController.editInventoryView)
);
// Update vehnicle inventory data
router.post(
  "/update",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete confirmation view of vehicle inventory
router.get(
  "/delete/:inv_id",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  utilities.handleErrors(invController.deleteInventoryView)
);

// Delete route to remove the actual vehicle inventory
router.post(
  "/delete",
  utilities.authMiddleware,
  utilities.authorizeAdminOrEmployee,
  utilities.handleErrors(invController.deleteInventory)
);

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get vehicle detalils by inventory Id
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

module.exports = router;
