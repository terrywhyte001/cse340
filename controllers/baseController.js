const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  let account = null;

  if (res.locals.accountData) {
    const account_id = res.locals.accountData.account_id;
    account = await accountModel.getAccountById(account_id);
  }
  req.flash("notice", "This is a flash message.");
  res.render("index", { 
    title: "Home", 
    nav, 
    user: account, 
  });
};

module.exports = baseController;
