const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuth = {};

jwtAuth.verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    res.locals.accountData = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.accountData = decoded;
    res.locals.loggedin = 1;
    next();
  } catch (err) {
    res.locals.accountData = null;
    res.locals.loggedin = 0;
    res.clearCookie("jwt");
    next();
  }
};

module.exports = jwtAuth;