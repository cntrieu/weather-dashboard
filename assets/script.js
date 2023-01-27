var APIKey = "c360d5cf76f9e7ac3dbfbe0656b8587e";
var city;
var input = $('#search-text');
var searchBtn = $('#search-btn');
var formID = $('#city-form');


var getAPI = function (e) {
    city = input.val();
    e.preventDefault();

    var todayURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=metric";

    fetch(todayURL).then(function(response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        $("#city-name").text(data.name + dayjs().format("(D/M/YYYY)"));
        $("#temp").text("Temp: " + data.main.temp + "°C")

        // Default wind speed for metric is in meter/sec. This is to convert to KMPH.
        $("#wind").text("Wind: " + (data.wind.speed * 3.6).toFixed() + "KMPH")
        $("#humidity").text("Humidity: " + data.main.humidity + "%")
    })

    fetch(forecastURL).then(function(response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
       
        var today = dayjs();
       
        for (let i = 1; i <= 5; i++) {
            let nextDay = today.add(i, 'day');
            $("#date-" + i).text(nextDay.format('DD/MM/YYYY'));
            console.log(data.list[i].weather[0].main);
            
            // if (data.list[i].weather[0].main === "Snow") {
            //     $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/13d@2x.png");
            // }  else if (data.list[i].weather[0].main === "Clouds") {
            //     $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/02d@2x.png");
            // } else if (data.list[i].weather[0].main === "Rain") {
            //     $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/10d@2x.png");
            // } else if (data.list[i].weather[0].main === "Thunderstorm") {
            //     $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/11d@2x.png");
            // } else if (data.list[i].weather[0].main === "Drizzle") {
            //     $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/09d@2x.png");
            // } else {
            //     $("#forecast-image-" + i).attr("src", "http://openweathermap.org/img/wn/01d@2x.png");
            // }

            // Ternary operator to save lines of code
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
}

formID.submit(getAPI)

