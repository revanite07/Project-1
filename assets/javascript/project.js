var map;
var markers;
var inputDate;
var database = firebase.database().ref();
var searchResults = [];


function updateDisplay(){
  $('#firebase-data').empty();
  for(var i = 0; searchResults.length > i;i++){
         var newDiv1 = $('<div>');
        newDiv1.html("Area Name: " + searchResults[i]["AreaName"]
        + "<br>Location: " + searchResults[i]["Location"]
        + "<br>Crime: " + searchResults[i]["Crime"]
        + "<br>DateOcc: " +  searchResults[i]["date_occ"]
        + "<br>DateRptd: " + searchResults[i]["date_rptd"]
        + "<br> ");
        $('#firebase-data').append(newDiv1);
  }
}

$(document).ready(function() {
    initializeMap();
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('#userInput').click(function() {
      var date = formatUserInputDate($('.datepicker').val());
      var code = $('#dropDownMenu option:selected').val();
      handleUserInput(code, date);
    });
});

function handleUserInput(code, date) {
  if(code >= 0 && date !== undefined) {
    getCrimeDataDateAndCode(date, code);
  }
  else if(date !== undefined) {
    getCrimeDataDate(date);
  }
  else if(code > 0) {
    getCrimeDataCrime(code);
  }
  else {
    alert("Error");
  }
}

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
  if(string === "" || string === null || string === undefined) {
    return;
  }
  string = string.replace(/\D/g,'');
  var day = moment(string, "MMM DD YYYY");
  day = day.format('YYYY-MM-DD');
  return day.toString();
}

function getCrimeDataDate(date) {
  $.ajax({
    url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000",
    data: {
      "$limit" : 500,
      "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
    }
  }).done(function(data) {
    mapCrimeData(data);
  });
}

function getCrimeDataCrime(crmCD) {
    $.ajax({
      url: "https://data.lacity.org/resource/7fvc-faax.json?crm_cd=" + crmCD,
      data: {
        "$limit" : 500,
        "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
      }
    }).done(function(data) {
      mapCrimeData(data);
    });
  }
  
function getCrimeDataDateAndCode(date, crmCD) {
    $.ajax({
        url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000&crm_cd=" + crmCD,
        data: {
        "$limit" : 500,
        "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
        }
    }).done(function(data) {
        results = data;
        mapCrimeData(data);
    });
}
function mapCrimeData(data) {
  if(markers !== null && markers !== undefined) {
    markers.clearLayers();
  }
  markers = L.layerGroup([]);
  for(var i=0; i<data.length; i++) {
    var lat = data[i]["location_1"]["coordinates"][1];
    var lon = data[i]["location_1"]["coordinates"][0];
    var marker = L.marker([lat, lon]);
    marker.alt = i;
    marker.on("click", function() {
      var newDiv = $('<div>');
      newDiv.html("Area Name: " + data[this.alt]["area_name"]
      + "<br>Location: " + data[this.alt]["location"] 
      + "<br>Crime: " + data[this.alt]["crm_cd_desc"] 
      + "<br>DateOcc: " + data[this.alt]["date_occ"].substring(0, 10)
      + "<br> DateRptd: " + data[this.alt]["date_rptd"].substring(0, 10)
      + "<br> ");
      $('#stats').empty();
      $('#stats').append(newDiv);
      var newData = {
        AreaName: data[this.alt]["area_name"],
        Location: data[this.alt]["location"],
        Crime: data[this.alt]["crm_cd_desc"],
        DateOcc: data[this.alt]["date_occ"],
        DateRptd: data[this.alt]["date_rptd"],
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      } ;
      var newPostKey = firebase.database().ref('posts').push(newData).key;
      var updates = {};
      updates['/posts/' + newPostKey] = newData;
      
    });
    marker.addTo(markers);
  }
  markers.addTo(map);
}
 


firebase.database().ref('posts').on('child_added', function(childSnapshot){
  if(searchResults.length > 5){
    searchResults.pop()
    searchResults.unshift(childSnapshot.val())
  } else {
    searchResults.unshift(childSnapshot.val())
  }
  updateDisplay(); 
}); 



