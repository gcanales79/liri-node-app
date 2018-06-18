require("dotenv").config();
var Spotify = require('node-spotify-api')

var keys = require("./keys.js");


//var spotify = (keys.spotify);
//var client = new Twitter(keys.twitter);




var liriFunction = process.argv[2];

//Select what function to run 
if (liriFunction == "movie-this") {
    movieLiri();
}

if (liriFunction == "spotify-this-song") {
    spotifyLiri();
}


function movieLiri() {
    // Create an empty variable for holding the movie name
    var movieName = "";

    var request = require("request");

    if (process.argv[3] == null) {
        movieName = "Mr. Nobody"
        infoMovie(movieName);
    }
    else {

        // Store all of the arguments in an array
        var nodeArgs = process.argv;


        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 2 && i < nodeArgs.length) {

                movieName = movieName + "+" + nodeArgs[i];

            }

            else {

                movieName += nodeArgs[i];

            }
        }

        infoMovie(movieName)
    }


    function infoMovie(movieName) {
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        // This line is just to help us debug against the actual URL.

        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                if (JSON.parse(body).Response == "False") {
                    console.log("Sorry I didn't find the movie")
                }
                else {
                    //console.log(JSON.parse(body));
                    var rottenTomatesrating = "Not Available";

                    for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
                        if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                            rottenTomatesrating = JSON.parse(body).Ratings[i].Value
                        }

                    }

                    // Parse the body of the site and recover the info

                    console.log("The Title of the Movie is: " + JSON.parse(body).Title);
                    console.log("The release year was: " + JSON.parse(body).Year);
                    console.log("The IMDB rating is: " + JSON.parse(body).imdbRating);
                    console.log("The Rotten Tomatoes Rating is: " + rottenTomatesrating);
                    console.log("The country is was produce is: " + JSON.parse(body).Country);
                    console.log("The language of the movie is: " + JSON.parse(body).Language);
                    console.log("The plot of the movie is: " + JSON.parse(body).Plot);
                    console.log("The actors are: " + JSON.parse(body).Actors);

                }
            }
        });


    }
}


//Get all the information from the song
function infoSong(songName) {

    var spotify = new Spotify(keys.spotify);
    var numberOfSearch = 5;

    spotify.search({ type: 'track', query: songName, limit: numberOfSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        if (data.tracks.total > 0) {
            console.log("Some suggestions are: ")
            for (var i = 0; i < numberOfSearch; i++) {

                console.log("\nThe song name is: " + data.tracks.items[i].name)
                console.log("The album of the song is: " + data.tracks.items[i].album.name)
                console.log("The artist is: " + data.tracks.items[i].artists[0].name)
                console.log("A preview link of the song can be found in: " + data.tracks.items[i].external_urls.spotify)
            }
        }
        else {
            console.log("I didn't find a song matching");
        };
        //console.log(data.tracks.total);
    });
}

function spotifyLiri() {
    // Create an empty variable for holding the movie name
    var songName = "";


    if (process.argv[3] == null) {
        songName = "The Sign Ace of Base"
        infoSong(songName);
    }
    else {

        // Store all of the arguments in an array
        var nodeArgs = process.argv;


        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 2 && i < nodeArgs.length) {

                songName = songName + "+" + nodeArgs[i];

            }

            else {

                songName += nodeArgs[i];

            }
        }

        infoSong(songName)
    }
}