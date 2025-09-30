const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.get("/type/:classification", inventoryController.buildClassificationView);
router.get("/detail/:id", inventoryController.buildDetailView);

module.exports = router;
