const Classification = require("../models/classificationModel");

// ----------------------
// Dynamic Navigation
// ----------------------
async function getNav() {
  try {
    const classifications = await Classification.find().sort({ classification_name: 1 });
    let nav = '<nav><a href="/">Home</a>';
    classifications.forEach(c => {
      nav += `<a href="/inventory/type/${c._id}">${c.classification_name}</a>`;
    });
    nav += '</nav>';
    return nav;
  } catch (err) {
    console.error("Error building nav:", err);
    return '<nav><a href="/">Home</a></nav>';
  }
}

// ----------------------
// Classification Select List (for Add Inventory form)
// ----------------------
function buildClassificationList(classifications, selectedId = null) {
  let list = '<select name="classification_id" id="classificationList" required>';
  list += "<option value=''>Choose a Classification</option>";
  classifications.forEach(c => {
    list += `<option value="${c._id}"`;
    if (selectedId && c._id.toString() === selectedId.toString()) list += " selected";
    list += `>${c.classification_name}</option>`;
  });
  list += "</select>";
  return list;
}

// ----------------------
// Grid of Vehicles
// ----------------------
function buildClassificationGrid(vehicles) {
  if (!vehicles.length) {
    return `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }

  let grid = '<ul class="vehicle-grid">';
  vehicles.forEach(vehicle => {
    grid += `
      <li>
        <a href="/inv/${vehicle._id}">
          <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
          <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
          <p>$${vehicle.price.toLocaleString()}</p>
        </a>
      </li>
    `;
  });
  grid += "</ul>";
  return grid;
}

// ----------------------
// Vehicle Detail View
// ----------------------
function buildDetailView(vehicle) {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
      <div>
        <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
        <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
        <p>${vehicle.description}</p>
        <p><strong>Classification:</strong> ${vehicle.classification_id?.classification_name || "N/A"}</p>
      </div>
    </div>
  `;
}

module.exports = { getNav, buildClassificationGrid, buildDetailView, buildClassificationList };
