/* API Key
8a32615225364eb2ade45f7962cdb100

https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=8a32615225364eb2ade45f7962cdb100

api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

"https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=5&appid=8a32615225364eb2ade45f7962cdb100&units=metric

One Call API 1.0

https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=8a32615225364eb2ade45f7962cdb100

https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&&appid=8a32615225364eb2ade45f7962cdb100

https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=current,minutely,hourly,alerts&appid=8a32615225364eb2ade45f7962cdb100

Geocoding API

http://api.openweathermap.org/geo/1.0/direct?q=london&limit=1&appid=8a32615225364eb2ade45f7962cdb100

UVI Index

http://api.openweathermap.org/v3/uvi/38.6752399,-0.8099623/current.json?appid=8a32615225364eb2ade45f7962cdb100

*/


/*Global Variables*/
var lat = localStorage.getItem('lat');
var lon = localStorage.getItem('lon')
var newCity = document.getElementById("cityInput")
newCity.value = ""
var cityList = document.getElementById("cityList")
var searchButton = document.getElementById("searchButton");
var cityName = document.getElementById("day1-cityName")


/* Display current day*/
var currentDate = moment().format("MMMM Do YYYY");
$("#day1-date").text(currentDate);

/* Get the longitude and lattitude from city name */
function getlongandlat(city) {
    var search = city || newCity.value
    cityName.innerHTML = "--" + search + "--"
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + search + '&limit=1&appid=8a32615225364eb2ade45f7962cdb100')
        .then(response => response.json())
        .then(data => {
            fivedayForecast(data[0].lat, data[0].lon)
        })
}
/* Func to search for weather information from list of searched cities */
searchButton.addEventListener("click", function () {
    GetCity()
})
function saveCity(city) {
    var history = JSON.parse(localStorage.getItem("cities")) || []
    if (!history.includes(city) && city) {
        history.push(city)
        localStorage.setItem("cities", JSON.stringify(history))
    }
    loadCities();
}
/* Func to add searched cities to the page from local storage */
function loadCities() {
    var history = JSON.parse(localStorage.getItem("cities")) || []
    cityList.innerHTML = ""
    for (i = 0; i < history.length; i++) {
        var item = document.createElement("li")
        item.innerText = history[i]
        item.addEventListener("click", function (event) {
            getlongandlat(event.target.textContent)
        })
        cityList.appendChild(item)
    }
}

/*Func to get City Name */
function GetCity() {
    localStorage.setItem("savedCity", newCity.value)
    saveCity(newCity.value)
    getlongandlat()
}
/* Func to display weather data */
function fivedayForecast(lat, lon) {
    Display();
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=current,minutely,hourly,alerts&appid=8a32615225364eb2ade45f7962cdb100&units=metric')
        .then(response => response.json())
        .then(data => {
            for (i = 0; i < 6; i++) {
                document.getElementById("day" + (i + 1) + "-Temp").innerHTML = "Temp: " + Number(data.daily[i].temp.day).toFixed(1) + "°";
            }
            for (i = 0; i < 6; i++) {
                document.getElementById("day" + (i + 1) + "-Humidity").innerHTML = "Humidity: " + Number(data.daily[i].humidity).toFixed(1) + "%";
            }
            for (i = 0; i < 6; i++) {
                document.getElementById("day" + (i + 1) + "-ws").innerHTML = "Wind Speed: " + Number(data.daily[i].wind_speed).toFixed(2) + " MPH";
            }
            for (i = 0; i < 6; i++) {
                document.getElementById("icon" + (i + 1)).src = " https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
            }
                document.getElementById("day1-uvIndex").innerHTML = "UV Index: " + data.daily[0].uvi;
                /* change uvi text depending on number */
                var uvi = (data.daily[0].uvi);
                // var uvi = (9)
                console.log(uvi)
                if (uvi < 3) {document.getElementById("day1-uvIndex").classList.add("green")}
                else if (uvi > 3 && uvi < 6) {document.getElementById("day1-uvIndex").classList.add("yellow")}
                else if (uvi > 6 && uvi < 8) {document.getElementById("day1-uvIndex").classList.add("orange")}
                else if (uvi > 8) {document.getElementById("day1-uvIndex").classList.add("red")};


        })
        .catch(err => alert("Unexpected error. Please try again"))
                   
}



/* Populate Dates */
document.getElementById("day2").innerHTML = "" + (moment().add(1, 'days').format("DD/MM/YY"));
document.getElementById("day3").innerHTML = "" + (moment().add(2, 'days').format("DD/MM/YY"));
document.getElementById("day4").innerHTML = "" + (moment().add(3, 'days').format("DD/MM/YY"));
document.getElementById("day5").innerHTML = "" + (moment().add(4, 'days').format("DD/MM/YY"));
document.getElementById("day6").innerHTML = "" + (moment().add(5, 'days').format("DD/MM/YY"));

/*Display the rest of the app when user has entered a search*/
function Display() {
    document.getElementById("wrapper").classList.remove("hidden");
    document.getElementById("day1-uvIndex").classList.remove("yellow");
    document.getElementById("day1-uvIndex").classList.remove("green");
    document.getElementById("day1-uvIndex").classList.remove("orange");
    document.getElementById("day1-uvIndex").classList.remove("red")
}
loadCities();