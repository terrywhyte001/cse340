const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  registration_code = null
) {
  try {
    let account_type = 'Client';
    
    // Check registration code for special access
    if (registration_code === "Empl!340") {
      account_type = 'Employee';
    } else if (registration_code === "Admin!340") {
      account_type = 'Admin';
    }

    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
      account_type,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Update Account Type
 * ***************************** */
async function updateAccountType(account_id, account_type) {
  try {
    const sql = "UPDATE account SET account_type = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_type, account_id]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

async function getAccountById(accountId) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [accountId]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/* *****************************
 * Process for undating account details
 * ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *",
      [account_firstname, account_lastname, account_email, account_id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


/* ************************************
 * Process for undating account password
 * ***************************** ******/
async function updatePassword(accountId, hashedPassword){
  try {
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *",
      [hashedPassword, accountId]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  updateAccountType,
};
