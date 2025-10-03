// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const managementValidate = require("../utilities/management-validation");

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
  managementValidate.classificationRules(),
  managementValidate.checkClassificationData,
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
  managementValidate.inventoryRules(),
  managementValidate.checkInvData,
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
  managementValidate.inventoryRules(),
  managementValidate.checkUpdateData,
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
