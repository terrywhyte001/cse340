const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* **************************************
 * Format number as currency
 * ************************************ */
Util.formatCurrency = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

/* **************************************
 * Format number with commas
 * ************************************ */
Util.formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
/* **************************************
 * Check for Employee or Admin role
 * ************************************ */
Util.checkLogin = async (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
  next();
};

Util.checkEmployeeAdmin = async (req, res, next) => {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
  
  if (res.locals.accountData.account_type === "Employee" || 
      res.locals.accountData.account_type === "Admin") {
    next();
  } else {
    req.flash("notice", "You don't have permission to access this page");
    return res.redirect("/account/");
  }
};

Util.buildVehicleHTML = async function (vehicle) {
  let html = '<div class="vehicle-detail">';
  
  // Image section
  html += '<div class="vehicle-image">';
  html += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`;
  html += '</div>';
  
  // Information section
  html += '<div class="vehicle-info">';
  html += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  html += `<p class="price">Price: ${Util.formatCurrency(vehicle.inv_price)}</p>`;
  html += `<p class="description">${vehicle.inv_description}</p>`;
  html += `<p class="miles">Miles: ${Util.formatNumber(vehicle.inv_miles)}</p>`;
  html += `<p class="color">Color: ${vehicle.inv_color}</p>`;
  html += '</div>';
  
  html += '</div>';
  return html;
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification select list
 * ************************************ */
Util.buildClassificationList = async function(selected_id) {
  let data = await invModel.getClassifications();
  let options = '<select name="classification_id" id="classificationList">';
  options += '<option value="">Choose a Classification</option>';
  data.rows.forEach(row => {
    options += `<option value="${row.classification_id}"
      ${selected_id && row.classification_id === Number(selected_id) ? 'selected' : ''}>
      ${row.classification_name}
    </option>`;
  });
  options += '</select>';
  return options;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img class="img-classification" src="' +
        (vehicle.inv_thumbnail.startsWith('/') ? '' : '/') + vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<hr>";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build vehicle details view
 * ************************************ */
Util.buildVehicleDetails = async function (vehicle) {
  if (!vehicle) return "<p>Vehicle not found.</p>";

  let details = `<div class="vehicle-details">`;

  // Image section
  details += `<div class="vehicle-image">
                  <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
                </div>`;

  // Info section
  details += `<div class="vehicle-info">
                  <h2> ${vehicle.inv_make} ${vehicle.inv_model} Details </h2>
                  <p class="price"><strong>Price:</strong> $${new Intl.NumberFormat(
                    "en-US"
                  ).format(vehicle.inv_price)}</p>
                  <p><strong>Description:</strong> ${
                    vehicle.inv_description
                  }</p>
                  <p class="color"><strong>Color:</strong> ${
                    vehicle.inv_color
                  }</p>
                  <p><strong>Mileage:</strong> ${new Intl.NumberFormat(
                    "en-US"
                  ).format(vehicle.inv_miles)} miles</p>
                </div>`;

  details += `</div>`;

  return details;
};

/* **************************************
 * Build the classification list HTML
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};


Util.authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash('notice', 'You must be logged in to access this page.');
    return res.redirect('/account/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.flash('notice', 'Session expired. Please log in again.');
    res.redirect('/account/login');
  }
};


Util.authorizeAdminOrEmployee = (req, res, next) => {
  if (!req.user || (req.user.account_type !== 'Admin' && req.user.account_type !== 'Employee')) {
    req.flash('notice', 'Access denied. Admin or Employee required.');
    return res.redirect('/account/login');
  }
  next();
};

/* **************************************
 * Build Comments HTML Component
 * ************************************ */
Util.buildCommentsHTML = function(comments, user, invId) {
  let html = '<div class="comments-section">';
  
  if (comments && comments.length > 0) {
    html += '<h3>Customer Comments</h3>';
    comments.forEach(comment => {
      html += '<div class="comment-item">';
      html += `<strong>${comment.account_firstname} ${comment.account_lastname}</strong>`;
      html += `<small> - ${new Date(comment.comment_date).toLocaleString()}</small>`;
      html += `<p>${comment.comment_text}</p>`;
      if (user) {
        html += '<div class="comment-actions">';
        html += `<form action="/comment/like" method="POST" style="display:inline;">`;
        html += `<input type="hidden" name="comment_id" value="${comment.comment_id}">`;
        html += `<input type="hidden" name="inv_id" value="${invId}">`;
        html += `<button type="submit" class="like-btn ${comment.hasLiked ? 'liked' : ''}">`;
        html += `👍 ${comment.like_count || 0}</button>`;
        html += '</form>';
        html += '</div>';
      }
      html += '</div><hr>';
    });
  } else {
    html += '<p>No comments yet. Be the first to share your thoughts!</p>';
  }
  
  // Add comment form for logged-in users
  if (user) {
    html += '<div class="add-comment">';
    html += '<h4>Add Your Comment</h4>';
    html += '<form action="/comment/add" method="POST">';
    html += `<input type="hidden" name="inv_id" value="${invId}">`;
    html += '<textarea name="comment_text" rows="4" cols="50" placeholder="Share your thoughts..." required></textarea><br>';
    html += '<button type="submit" class="btn">Add Comment</button>';
    html += '</form>';
    html += '</div>';
  }
  
  html += '</div>';
  return html;
};

/* **************************************
 * Build Management Links Component
 * ************************************ */
Util.buildManagementLinks = function(accountData) {
  let links = '<div class="management-links">';
  
  if (accountData && (accountData.account_type === 'Employee' || accountData.account_type === 'Admin')) {
    links += '<h3>Management</h3>';
    links += '<ul>';
    links += '<li><a href="/inv/">Inventory Management</a></li>';
    links += '<li><a href="/inv/add-classification">Add Classification</a></li>';
    links += '<li><a href="/inv/add-inventory">Add Vehicle</a></li>';
    
    if (accountData.account_type === 'Admin') {
      links += '<li><a href="/admin">Admin Panel</a></li>';
    }
    
    links += '</ul>';
  }
  
  links += '</div>';
  return links;
};

/* **************************************
 * Build Vehicle Card Component
 * ************************************ */
Util.buildVehicleCard = function(vehicle) {
  let card = '<div class="vehicle-card">';
  card += `<a href="/inv/detail/${vehicle.inv_id}">`;
  card += `<img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`;
  card += `<h3>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h3>`;
  card += `<p class="price">$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>`;
  card += '</a>';
  card += '</div>';
  return card;
};

/* **************************************
 * Build Header Component
 * ************************************ */
Util.buildHeaderComponent = function(accountData) {
  let header = '<div class="header-tools">';
  
  if (accountData) {
    header += `<span>Welcome, ${accountData.account_firstname}!</span>`;
    header += '<a href="/account/">My Account</a>';
    header += '<a href="/account/logout">Logout</a>';
  } else {
    header += '<a href="/account/login">My Account</a>';
  }
  
  header += '</div>';
  return header;
};

/* **************************************
 * Build Navigation Component
 * ************************************ */
Util.buildNavComponent = async function() {
  const nav = await Util.getNav();
  return `<nav class="main-navigation">${nav}</nav>`;
};

/* **************************************
 * Build Footer Error Component (Week 3)
 * ************************************ */
Util.buildFooterError = function() {
  return '<a href="/error/trigger" class="footer-error-link">Trigger Error</a>';
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
