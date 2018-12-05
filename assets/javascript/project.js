var map;
var markers;
var inputDate;

var database = firebase.database();

$(document).ready(function() {
    initializeMap();
    var date = formatUserInputDate("22112010");
    getCrimeDataDate(date);
});

$(document).ready(function(){
  $('select').formSelect();
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

function getCrimeDataDate(date) {
  $.ajax({
    url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000",
    data: {
      "$limit" : 5000,
      "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
    }
  }).done(function(data) {
    alert("Retrieved " + data.length + " records from the dataset!");
    mapCrimeData(data);
    firebase.database().ref().set(data);
  });
}

function getCrimeDataCrime(crmCD) {
    $.ajax({
      url: "https://data.lacity.org/resource/7fvc-faax.json?crm_cd=" + crmCD,
      data: {
        "$limit" : 5000,
        "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
      }
    }).done(function(data) {
      alert("Retrieved " + data.length + " records from the dataset!");
      mapCrimeData(data);
      firebase.database().ref().set(data);
    });
  }
  

function getCrimeDataDateAndCode(date, crmCD) {
    $.ajax({
        url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000&crm_cd=" + crmCD,
        data: {
        "$limit" : 5000,
        "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
        }
    }).done(function(data) {
        alert("Retrieved " + data.length + " records from the dataset!");
        mapCrimeData(data);
        firebase.database().ref().set(data);
    });
}


function mapCrimeData(data) {
  markers = L.layerGroup([]);
  for(var i=0; i<data.length; i++) {
    var lat = data[i]["location_1"]["coordinates"][1];
    var lon = data[i]["location_1"]["coordinates"][0];
    var marker = L.marker([lat, lon]);
    marker.on("click", function() {
        displayCrimeData(i);
    });
    marker.addTo(markers);
  }
  markers.addTo(map);
}

function displayCrimeData(i) {
    var location;
}

$('.dropdown-trigger').dropdown();
$('#textarea1').val('');
M.textareaAutoResize($('#textarea1'));


var text = $('#dropDownMenu').find('option:selected').val();

$("#dropDownMenu").on('click', function(){
console.log(text);

})
$('.dropdown-trigger').dropdown();
$('#textarea1').val('');
M.textareaAutoResize($('#textarea1'));
function displayCrimeData(data) {
    var crimeDataDiv = $('#stats');
}

$("#crime-button").on('click', function() {
   console.log("lets work");
   ;
   $(".z-depth-3").append("Hello");
})
