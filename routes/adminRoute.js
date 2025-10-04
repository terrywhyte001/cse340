const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/index");

router.get("/makeemployee/:email", async (req, res) => {
  try {
    const account = await accountModel.getAccountByEmail(req.params.email);
    if (!account) {
      return res.status(404).send("Account not found");
    }
    
    const result = await accountModel.updateAccountType(account.account_id, "Employee");
    if (result) {
      res.send(`Account ${req.params.email} has been updated to Employee type. Please <a href="/account/login">login again</a> to see the changes.`);
    } else {
      res.status(500).send("Error updating account type");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error updating account type");
  }
});

// Check account type
router.get("/checktype/:email", async (req, res) => {
  try {
    const account = await accountModel.getAccountByEmail(req.params.email);
    if (!account) {
      return res.status(404).send("Account not found");
    }
    res.send(`Account type: ${account.account_type}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error checking account type");
  }
});

module.exports = router;