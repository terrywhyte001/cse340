const bcrypt = require("bcryptjs");
const db = require("./database");

async function seedGraderAccounts() {
  try {
    console.log("Creating grader test accounts...");

    // Basic Client Account
    const basicPassword = await bcrypt.hash("Basic123!", 10);
    const existingBasic = await db.query("SELECT * FROM account WHERE account_email = $1", ['basic@cse340.net']);
    if (existingBasic.rows.length === 0) {
      await db.query(`
        INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
        VALUES ($1, $2, $3, $4, $5)
      `, ['Basic', 'Client', 'basic@cse340.net', basicPassword, 'Client']);
      console.log("✅ Created Basic Client account");
    } else {
      console.log("ℹ️ Basic Client account already exists");
    }

    // Manager/Employee Account
    const managerPassword = await bcrypt.hash("Manager123!", 10);
    const existingManager = await db.query("SELECT * FROM account WHERE account_email = $1", ['manager@cse340.net']);
    if (existingManager.rows.length === 0) {
      await db.query(`
        INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
        VALUES ($1, $2, $3, $4, $5)
      `, ['Manager', 'Employee', 'manager@cse340.net', managerPassword, 'Employee']);
      console.log("✅ Created Manager/Employee account");
    } else {
      console.log("ℹ️ Manager/Employee account already exists");
    }

    // Admin Account
    const adminPassword = await bcrypt.hash("Admin123!", 10);
    const existingAdmin = await db.query("SELECT * FROM account WHERE account_email = $1", ['admin@cse340.net']);
    if (existingAdmin.rows.length === 0) {
      await db.query(`
        INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
        VALUES ($1, $2, $3, $4, $5)
      `, ['Admin', 'User', 'admin@cse340.net', adminPassword, 'Admin']);
      console.log("✅ Created Admin account");
    } else {
      console.log("ℹ️ Admin account already exists");
    }

    console.log("");
    console.log("📋 TEST ACCOUNTS FOR GRADING:");
    console.log("Basic Client: basic@cse340.net / Basic123!");
    console.log("Manager: manager@cse340.net / Manager123!");
    console.log("Admin: admin@cse340.net / Admin123!");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating grader accounts:", error);
    process.exit(1);
  }
}

seedGraderAccounts();