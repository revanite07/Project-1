var map;
var markers;
var inputDate;
var database = firebase.database().ref();

$(document).ready(function() {
    initializeMap();
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('#userInput').click(function() {
      var date = formatUserInputDate($('.datepicker').val());
      var code = $('#dropDownMenu option:selected').val();
      handleUserInput(code, date);
    });


    database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function(snapshot) {
      // Change the HTML to reflect
      
    });
});

function handleUserInput(code, date) {
  if(code >= 0 && date !== "" && date !== undefined && date !== null) {
    getCrimeDataDateAndCode(date, code);
  }
  else if(date !== "" && date !== undefined && date !== null) {
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
  if(string === "" || string === null) {
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
    results = data;
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
      results = data;
      alert("Retrieved " + data.length + " records from the dataset!");
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
        alert("Retrieved " + data.length + " records from the dataset!");
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
      //Change this part here
      var newDiv = $('<div>');
      newDiv.html("Area Name: " + data[this.alt]["area_name"]
      + "<br>Location: " + data[this.alt]["location"] 
      + "<br>Crime: " + data[this.alt]["crm_cd_desc"] 
      + "<br> ");
      $('#stats').prepend(newDiv);
      var newData = {
        AreaName: data[this.alt]["area_name"],
        Location: data[this.alt]["location"],
        Crime: data[this.alt]["crm_cd_desc"],
        DateOcc: data[this.alt]["date_occ"],
        DateRptd: data[this.alt]["date_rptd"],
        VictimAge: data[this.alt]["vict_age"],
        VictimDescent: data[this.alt]["vict_descent"],
        VictimSex: data[this.alt]["vict_sex"],
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    } ;
    var newPostKey = firebase.database().ref().child('posts').push().key;
    var updates = {};
    updates['/posts/' + newPostKey] = newData;
    firebase.database().ref().update(updates);
    });
    marker.addTo(markers);
  }
  markers.addTo(map);
}





