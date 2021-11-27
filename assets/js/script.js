  //1. Do google api search for coordinates
  //2. Create object with city + lat + long
  //3. Do weather api search
  //4. do whatever with weather data

var containerEl = document.querySelector(".container");
var locationArr = [];

var getCoordinates = function(locationName) {
  var apiUrl = "http://api.positionstack.com/v1/forward?access_key=73320762f07dc08c72da955bc2640548&query="+locationName+"&limit=1&output=json";
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log("in coordinate function", data);
          return data;
        });
      } else {
        alert("Error: Location not found");
      }
    })
    .catch(function(error) {
      alert("unable to connect to geolocation service");
    });
};

var getWeatherData = function (lat, long) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&appid=43a4f9fb4a44873ad703423f23b4250e"
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
          return data;
        });
      } else {
        alert("Error: Location not found");
      }
    })
    .catch(function(error) {
      alert("unable to connect to weather service");
    });
}

var newCity = getCoordinates("Salt Lake City");
console.log("test", newCity);
// var newWeather = getWeatherData(newCity[0].latitude, newCity[0].longitude);
// var newWeather = getWeatherData(40.773201, -111.933984);

$(".searchBtn").on("click", function() {
  var locationName = formData;
  var locationData = getCoordinates(locationName);
  var newLocation = {
    city: locationData.label,
    lat: locationData.latitude,
    long: locationData.longitude,
  }

  // console.log(newLocation.city);

  locationArr.push(newLocation);
  var newLocationButton = $("<button>").addClass("btn").attr("id", newLocation.city);
  containerEl.append(newLocationButton);


})



// $(".row").on("click", "i", function() {
//   var rowID = $(this).attr("id");
//   var text = $("#"+rowID+"text").val();

//   localStorage.setItem("#"+rowID+"text", text);
// });