  //1. Do google api search for coordinates
  //2. Create object with city + lat + long
  //3. Do weather api search
  //4. do whatever with weather data

var containerEl = $(".container");
var searchColumnEl = $("#searchCol");
var locationArr = [];

var getCoordinates = function(locationName) {
  var apiUrl = "http://api.positionstack.com/v1/forward?access_key=73320762f07dc08c72da955bc2640548&query="+locationName+"&limit=1&output=json";
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          var newLocationObj = {
            location: data.data[0].label.replace(/\s+/g, '').replace(/,/g,''),
            lat: data.data[0].latitude,
            long: data.data[0].longitude
          }

          var inArray = false;
          for(var i=0; i < locationArr.length; i++){
            if(locationArr[i].location === newLocationObj.location){
              inArray = true;
            }
          }
          if(!inArray){
            locationArr.push(newLocationObj);
          }
          return getWeatherData(newLocationObj.lat, newLocationObj.long, newLocationObj.location);
        });
      } else {
        alert("Error: Location not found");
      }
    })
    .catch(function(error) {
      alert("unable to connect to geolocation service");
    });
};

var getWeatherData = function (lat, long, locationName) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&appid=43a4f9fb4a44873ad703423f23b4250e"
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {

          var newLocationButton = $("<button>")
            .addClass("btn locationBtn border")
            .attr("id", locationName)
            .text(locationName);
          searchColumnEl.append(newLocationButton);

        });
      } else {
        alert("Error: Location not found");
      }
    })
    .catch(function(error) {
      alert("unable to connect to weather service");
    });
}

var newLocationWeather = getCoordinates("Salt Lake City");





$("#searchBtn").on("click", function(event) {

  event.preventDefault();

  var formData = $("#city").val();
  var weatherDataToPrint = getCoordinates(formData);
});

$("#searchCol").on("click", ".locationBtn", function(event) {
  var locationName = $(this).attr("id");

  console.log(locationName);
  console.log(locationArr);
});


// $(".row").on("click", "i", function() {
//   var rowID = $(this).attr("id");
//   var text = $("#"+rowID+"text").val();

//   localStorage.setItem("#"+rowID+"text", text);
// });