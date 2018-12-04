var map;
var markers;

initializeMap();



function initializeMap() {
  map = L.map('map', {
    center: [34.0522, -118.2437],
    zoom: 13
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
  }).addTo(map);
}

function getCrimeData(date) {
  $.ajax({
    url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000",
    data: {
      "$limit" : 5000,
      "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
    }
  }).done(function(data) {
    alert("Retrieved " + data.length + " records from the dataset!");
    console.log(data);
    markCrimeData(data);
  });
}

function markCrimeData(data) {
  markers = L.layerGroup([]);
  for(var i=0; i<data.length; i++) {
    console.log();
    var lat = data[i]["location_1"]["coordinates"][1];
    var lon = data[i]["location_1"]["coordinates"][0];
    var marker = L.marker([lat, lon]);
    marker.addTo(markers);
  }
  markers.addTo(map);
}

$('.dropdown-trigger').dropdown();
$('#textarea1').val('');
M.textareaAutoResize($('#textarea1'));