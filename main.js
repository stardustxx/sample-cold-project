(function($) {
  var OPEN_WEATHER_API_KEY = "c4f88467d8ca10e1bf08224620c5aac6";
  var OPEN_WEATHER_ICON_HOST = "http://openweathermap.org/img/w/";
  var OPEN_WEATHER_ENDPOINT = "http://api.openweathermap.org/data/2.5";
  var OPEN_WEATHER_CURRENT_ENDPOINT_LOCATION = "/weather";
  var OPEN_WEATHER_FORECAST_ENDPOINT_LOCATION = "/forecast/daily";
  var VANCOUVER_ID = "6173331";

  var weatherToday = {};
  var weatherTmr = {};
  var tempTwoDayDiff = 0;
  var tempTmrDayDiff = 0;
  var humTwoDayDiff = 0;

  function getWeatherCurrent() {
    return $.get(OPEN_WEATHER_ENDPOINT + OPEN_WEATHER_CURRENT_ENDPOINT_LOCATION, {
      "id": VANCOUVER_ID,
      "APPID": OPEN_WEATHER_API_KEY
    });
  }

  function getWeatherForecast() {
    return $.get(OPEN_WEATHER_ENDPOINT + OPEN_WEATHER_FORECAST_ENDPOINT_LOCATION, {
      "id": VANCOUVER_ID,
      "cnt": 2,
      "APPID": OPEN_WEATHER_API_KEY
    });
  }

  $.when(
    getWeatherCurrent(), getWeatherForecast()
  ).then(function(current, forecast) {
    console.log("current", current[0]);
    console.log("forecast", forecast[0]);

    var tempToday = {
      "icon": current[0].weather[0].icon,
      "description": current[0].weather[0].description,
      "temp": current[0].main.temp,
      "max": current[0].main.temp_max,
      "min": current[0].main.temp_min,
      "hum": current[0].main.humidity
    };

    var tempTmr = {
      "icon": forecast[0].list[1].weather[0].icon,
      "description": forecast[0].list[1].weather[0].description,
      "max": forecast[0].list[1].temp.max,
      "min": forecast[0].list[1].temp.min,
      "hum": forecast[0].list[1].humidity
    };

    tempTwoDayDiff = Math.abs(tempTmr.max - tempToday.max);
    tempTmrDayDiff = tempTmr.max - tempTmr.min;
    humTwoDayDiff = Math.abs(tempTmr.hum - tempToday.hum);

    setDate(tempToday, tempTmr);
  });

  function setDate(tempToday, tempTmr) {
    var weatherCurrentSelector = "#weather-current",
      weatherTomorrowSelector = "#weather-tomorrow",
      celciusSign = "&#8451;";

    $(weatherCurrentSelector + " .weather-icon").attr("src", OPEN_WEATHER_ICON_HOST + tempToday.icon + ".png");
    $(weatherCurrentSelector + " .temp").html(Math.round(convertKtoC(tempToday.temp)) + celciusSign);
    $(weatherCurrentSelector + " .hum").html(tempToday.hum + "%");

    $(weatherTomorrowSelector + " .weather-icon").attr("src", OPEN_WEATHER_ICON_HOST + tempTmr.icon + ".png");
    $(weatherTomorrowSelector + " .temp-max").html(Math.round(convertKtoC(tempTmr.max)) + celciusSign);
    $(weatherTomorrowSelector + " .temp-min").html(Math.round(convertKtoC(tempTmr.min)) + celciusSign);
    $(weatherTomorrowSelector + " .hum").html(tempTmr.hum + "%");

    $("#cold-point-container #cold-point").html(getColdPoint() ? "High Chance" : "Low Chance");
  }

  function getColdPoint() {
    if (tempTwoDayDiff >= 5 && tempTmrDayDiff >= 7 && humTwoDayDiff >= 30) {
      console.log("你會感冒!!!!!!!!!!!!!!!!!!!!");
      return true;
    }
    console.log("你沒差");
    return false;
  }

  function convertKtoC(tempKelvin) {
    return tempKelvin - 273.15;
  }

})(jQuery);