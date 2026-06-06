var map = L.map('map').setView([1.4812, 102.1123], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var hotelCluster = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true
});

var markers = [];

// ====== Loop hotel ======
json_hotel_bengkalis_fix_8.features.forEach(function(feature){
    var lat = feature.properties.Latitude;
    var lon = feature.properties.Longitude;
    var nama = feature.properties["Nama Hotel"];
    var alamat = feature.properties["Alamat"];

    var popupContent = `<div class="hotel-popup">
        <h3>${nama}</h3>
        <p>${alamat}</p>
    </div>`;

    var marker = L.marker([lat, lon])
        .bindPopup(popupContent);

    hotelCluster.addLayer(marker);
    markers.push({marker: marker, nama: nama});
});

map.addLayer(hotelCluster);

// Tooltip permanen
hotelCluster.eachLayer(function(layer){
    layer.bindTooltip(layer.getPopup().getContent().match(/<h3>(.*?)<\/h3>/)[1], {
        permanent: true,
        direction: 'top',
        className: 'hotel-tooltip'
    });
});

// ====== Sidebar ======
var hotelList = document.getElementById("hotelList");
markers.forEach(function(item){
    var li = document.createElement("li");
    li.innerText = item.nama;
    li.addEventListener("click", function(){
        map.setView(item.marker.getLatLng(), 17);
        item.marker.openPopup();
    });
    hotelList.appendChild(li);
});

// ====== Search ======
var searchInput = document.getElementById("searchHotel");
searchInput.addEventListener("input", function(){
    var val = this.value.toLowerCase();
    hotelList.innerHTML = "";
    markers.forEach(function(item){
        if(item.nama.toLowerCase().includes(val)){
            var li = document.createElement("li");
            li.innerText = item.nama;
            li.addEventListener("click", function(){
                map.setView(item.marker.getLatLng(), 17);
                item.marker.openPopup();
            });
            hotelList.appendChild(li);
        }
    });
});