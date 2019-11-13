require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

// capture the command that the user puts in (process.argv[2])
var userCommand = process.argv[2];
//console.log(userCommand);

// capture the user's search term (process.argv index 3 and later) (*use activity 18 level 2 for guidance on how to capture this!*)
var userSearch = process.argv.slice(3).join("+");
//console.log(userSearch);

var doWhatItSays = function(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        }
        var randomTxt = data.split(",");
        //console.log(randomTxt[0] + ", " + randomTxt[1]);
        userCommand = randomTxt[0];
        userSearch = randomTxt[1];
        //runSwitch(randomTxt[0], randomTxt[1]);
        runSwitch(userCommand, userSearch);
    
    });
};

// Make a switch statement for the four commands. The default case should tell the user to try again.

function runSwitch(userCommand, userSearch) {
    switch (userCommand) {
        case "concert-this":
            concertThis(userSearch);
            break;
        case "spotify-this-song":
            spotifyThisSong(userSearch);
            break;
        case "movie-this":
            movieThis(userSearch);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Please enter a valid command: concert-this [band name], spotify-this-song [song title], movie-this [movie title], do-what-it-says");
    }
}



// check if userCommand is "concert-this"
// run an API call using axios to the bands-in-town API
// inject the user's search term in the queryURL
var concertThis = function () {
    //console.log("concertThis userSearch: " + userSearch);
    var URL = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function (response) {
        //console.log(response.data[0]);
        // Display name of venue, venue location, and the date of the event

        for (var i = 0; i < 5; i++) {
            //console.log("Venue: " + response.data[i].venue.name);
            //console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
            //console.log("Date: " + response.data[i].datetime);
            // Format the date of the event to be MM/DD/YYYY
            var datetime = response.data[i].datetime;
            var date = moment(datetime, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY");
            //console.log("Date: " + date);
            //Put it all into an array to append to log.txt and console.log
            var concertData = [
                "Lineup: " + response.data[i].lineup,
                "Venue: " + response.data[i].venue.name,
                "Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country,
                "Date: " + date,
                "--------------------------------------------------------------------------\n"
            ].join("\n");

            //Append concertData to log.txt, print concertData to console
            fs.appendFile("log.txt", concertData, function (err) {
                if (err) throw err;
                console.log(concertData);
            });
        };

    });
}; //END concertThis

// check if userCommand is "spotify-this-song"
// Using Spotify Node package info and documentation, make a call to the Spotify API using the user's search term
var spotifyThisSong = function () {
    // Provide a default search term if the user didn't provide an argument
    if (userSearch === "") {
        userSearch = "Africa";
    }
    spotify
        .search({
            type: "track",
            query: userSearch,
            limit: 10
        })
        .then(function (response) {
            //console.log(response.tracks.items[0]);
            // Display to the user:
            // * Artist(s)
            // * The song's name
            // * A preview link of the song from Spotify
            // * The album that the song is from
            // console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
            // console.log("Song: " + response.tracks.items[0].name);
            // console.log("Spotify Song Link: " + response.tracks.items[0].external_urls.spotify);
            // console.log("Album: " + response.tracks.items[0].album.name);

            //Put everything in array for log.txt and console.log
            var songData = [
                "Artist(s): " + response.tracks.items[0].artists[0].name,
                "Song: " + response.tracks.items[0].name,
                "Spotify Song Link: " + response.tracks.items[0].external_urls.spotify,
                "Album: " + response.tracks.items[0].album.name,
                "--------------------------------------------------------------------------\n"
            ].join("\n");

            //Append songData to log.txt, print songData to console
            fs.appendFile("log.txt", songData, function (err) {
                if (err) throw err;
                console.log(songData);
            });

        })
        .catch(function (err) {
            console.log(err);
        });
}; //end spotifyThisSong

// Provide a default search if the user didn't provide an argument.
var movieThis = function (){
    if (userSearch === ""){
        userSearch = "Ghostbusters";
    }
    var URL = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";

    axios.get(URL).then(function (response) {
        //console.log(response.data);
        // Display to the user:
        // * Title of the movie.
        // * Year the movie came out.
        // * IMDB Rating of the movie.
        // * Rotten Tomatoes Rating of the movie.
        // * Country where the movie was produced.
        // * Language of the movie.
        // * Plot of the movie.
        // * Actors in the movie.
        var movieData = [
            "Movie Title: " + response.data.Title,
            "Year: " + response.data.Year,
            "IMDB Rating: " + response.data.imdbRating,
            "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
            "Country: " + response.data.Country,
            "Language: " + response.data.Language,
            "Plot: " + response.data.Plot,
            "Starring: " + response.data.Actors,
            "--------------------------------------------------------------------------\n"
            ].join("\n");

            //Append movieData to log.txt, print movieData to console
            fs.appendFile("log.txt", movieData, function (err) {
                if (err) throw err;
                console.log(movieData);
            });
    });
}; //END movieThis



runSwitch(userCommand, userSearch);