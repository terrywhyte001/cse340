const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities/index");

// Intentional error route
router.get("/trigger", utilities.handleErrors(errorController.triggerError));

module.exports = router;