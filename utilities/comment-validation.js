const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const commentModel = require("../models/comment-model");

const validate = {};

/*  **********************************
 *  Comment Data Validation Rules
 * ********************************* */
validate.commentRules = () => {
  return [
    // classification name validation (text only)
    body("comment_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid inventory comment"),
  ];
};

/* ******************************
 * Check data and return errors
 * ***************************** */
validate.checkCommentData = async (req, res, next) => {
  const { inv_id } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    const vehicle = await invModel.getVehicleById(inv_id);
    const comments = await commentModel.getCommentsByVehicleId(inv_id);
    const vehicleDetails = await utilities.buildVehicleDetails(vehicle);

    const nav = await utilities.getNav();
    if (res.locals.accountData) {
      const account_id = res.locals.accountData.account_id;
      account = await accountModel.getAccountById(account_id);
    }
    return res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleDetails,
      comments,
      invId: inv_id,
      user: account,
      vehicle,
      errors,
    });
  }

  next();
};

module.exports = validate;
