var containerEl = $(".container");
var searchColumnEl = $("#searchCol");
var weatherAreaEl = $("#weatherArea");
var forecastEl = $("#forecast");
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

          // var inArray = false;
          // for(var i=0; i < locationArr.length; i++){
          //   if(locationArr[i].location === newLocationObj.location){
          //     inArray = true;
          //   }
          // }
          // if(!inArray){
          //   locationArr.push(newLocationObj);
          // }
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

          if(localStorage.getItem(condensedName) === null){
            localStorage.setItem(condensedName, JSON.stringify(data));
          }

          var newLocationButton = $("<button>")
            .addClass("btn locationBtn border")
            .attr("id", condensedName)
            .text(locationName);
          searchColumnEl.append(newLocationButton);

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

  for(var i=1; i<6; i++){
    var tempEl = $("#day"+i+" .temp");
    tempEl.text(weatherData.daily[i-1].temp.max + "/" + weatherData.daily[i-1].temp.min);

    var windEl = $("#day"+i+" .wind");
    windEl.text(weatherData.daily[i-1].wind_speed + " MPH");

    var humidEl = $("#day"+i+" .humid");
    humidEl.text(weatherData.daily[i-1].humidity + "%");
  }


}



// var newLocationWeather = getCoordinates("Salt Lake City");


$("#searchBtn").on("click", function(event) {

  event.preventDefault();

  var formData = $("#city").val();
  var weatherDataToPrint = getCoordinates(formData);
});

$("#searchCol").on("click", ".locationBtn", function(event) {
  var locationName = $(this).attr("id");

  console.log(locationName);

});


// $(".row").on("click", "i", function() {
//   var rowID = $(this).attr("id");
//   var text = $("#"+rowID+"text").val();

//   localStorage.setItem("#"+rowID+"text", text);
// });


createForecast();