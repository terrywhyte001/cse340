// database/index.js
const { Pool } = require("pg")
require("dotenv").config()

/* ***********************
 * SSL Config
 * - Render/Heroku need SSL
 * - Local (pgAdmin/Postgres) does NOT
 *************************/
let sslConfig = false

if (
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes("render.com") ||
   process.env.NODE_ENV === "production")
) {
  sslConfig = { rejectUnauthorized: false }
}

/* ***********************
 * Connection Pool
 *************************/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

/* ***********************
 * Export helper
 *************************/
module.exports = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params)
      console.log("✅ executed query:", text)
      return res
    } catch (err) {
      console.error("❌ error in query:", text, err.message)
      throw err
    }
  },
  pool,
}

