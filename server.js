/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config(); // load env vars
const app = express();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const bodyParser = require("body-parser");
const accountRoute = require("./routes/accountRoute");
const commentRoute = require("./routes/commentRoute");
const errorRoute = require("./routes/errorRoute");
const adminRoute = require("./routes/adminRoute");
const session = require("express-session");
const db = require("./database"); // ✅ this exports { query, pool }
const jwtAuth = require("./middleware/jwtAuth");
const flash = require("connect-flash");

// Validate required environment variables
const requiredEnvVars = ['ACCESS_TOKEN_SECRET', 'SESSION_SECRET', 'DATABASE_URL'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Error: Environment variable ${varName} is not set!`);
    process.exit(1);
  }
});

/* ***********************
 * Middleware
 *************************/
const pgSession = require("connect-pg-simple")(session);

app.use(
  session({
    store: new pgSession({
      pool: db.pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: true,
      sameSite: 'none'
    },
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(jwtAuth.verifyToken);

// Messages middleware
app.use((req, res, next) => {
  res.locals.messages = () => {
    const messages = req.flash();
    const formattedMessages = [];
    for (let type in messages) {
      messages[type].forEach(msg => {
        formattedMessages.push(msg);
      });
    }
    return formattedMessages.join('<br>');
  };
  next();
});

// Serve static files from 'public' directory
app.use(express.static('public'));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/comment", commentRoute);
app.use("/error", errorRoute);
app.use("/admin", adminRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Server
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`🚀 App listening on ${host}:${port}`);
});