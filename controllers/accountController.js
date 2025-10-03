const accountModel = require("../models/account-model");
const utilities = require("../utilities/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  let account = null;

  if (res.locals.accountData) {
    const account_id = res.locals.accountData.account_id;
    account = await accountModel.getAccountById(account_id);
  }
  res.render("account/login", {
    title: "Login",
    nav,
    user: account,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  let account = null;

  if (res.locals.accountData) {
    const account_id = res.locals.accountData.account_id;
    account = await accountModel.getAccountById(account_id);
  }
  res.render("account/register", {
    title: "Register",
    nav,
    user: account,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res
      .status(201)
      .render("account/login", { title: "Login", nav, errors: null });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", { title: "Registration", nav });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      req.flash("notice", "Login was successful.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function renderAccountPage(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  res.render("account/account", {
    title: "Account Managemen",
    nav,
    user: account,
    errors: null,
    messages: req.flash("notice"),
  });
}

/* ****************************************
 *  Show the update account page
 * *************************************** */
async function showUpdateAccountView(req, res) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const account = await accountModel.getAccountById(account_id);
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    user: account,
    errors: null,
  });
}

/* ****************************************
 *  Update account information
 * *************************************** */
async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const data = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (data) {
    req.flash("notice", "Acount information updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.redirect(`/account/update`);
  }
}

/* ****************************************
 *  Update account password
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing password update."
    );
    res.redirect(`/account/update`);
  }

  const passwordUpdateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (passwordUpdateResult) {
    req.flash("notice", "Password updated successfully.");
    res.status(201).redirect("/account/");
  } else {
    req.flash("notice", "Failed to update password. Try again.");
    res.redirect(`/account/update`);
  }
}

/* ****************************************
 *  Logout Process
 * *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt"); // Remove the JWT cookie
  req.flash("notice", "You have been logged out.");
  res.redirect("/"); // Redirect to home page
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  renderAccountPage,
  showUpdateAccountView,
  updateAccountInfo,
  updatePassword,
  logout,
};
