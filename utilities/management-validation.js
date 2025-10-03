const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const validate = {};

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name validation (text only)
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .isLength({ min: 1 })
      .withMessage("Provide a valid classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error("This classification already exists.");
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Inventroy Data Validation Rules
 * ********************************* */

validate.inventoryRules = () => {
  return [
    // inv make validation
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid inventory make."),

    // inv model validation
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid inventory model."),

    // inv description validation
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid inventory description."),

    // inv image path validation
    body("inv_image")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Please provide a valid image path."),

    // inv image thumbnail validation
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Please provide a valid thumbnail image path."),

    // inv_price validation (decimal or integer)
    body("inv_price")
      .trim()
      .notEmpty()
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("Price must be a valid number (integer or decimal)."),

    // inv_year validation (4-digit year)
    body("inv_year")
      .trim()
      .notEmpty()
      .matches(/^\d{4}$/)
      .withMessage("Please provide a valid 4-digit year."),

    // inv_miles validation (digits only, no commas or dots)
    body("inv_miles")
      .trim()
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage("Miles must contain only digits (no commas or dots)."),

    // inv_color validation (text only, no digits)
    body("inv_color")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Color must contain only letters."),

    // inv_classification_id validation
    body("classification_id")
      .trim()
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage("Classification id is required."),
  ];
};

/* ******************************
 * Check inventory data and return errors
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

/* ********************************************
 * Check inventory data to be updated and return errors
 * ******************************************* */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    const classificationList = await utilities.buildClassificationList();
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    );
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      classificationList,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;
