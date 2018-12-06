var map;
var markers;
var inputDate;
var database = firebase.database().ref();
//loads the map dropdown and calender
$(document).ready(function() {
    initializeMap();
    $('select').formSelect();
    $('.datepicker').datepicker();
  //when user clicks on submit it grabs the dropdown menu selection. takes the date data from calender
    $('#userInput').click(function() {
      var date = formatUserInputDate($('.datepicker').val());
      var code = $('#dropDownMenu option:selected').val();
      handleUserInput(code, date);
    });
});

dataRef.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function(snapshot) {
  // Change the HTML to reflect
  $("#serach-counter").text(snapshot.val().data[this.alt]["area_name"]);
  $("#serach-counter").text(snapshot.val().data[this.alt]["location"]);
  $("#serach-counter").text(snapshot.val().data[this.alt]["crm_cd_desc"]);
  $("#serach-counter").text(snapshot.val().data[this.alt]["crm_cd"] );
  $("#serach-counter").text(snapshot.val().data[this.alt]["premis_desc"] );
});

// function to initialize leaflet map onto the page
function initializeMap() {
 //variable map initialized to be a leaflet map with in element 'map' with defined center and zoom. coords using latitude and longitude
  map = L.map('map', {
    center: [34.0522, -118.2437],
    zoom: 13
  });
 // takes the map info from the api
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
  }).addTo(map);
}
// function to check if a crime and date was selected
function handleUserInput(code, date) {
   // both are selected
  if(code >= 0 && date !== "" && date !== undefined && date !== null) {
     //use function that uses ajax both parameters
    getCrimeDataDateAndCode(date, code);
  }//if a date was the only thing selected
  else if(date !== "" && date !== undefined && date !== null) {
      getCrimeDataDate(date);
  }//one or the other is valid. if date is valid do ajax with date
  else if(code > 0) {
    getCrimeDataCrime(code);
  }
  else {
    alert("Error");
  }
}

//function to format user input date using moment.js
//input parameter is a string that is obtained using materialize's datepicker
function formatUserInputDate(string) {
  //if string is empty, null, or underdefined then dont do anything
  if(string === "" || string === null) {
    return;
  }
  //if not then use regular expression to remove non numeric characters and replace with blank space
    string = string.replace(/\D/g,'');
     //create a moment by parsing string with expected format
    var day = moment(string, "MMM DD YYYY");
    day = day.format('YYYY-MM-DD');
      //return string
    return day.toString();
}

//ajax call function using just a date
function getCrimeDataDate(date) {
  $.ajax({
    url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000",
    data: {
      "$limit" : 500,
      "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
    }//once ajax is called run the map crime data function
  }).done(function(data) {
     //callback function with data. pass data to map function
    mapCrimeData(data);
    console.log(data);
    
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
  
//ajax call function using just a crime code
function getCrimeDataDateAndCode(date, crmCD) {
    $.ajax({
        url: "https://data.lacity.org/resource/7fvc-faax.json?date_occ=" + date + "T00:00:00.000&crm_cd=" + crmCD,
        data: {
        "$limit" : 500,
        "$$app_token" : "fNjQDblxyyhoI1YrUgCkAQj6Y"
        }
    }).done(function(data) {
        results = data;
         //callback function with data. pass data to map function
        mapCrimeData(data);
        console.log(data);
       
    });
}

//ajax call function using both date and crime code
function mapCrimeData(data) {
  //clears extra markers once a new crime and day are selected
  if(markers !== null && markers !== undefined) {
    markers.clearLayers();
  }
  markers = L.layerGroup([]);
  //loop through the data from the ajax and places it onto the map
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
    + "<br>Premise Description: " + data[this.alt]["premis_desc"] 
    + "<br><br><br> ");
    $('#stats').html(newDiv);
    //Change this part here
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

$('.dropdown-trigger').dropdown();
$('#textarea1').val('');
M.textareaAutoResize($('#textarea1'));





