var containerEl = $(".container");
var searchColumnEl = $("#searchCol");
var weatherAreaEl = $("#weatherArea");
var forecastEl = $("#forecast");
var mainCityEl = $("#weatherData .display-4");
var mainWeatherEl = $("#weatherData .lead");
var currentDay = moment();
var dateFormat = 'M[/]D[/]YYYY'




var getCoordinates = function(locationName) {
  var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+locationName+"&limit=1&appid=43a4f9fb4a44873ad703423f23b4250e";
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          
          console.log(data);
          var newLocationObj = {
            location: data[0].name,
            lat: data[0].lat,
            long: data[0].lon
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
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&units=imperial&exclude=minutely,hourly,alerts&appid=43a4f9fb4a44873ad703423f23b4250e"
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {

          console.log(data);

          var condensedName = locationName.replace(/\s+/g, '').replace(/,/g,'');

          data.name = locationName;
          if(localStorage.getItem(condensedName) === null){
            localStorage.setItem(condensedName, JSON.stringify(data));
            var newLocationButton = $("<button>")
              .addClass("btn locationBtn border")
              .attr("id", condensedName)
              .text(locationName);
            searchColumnEl.append(newLocationButton);
          }

          displayWeather(condensedName);

        });
      } else {
        alert("Error: Location not found");
      }
    })
    .catch(function(error) {
      alert("unable to connect to weather service");
    });
}

var createForecast = function() {
  for(var i=1; i<6; i++){
    var dayEl = $("<div>")
                  .addClass("col-2 card")
                  .attr("id","day"+i);
    var cardHeaderEl = $("<div>")
                        .addClass("card-header")
                        .text(moment().add(i,"days").format(dateFormat));
    var cardBodyEl = $("<div>")
                      .addClass("card-body");
    cardBodyEl.html(
      "Icon: <br>" +
      "Temp: <span class=\"temp\"></span> <br>" +
      "Wind: <span class=\"wind\"></span> <br>" +
      "Humidty: <span class=\"humid\"></span>"
    );

    dayEl.append(cardHeaderEl).append(cardBodyEl);

    forecastEl.append(dayEl);
  }
}

var displayWeather = function(locationName){

  var weatherData = JSON.parse(localStorage.getItem(locationName));

  mainCityEl.text(locationName + " " + (moment().format(dateFormat)));

  mainWeatherEl.html(
    "Temp: <span class=\"temp\">" + weatherData.current.temp + "F</span> <br>" +
    "Wind: <span class=\"wind\">" + weatherData.current.wind_speed + " MPH</span> <br>" +
    "Humidty: <span class=\"humid\">" + weatherData.current.humidity + "%</span> <br>" +
    "UV Index: <span class=\"UV\">" + weatherData.current.uvi +" </span>"
  );

  for(var i=1; i<6; i++){
    var tempEl = $("#day"+i+" .temp");
    tempEl.text(weatherData.daily[i-1].temp.max + "/" + weatherData.daily[i-1].temp.min);

    var windEl = $("#day"+i+" .wind");
    windEl.text(weatherData.daily[i-1].wind_speed + " MPH");

    var humidEl = $("#day"+i+" .humid");
    humidEl.text(weatherData.daily[i-1].humidity + "%");
  }



}



$("#searchBtn").on("click", function(event) {

  event.preventDefault();

  var formData = $("#city").val();
  getCoordinates(formData);
});

$("#searchCol").on("click", ".locationBtn", function(event) {
  var locationName = $(this).attr("id");

  displayWeather(locationName);

});


createForecast();

for(var i = 0; i<localStorage.length; i++){
  var data = JSON.parse(localStorage[Object.keys(localStorage)[i]]);

  mainCityEl.text(data.name + " " + (moment().format(dateFormat)));

  var newLocationButton = $("<button>")
    .addClass("btn locationBtn border")
    .attr("id", data.name)
    .text(data.name);
  searchColumnEl.append(newLocationButton);

  displayWeather(data.name);
}