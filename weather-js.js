/**
 * FILENAME:    weather-js.js
 * DESCRIPTION: This is the javascript for codyschindler.com/fcc/weather.
 * REQS:        jQuery
 * VERISON:     1.0.1
 * UPDATED:     2015-11-24
 * WRITTEN BY:  Cody Schindler (quiksand)
 * ORGANIZATION: n/a
 * CHANGELOG:  
 * 1.0.1 (2015-11-24): Launch
 * 1.0.0 (2015-11-18): Creation
**/

//TODO/Issues:
//There are way too many weather codes to get pictures for, so I simplified them down to the basics.
//Cardinal weather directions are only accurate up to 45 degrees.
//Location may not display properly in some places, but should be ok for major cities.
//It's hard to independently verify the weather accuracy because every weather service seems to read forma  different station or group of stations.
//Google api doesn't require a key, but the weather api does. API key is not hidden, so I need to get that going server-side.

$(document).ready(function(){

	//globals for temperature, switching variable
	var temperature = ["0&#8451", "32&#8457"];
	var displayTemp = 1;

	//function gets location data from client browser and passes it to getURL()
	function getLatLon() {
		if(!navigator.geolocation){
			$(".error-row").text("Not in San Francisco? Please allow location data to see weather in your area.");
			getURL(37.7833,-122.4167);
		}
		else{
			$(".error-row").addClass("hidden");
			navigator.geolocation.getCurrentPosition(function(pos){
				var lat = pos.coords.latitude;
				var lon = pos.coords.longitude;
				getURL(lat,lon);
			});
		}
	}

	//title cases the displayed weather
	function titleCase(str) {
		str = str[0].toUpperCase() + str.slice(1);
		for(var i = 1; i<str.length; i++){
			if(str[i-1]==' '){
				str = str.slice(0,i) + str[i].toUpperCase() + str.slice(i+1);
			}
			else{
				str = str.slice(0,i) + str[i].toLowerCase() + str.slice(i+1);
			}
		}
		return str;
	}

	//generates urls for apis, calls them 
	function getURL(lat,lon){
		//use weather api
		var url = "http://api.openweathermap.org/data/2.5/weather?lat=";
		url += lat + "&lon=" + lon + "&APPID=247a01b6954b44e1b56dcbacb7874baf";
		console.log("weather api json: " + url);
		$.get(url, weather);

		//use location api
		url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=false";
				console.log("location api json: " + url);
		$.get(url, loc);
	}

	//displays weather info and pictures when passes weather api json
	function weather(json){
		var tempK = json.main.temp;
		var tempC = (tempK - 273.15).toFixed(1);
		var tempF = (tempC * 1.8 + 32).toFixed(1);
		temperature = [tempC + "&#8451", tempF + "&#8457"];
		
		// $(".temp").text(json.main.temp);
		$(".weather").text(titleCase(json.weather[0].description));
		$(".wind").text(degToCardinal(json.wind.deg) + (json.wind.speed*2.23694).toFixed(2) + " mph");
		var html = "<h1>" + temperature[displayTemp] + "</h1>";
		weatherImage = "url('" + getImage(json.weather[0].id) + "')";
		$("body").css("background-image", weatherImage);
		$(".temp").html(html);
		html = "<img src='http://openweathermap.org/img/w/" + json.weather[0].icon + ".png'/>";
		$(".icon").html(html);
	}

	//displays city name when passed google location api json
	function loc(json){
		$(".location").text(json.results[0].address_components[3].long_name +", " + json.results[0].address_components[5].short_name);
	}

	//converts degrees to cardinal directions
	function degToCardinal(degrees){
		if(degrees < 22.5){return "N "}
		else if( degrees < 67.5){return "NE "}
		else if( degrees < 112.5){return "E "}
		else if( degrees < 157.5){return "SE "}
		else if( degrees < 202.5){return "S "}
		else if( degrees < 247.5){return "SW "}
		else if( degrees < 292.5){return "W "}
		else if( degrees < 337.5){return "NW "}
		else{return "N "}
	}
	
	//gets a background image depending on weather id
	function getImage(id){
		var url = "";
		if(id < 300){
			//thunderstorm
			url = 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Cloud_to_ground_lightning_strikes_south-west_of_Wagga_Wagga.jpg';
		}
		else if(id < 600){
			//rain
			url = 'http://valleyheritageradio.ca/newsite/wp-content/uploads/2014/06/heavy-rain-artistic-wallpaper-2560x1600-1426.jpg';
		}
		else if(id < 700){
			//snow
			url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHMC23FnfARtLIbaHjikZqk3cbVhS52fnX94RP2aWW4D8nKHtBKw';
		}
		else if(id < 800){
			//atmosphere
			url = 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Li_River_8_hills_in_mist_near_Guilin.jpg';
		}
		else if(id == 800){
			//clear
			url = 'http://p1.pichost.me/i/68/1924612.jpg';
		}
		else if(id < 900){
			//clouds
			url = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcROq0FtNM53vd-vH4_89Usyb_coqaPOQyZloejITdPUcdFPN7hJCw';
		}
		else if(id >= 900){
			url = "http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-weather-clouds-tornado-rain-cyclone-flashlights-awesome/wallpaper-fire-tornado-weather.jpg";
		}
		else {
			url = 'http://p1.pichost.me/i/68/1924612.jpg';
		}
		return url;
	}

	//starts the ball rolling
	getLatLon();

	//changes the temperature displayed between celcius and farenheit. Reloads weatehr and location
	$(".temp").click(function(){
		if(displayTemp == 1){
			displayTemp = 0;
			getLatLon();
		}
		else{
			displayTemp = 1;
			getLatLon();
		}
	});

});