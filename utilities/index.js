function getNav() {
  return `
    <nav>
      <a href="/">Home</a>
      <a href="/inventory/type/SUV">SUV</a>
      <a href="/inventory/type/Truck">Truck</a>
      <a href="/inventory/type/Sedan">Sedan</a>
    </nav>
  `;
}

function buildClassificationGrid(vehicles) {
  if (!vehicles.length) {
    return `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }

  let grid = '<ul class="vehicle-grid">';
  vehicles.forEach(vehicle => {
    grid += `
      <li>
        <a href="/inventory/detail/${vehicle._id}">
          <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
          <h2>${vehicle.make} ${vehicle.model}</h2>
          <p>$${vehicle.price.toLocaleString()}</p>
        </a>
      </li>
    `;
  });
  grid += "</ul>";
  return grid;
}

function buildDetailView(vehicle) {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
      <div>
        <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
        <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
        <p>${vehicle.description}</p>
      </div>
    </div>
  `;
}

module.exports = { getNav, buildClassificationGrid, buildDetailView };
