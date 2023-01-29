var APIKey = "c360d5cf76f9e7ac3dbfbe0656b8587e";
var city;
var input = $('#search-text');
var searchBtn = $('#search-btn');
var formID = $('#city-form');
var recentSearches = $('#searches');
var widgets = $('.widgets');

$(function() {
    loadSearch();
})

var loadSearch = function () {
    var savedItem = $("<button>").text(localStorage.getItem("history"))
    savedItem.addClass(localStorage.getItem("history")).addClass('m-2 py-2 text-center col-11 border-0 rounded');

    // Using 'this' to get the class that will be the input from user. We replace the other classes with an empty string so it does not add those classes to the input
    savedItem.on("click", function () {
        var clickedClass = $(this).attr('class');
        city = clickedClass.replace("m-2 py-2 text-center col-11 border-0 rounded","");
        getAPI();
    });

    // Limit the amount of prepended elements by overwriting preexisting prepended elements from oldest
    var limit = 5;
    if (recentSearches.children().length >= limit) {
        recentSearches.children().slice(limit - 1).remove();
    }

    recentSearches.prepend(savedItem);
}

var initial = function (e) {
    if (input.val() === "") {
        return;
    }
    
    city = input.val().trim();
    e.preventDefault();
    getAPI();
}

var getAPI = function () {
    var todayURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=metric";

    fetch(todayURL).then(function(response) {
        return response.json()
    }).then(function (data) {

        // Returning the function if there is an error with the value inputted
        if (data.cod !== 200) {
            return;
        }

        console.log(data);
        $("#city-name").text(data.name + dayjs().format("(D/M/YYYY)"));
        $("#temp").text("Temp: " + data.main.temp + "°C")

        // Default wind speed for metric is in meter/sec. This is to convert to KMPH.
        $("#wind").text("Wind: " + (data.wind.speed * 3.6).toFixed() + "KMPH")
        $("#humidity").text("Humidity: " + data.main.humidity + "%")

        fetch(forecastURL).then(function(response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
           
            var today = dayjs();
           
            for (let i = 0; i < 6; i++) {
                let nextDay = today.add(i, 'day');
                $("#date-" + i).text(nextDay.format('DD/MM/YYYY')).addClass('')
    
                console.log(data.list[i].weather[0].main);
                
                // Ternary operator to change icon dependent on the forecast
                (data.list[i].weather[0].main === "Snow") ? $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/13d@2x.png") : 
                (data.list[i].weather[0].main === "Clouds") ? $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/02d@2x.png") :
                (data.list[i].weather[0].main === "Rain") ? $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/10d@2x.png") :
                (data.list[i].weather[0].main === "Thunderstorm") ? $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/11d@2x.png") :
                (data.list[i].weather[0].main === "Drizzle") ? $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/09d@2x.png") :
                $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/01d@2x.png");
    
                $("#forecast-temp-" + i).text("Temp: " + data.list[i].main.temp + "°C");
                $("#forecast-wind-" + i).text("Wind: " + (data.list[i].wind.speed * 3.6).toFixed() + "KMPH");
                $("#forecast-humidity-" + i).text("Humidity: " + data.list[i].main.humidity + "%"); 
                
            }
        })
    
        // Adding all the information on the weather if request is acceptable
        widgets.addClass('bg-primary text-white border border-secondary');
        $('.current').removeClass('hide');
        $('.5day').removeClass('hide');
    })
}



var saveHistory = function () {
    if (input.val() === "") {
        return
    }
    // Save the input with first letter uppercase
    city = input.val().charAt(0).toUpperCase() + input.val().slice(1);
    localStorage.setItem("history", city);
    loadSearch();
}


formID.submit(initial)
formID.submit(saveHistory);