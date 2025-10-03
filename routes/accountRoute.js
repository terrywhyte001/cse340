// Import required modules
const express = require("express");
const router = express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const accountValidate = require("../utilities/account-validation");

// Route to serve login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Account management route
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.renderAccountPage)
);

// Route to build registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Add the registration POST route
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Account update page
router.get(
  "/update",
  utilities.authMiddleware,
  utilities.handleErrors(accountController.showUpdateAccountView)
);

router.post(
  "/update",
  utilities.authMiddleware,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

router.post(
  "/update-password",
  utilities.authMiddleware,
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

router.get(
  "/logout",
  utilities.authMiddleware,
  utilities.handleErrors(accountController.logout)
);

// Export the router
module.exports = router;
