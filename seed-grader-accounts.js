const bcrypt = require("bcryptjs");
const db = require("./database");

async function seedGraderAccounts() {
  try {
    console.log("Creating grader test accounts...");

    // First, add unique constraint on email if it doesn't exist
    try {
      await db.query(`ALTER TABLE account ADD CONSTRAINT unique_email UNIQUE (account_email)`);
      console.log("Added unique constraint on email");
    } catch (error) {
      console.log("Unique constraint already exists or error:", error.message);
    }

    // Basic Client Account
    const basicPassword = await bcrypt.hash("Basic123!", 10);
    
    // Check if account exists first
    const existingBasic = await db.query("SELECT * FROM account WHERE account_email = $1", ['basic@cse340.net']);
    if (existingBasic.rows.length === 0) {
      await db.query(`
        INSERT INTO account (
          account_firstname,
          account_lastname,
          account_email,
          account_password,
          account_type
        )
        VALUES ($1, $2, $3, $4, $5)
      `, ['Basic', 'Client', 'basic@cse340.net', basicPassword, 'Client']);
      console.log("✅ Created Basic Client account");
    } else {
      console.log("ℹ️ Basic Client account already exists");
    }

    // Manager/Employee Account
    const managerPassword = await bcrypt.hash("Manager123!", 10);
    await db.query(`
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_email) DO UPDATE SET
        account_password = EXCLUDED.account_password,
        account_type = EXCLUDED.account_type
    `, ['Manager', 'Employee', 'manager@cse340.net', managerPassword, 'Employee']);

    // Admin Account
    const adminPassword = await bcrypt.hash("Admin123!", 10);
    await db.query(`
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_email) DO UPDATE SET
        account_password = EXCLUDED.account_password,
        account_type = EXCLUDED.account_type
    `, ['Admin', 'User', 'admin@cse340.net', adminPassword, 'Admin']);

    console.log("✅ Grader test accounts created successfully!");
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