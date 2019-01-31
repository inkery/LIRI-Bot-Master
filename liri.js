require("dotenv").config();

//movie specific variables
var tomatoesRating;
var internetRating;

//npm require
var fs = require("fs");
var moment = require('moment');
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');


//spotify npm specific call to get keys to spotify account
var spotify = new Spotify(keys.spotify);

//grabbing user input variables
var input = process.argv;

//grabs user command for tweets, movies, spotify or random
var command = input[2];
// console.log(input[2]);

//grabs movie or song names to put into request
var name = "";
for (i = 3; i < input.length; i++) {
	name = name + " " + input[i];
}

name = name.trim().replace(" ", "+");
// console.log(name);

 	if (command === "spotify-this-song") {
	if (name === "") {
  		name = "The Sign"
  	}
	//same song info as above but looking at info for "The Sign" by Ace of Base.
	spotify.search({ type: 'track', query: name, limit: 6 }, function(err, data) {
 	if (err) {
    	return console.log('Error occurred: ' + err);
  	}
  	

  	// console.log(data);
  	var track = data.tracks.items[5];
    var mySong =
		"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\n" +
		"Song Title: " + name + "\n" +
		"Artist: " + track.artists[0].name + "\n" +
		"Album: " + track.album.name + "\n" + 
		"Preview Link: " + track.preview_url + "\n" +
		"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\n"
		console.log(mySong);
		writeToLog(mySong);
	})

}

else if (command === "movie-this") {
 	//If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
 	if (name === "") {
 		name = "Mr. Nobody";
 	}

	var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";

	
	// console.log(queryUrl);

	request.get(queryUrl, function(error, response, body) {
		
    	 //console.log(response);
	  	if (!error && response.statusCode === 200) {
	  		//var body = JSON.parse(body);
	  		for (i = 0; i < JSON.parse(body).Ratings.length; i++) {
	  			if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	  				tomatoesRating = JSON.parse(body).Ratings[i].Value;
	  				// console.log(tomatoesRating);
	  			}
	  			if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
	  				internetRating = JSON.parse(body).Ratings[i].Value;
	  				// console.log(internetRating);
	  			}
	  		}
	  		// Display Title of the movie, Year the movie came out, IMDB Rating of the movie, Rotten Tomatoes Rating of the movie, Country where the movie was produced, Language of the movie, Plot of the movie, Actors in the movie.
	  		var myMovie =
  			"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\n" +
    		"Movie Title: " + JSON.parse(body).Title + "\n" +
    		"Year movie released: " + JSON.parse(body).Year + "\n" +
    		"Movie rating: " + JSON.parse(body).Rated + "\n" + 
    		"Rotten Tomatoes Rating: " + tomatoesRating + "\n" +
    		"Internet Movie Database Rating: " + internetRating + "\n" +
    		"Country: " + JSON.parse(body).Country + "\n" + 
    		"Language: " + JSON.parse(body).Language + "\n" + 
			"Movie Plot: " + JSON.parse(body).Plot + "\n" +
			"Actors: " + JSON.parse(body).Actors + "\n" +
			"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\n"
    		console.log(myMovie);
    		writeToLog(myMovie);

  		}
	});

}

else if (command === "concert-this") {
	//If the user doesn't type a artist in, the program will output data for the artist 'Drake'
	if (name === "") {
		name = "Drake";
	}

   var queryUrl = "https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp";

   // console.log(queryUrl);

   request.get(queryUrl, function(error, response, body) {
	   
	    //console.log(response);
		 if (!error && response.statusCode === 200) {
			 userBand = JSON.parse(body);
			if (userBand.length > 0){
					for (i = 0; i < 1; i++){

		concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");	

		var myConcert =	
					
		 (`
		   \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
		   \nVenue: ${userBand[i].venue.name}
		   \nVenue Location: ${userBand[i].venue.latitude}, ${userBand[i].venue.longitude}
		   \nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}
		   \nDate and Time: ${concertDate}			
		   \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		  `);
		  
		  //console.log(`Date and Time: ${concertDate}`);
		
		  
		console.log(myConcert);
		writeToLog(myConcert);	   

		}

		} else{
		console.log("Band or concert not found!");	
		}

		 }
   });

}

if (command === "do-what-it-says") {
	
	fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}
	
		
		var nameArr = data.split(",");
		
		// console.log(nameArr);

		name = nameArr[1]
		// console.log(name);

		spotify.search({ type: 'track', query: name, limit: 1 }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			
			
			// console.log(data);
			var track = data.tracks.items[0];
			var randomSong =
			    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\n" +
				"Song Title: " + name + "\r\n" +
				"Artist: " + track.artists[0].name + "\r\n" +
				"Album: " + track.album.name + "\r\n" + 
				"Preview Link: " + track.preview_url + "\r\n" +
				"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\n"
			console.log(randomSong);
			writeToLog(randomSong);
		})

	});
}


function writeToLog(printInfo) {
	fs.appendFile("log.txt", printInfo, function(err) {

		// If the code experiences any errors it will log the error to the console.
		if (err) {
			return console.log(err);
		}

	});

}

