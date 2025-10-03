const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const commentModel = require("../models/comment-model");

const invCont = {};

/* ****************************************
 *  Deliver inventroty management view
 * *************************************** */

invCont.showManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    user: account,
    classificationSelect,
    errors: null,
  });
};

/* ****************************************
 *  Deliver classification view
 * *************************************** */
invCont.showAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    user: account,
    errors: null,
  });
};

/* ****************************************
 *  Process Classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const { classification_name } = req.body;
  const data = await invModel.insertClassification(classification_name);
  if (data.rowCount > 0) {
    req.flash(
      "notice",
      `${classification_name} classification added successfully.`
    );
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      user: account,
      errors: null,
    });
  } else {
    req.flash("notice", "Error adding classification.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ****************************************
 *  Deliver vehicle view
 * *************************************** */
invCont.showAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    user: account,
    classificationList,
    errors: null,
  });
};

/* ****************************************
 *  Process Adding Inventory
 * *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const data = await invModel.insertInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (data.rowCount > 0) {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    req.flash("notice", "Vehicle added successfully.");
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      user: account,
      classificationSelect: classificationSelect,
      errors: null,
    });
  } else {
    req.flash("notice", "Error adding Vehicle.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    });
  }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  let account = null;

  if (res.locals.accountData) {
    const account_id = res.locals.accountData.account_id;
    account = await accountModel.getAccountById(account_id);
  }
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    user: account,
    grid,
  });
};

// Build vehicle detail view
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId;
  const vehicle = await invModel.getVehicleById(invId);
  const comments = await commentModel.getCommentsByVehicleId(invId);
  let nav = await utilities.getNav();
  let account = null;

  if (res.locals.accountData) {
    const account_id = res.locals.accountData.account_id;
    account = await accountModel.getAccountById(account_id);
  }
  const vehicleDetails = await utilities.buildVehicleDetails(vehicle);
  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    user: account,
    vehicleDetails,
    comments,
    invId,
    vehicle
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***********************************************
 *  Return view of the selected Inventory ID to be edited
 * ********************************************** */
invCont.editInventoryView = async (req, res, next) => {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getVehicleById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    user: account,

    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ****************************************
 *  Process Updating Inventory
 * *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      user: account,
      classificationSelect: classificationSelect,
      errors: req.flash("notice"),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***********************************************
 *  Return view of the selected Inventory ID to be deleted
 * ********************************************** */
invCont.deleteInventoryView = async (req, res, next) => {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getVehicleById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    user: account,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id,
  });
};

/* ****************************************
 *  Process Deleting Inventory
 * *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body;
  const deletedResult = await invModel.deleteInventory(inv_id);
  if (deletedResult) {
    req.flash("notice", "The inventory was deleted successfully");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render(`inventory/delete-confirm/${inv_id}`);
  }
};

module.exports = invCont;
