// Inisialisasi peta
var map = L.map('map').setView([1.48, 102.11], 13);

// Layer OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker cluster
var markers = L.markerClusterGroup();

// Function buat popup
function createPopup(feature) {
    return `<h3>${feature.properties["Nama Hotel"]}</h3>
            <p>${feature.properties["Alamat"]}</p>
            <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${feature.properties.Latitude},${feature.properties.Longitude}">Arah ke Google Maps</a>`;
}

// Tambahkan semua hotel
hotel_bengkalis_fix_8.features.forEach(feature => {
    var marker = L.marker([feature.properties.Latitude, feature.properties.Longitude]);
    marker.bindPopup(createPopup(feature));
    marker.feature = feature; // simpan feature untuk search
    markers.addLayer(marker);
});

map.addLayer(markers);

// Sidebar interaktif
var hotelList = document.getElementById('hotelList');
function updateHotelList(filter="") {
    hotelList.innerHTML = "";
    markers.eachLayer(marker => {
        if(marker.feature.properties["Nama Hotel"].toLowerCase().includes(filter.toLowerCase())) {
            var li = document.createElement('li');
            li.innerText = marker.feature.properties["Nama Hotel"];
            li.onclick = function() {
                map.setView(marker.getLatLng(), 17);
                marker.openPopup();
            }
            hotelList.appendChild(li);
        }
    });
}

// Load list awal
updateHotelList();

// Search input
document.getElementById('searchInput').addEventListener('input', e => {
    updateHotelList(e.target.value);
});