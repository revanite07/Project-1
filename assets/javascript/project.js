var map;
var markers;
var inputDate;

$(document).ready(function() {
    initializeMap();
    var date = formatUserInputDate("22112010");
    console.log(date);
    getCrimeData(date);
});

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

function formatUserInputDate(string) {
    string = string.replace(/\D/g,'');
    var day = moment(string, ["MMDDYYYY", "DDMMYYYY"]);
    day = day.format('YYYY-MM-DD');
    return day.toString();
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
    mapCrimeData(data);
  });
}

function mapCrimeData(data) {
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

function displayCrimeData(data) {
    var crimeDataDiv = $('#stats');
}