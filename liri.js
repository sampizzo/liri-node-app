require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

// capture the command that the user puts in (process.argv[2])
var userCommand = process.argv[2];
console.log(userCommand);

// capture the user's search term (process.argv index 3 and later) (*use activity 18 level 2 for guidance on how to capture this!*)
var userSearch = process.argv.slice(3).join("+");
console.log(userSearch);

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
            tryAgain();
    }
}



// check if userCommand is "concert-this"
// run an API call using axios to the bands-in-town API
// inject the user's search term in the queryURL
var concertThis = function () {
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
                "-----------------------------------------"
            ].join("\r\n");

            //Append concertData to log.txt, print concertData to console
            fs.appendFile("log.txt", concertData, function (err) {
                if (err) throw err;
                console.log(concertData);
            });
        };

    });
};

// check if userCommand is "spotify-this-song"
// Using Spotify Node package info and documentation, make a call to the Spotify API using the user's search term
var spotifyThisSong = function () {
    // Provide a default search term if the user didn't provide an argument
        if (userSearch === "") {
            userSearch = "Africa";
        }
        spotify.search({
                    type: "track",
                    query: userSearch,
                    limit: 10
                }, function (err, data) {
                    if (err) {
                        return console.log("Error occurred: " + err);
                    }
                    console.log("userSearch: " + userSearch);
                    // Display to the user:
                    // * Artist(s)
                    // * The song's name
                    // * A preview link of the song from Spotify
                    // * The album that the song is from
                    console.log("Artist(s): ");
                    console.log("Song: ");
                    console.log("Link: ");
                    console.log("Album: ");
                    
                }
        )};//end spotifyThisSong
        
                // check if userCommand is "movie-this"

                // Use Axios to call the OMDB API using the user's search term. Use activities 17 and 18 as a reference!

                // Display to the user:
                // * Title of the movie.
                // * Year the movie came out.
                // * IMDB Rating of the movie.
                // * Rotten Tomatoes Rating of the movie.
                // * Country where the movie was produced.
                // * Language of the movie.
                // * Plot of the movie.
                // * Actors in the movie.

                // Provide a default search if the user didn't provide an argument.

                // check if userCommand is "do-what-it-says" (DO THIS PART OF THE ASSIGNMENT ONLY IF THE OTHER THREE API CALLS WORK WELL!)

                // Use "fs" to read the random.txt file (hint, you will need to require fs! Look at activities 12 and 13)
                // The command will be whatever is before the comma. The search term will be whatever is after the comma.
                // Make the corresponding API call depending on what the command is.

                // If the user doesn't provide 1 of the 4 recognizable commands, display message to the user to try again

                runSwitch(userCommand, userSearch);