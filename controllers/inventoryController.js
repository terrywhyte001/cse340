const Inventory = require("../models/inventoryModel");
const Classification = require("../models/classificationModel");
const Util = require("../utils/index");
const { validationResult } = require("express-validator");

// ----------------------
// Task 1: Management View
// ----------------------
exports.buildManagement = async (req, res) => {
  const message = req.flash("message").join(", ");
  res.render("inventory/management", { message });
};

// ----------------------
// Task 2: Add Classification
// ----------------------
exports.buildAddClassification = async (req, res) => {
  const message = req.flash("message").join(", ");
  res.render("inventory/add-classification", { message });
};

exports.addClassification = async (req, res) => {
  const errors = validationResult(req);
  const { classification_name } = req.body;

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      message: errors.array().map(err => err.msg).join(", "),
    });
  }

  try {
    await Classification.create({ classification_name });
    req.flash("message", `Classification "${classification_name}" added successfully`);
    res.redirect("/inv/manage");
  } catch (err) {
    console.error(err);
    res.render("inventory/add-classification", { message: "Error adding classification" });
  }
};

// ----------------------
// Task 3: Add Inventory
// ----------------------
exports.buildAddInventory = async (req, res) => {
  try {
    const classifications = await Classification.find();
    const classificationList = Util.buildClassificationList(classifications);
    const message = req.flash("message").join(", ");
    res.render("inventory/add-inventory", { classificationList, message, sticky: {} });
  } catch (err) {
    console.error(err);
    res.status(500).render("error/error", { message: "Error loading classifications" });
  }
};

exports.addInventory = async (req, res) => {
  const errors = validationResult(req);
  const sticky = req.body;

  if (!errors.isEmpty()) {
    const classifications = await Classification.find();
    const classificationList = Util.buildClassificationList(classifications, req.body.classification_id);
    return res.render("inventory/add-inventory", {
      classificationList,
      message: errors.array().map(err => err.msg).join(", "),
      sticky,
    });
  }

  try {
    await Inventory.create(req.body);
    req.flash("message", `Vehicle "${req.body.inv_make} ${req.body.inv_model}" added successfully`);
    res.redirect("/inv/manage");
  } catch (err) {
    console.error(err);
    const classifications = await Classification.find();
    const classificationList = Util.buildClassificationList(classifications, req.body.classification_id);
    res.render("inventory/add-inventory", {
      classificationList,
      message: "Error adding vehicle",
      sticky,
    });
  }
};

// ----------------------
// Existing Vehicle Routes
// ----------------------
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Inventory.find().populate("classification_id", "classification_name");
    res.render("inventory/index", { vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).render("error/error", { message: "Error fetching vehicles" });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Inventory.findById(req.params.id).populate("classification_id", "classification_name");
    if (!vehicle) {
      return res.status(404).render("error/error", { message: "Vehicle not found" });
    }
    res.render("inventory/detail", { vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).render("error/error", { message: "Error fetching vehicle" });
  }
};


