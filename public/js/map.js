if (
    listing.geometry &&
    listing.geometry.coordinates &&
    listing.geometry.coordinates.length === 2
) {
    const map = L.map("map").setView(
        [listing.geometry.coordinates[1], listing.geometry.coordinates[0]],
        13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(map);

    L.marker([
        listing.geometry.coordinates[1],
        listing.geometry.coordinates[0],
    ])
        .addTo(map)
        .bindPopup(
            `<b>${listing.title}</b><br>${listing.location}, ${listing.country}`
        )
        .openPopup();
} else {
    document.getElementById("map").innerHTML =
        "<p style='padding:20px;text-align:center;'>Location not available.</p>";
}