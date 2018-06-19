require("dotenv").config();
var Spotify = require('node-spotify-api')
var Twitter = require('twitter');
var keys = require("./keys.js");
var fs = require("fs");


//var spotify = (keys.spotify);
//var client = new Twitter(keys.twitter);




var liriFunction = process.argv[2];

//Select what function to run 
if (liriFunction == "movie-this") {
    fs.appendFile("log.txt", "\nCommand run: " + liriFunction, function (err) {
        if (err) {
            return console.log(err)
        }
    });
    movieLiri();
}
else {
    if (liriFunction == "spotify-this-song") {
        fs.appendFile("log.txt", "\nCommand run: " + liriFunction, function (err) {
            if (err) {
                return console.log(err)
            }
        });
        spotifyLiri();
    }
    else {
        if (liriFunction == "my-tweets") {
            fs.appendFile("log.txt", "\nCommand run: " + liriFunction, function (err) {
                if (err) {
                    return console.log(err)
                }
            });
            tweetLiri();
        }
        else {
            if (liriFunction == "do-what-it-says") {
                fs.appendFile("log.txt", "\nCommand run: " + liriFunction, function (err) {
                    if (err) {
                        return console.log(err)
                    }
                });
                fs.readFile("random.txt", "utf8", function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var commandArr = data.split(",")
                    //console.log(commandArr);
                    if (commandArr[0] == "movie-this") {
                        infoMovie(commandArr[1]);

                    }
                    if (commandArr[0] == "spotify-this-song") {
                        infoSong(commandArr[1]);
                    }
                    if (commandArr[0] == "my-tweets") {
                        tweetLiri();

                    }

                })
            }
            else {
                console.log("I didn't understand your command");
                fs.appendFile("log.txt", "\nCommand run: " + liriFunction, function (err) {
                    if (err) {
                        return console.log(err)
                    }
                });
            }
        }
    }
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
                    var Title= "The Title of the Movie is: " + JSON.parse(body).Title;
                    var Year="The release year was: " + JSON.parse(body).Year;
                    var Rating= "The IMDB rating is: " + JSON.parse(body).imdbRating;
                    var tomatoesRating= "The Rotten Tomatoes Rating is: " + rottenTomatesrating;
                    var Country= "The country is was produce is: " + JSON.parse(body).Country;
                    var Language="The language of the movie is: " + JSON.parse(body).Language;
                    var Plot= "The plot of the movie is: " + JSON.parse(body).Plot;
                    var Actors="The actors are: " + JSON.parse(body).Actors;

                    console.log(Title);
                    console.log(Year);
                    console.log(Rating);
                    console.log(tomatoesRating);
                    console.log(Country);
                    console.log(Language);
                    console.log(Plot);
                    console.log(Actors);

                    addLog(Title);
                    addLog(Year);
                    addLog(Rating);
                    addLog(tomatoesRating);
                    addLog(Country);
                    addLog(Language);
                    addLog(Plot);
                    addLog(Actors);
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

                var name= "The song name is: " + data.tracks.items[i].name;
                var album="The album of the song is: " + data.tracks.items[i].album.name;
                var artist="The artist is: " + data.tracks.items[i].artists[0].name;
                var link="A preview link of the song can be found in: " + data.tracks.items[i].external_urls.spotify;

                addLog(name);
                addLog(album);
                addLog(artist);
                addLog(link);

                console.log("\n" + name);
                console.log(album);
                console.log(artist);
                console.log(link);
               
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


//Function to get the tweets

function tweetLiri() {
    var client = new Twitter(keys.twitter);

    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (error) throw error;
        //console.log(JSON.stringify(tweets,null,2));  // The tweets
        //console.log(tweets.length);
        //console.log(JSON.stringify(response))   ;  // Raw response object.

        function showTweets() {
            for (var i = 0; i < tweets.length; i++) {
                var numberOftweet = i + 1;
                var tweetText= "Tweet: " + tweets[i].text;
                var tweetDate="Created in: " + tweets[i].created_at;

                addLog(tweetText);
                addLog(tweetDate);


                console.log("\n Tweet " + numberOftweet);
                console.log("\n" + tweetText);
                console.log(tweetDate);
             
            }
        }
        if (tweets.length < 20) {
            var responseNumber = tweets.length;
            console.log("Here are your " + responseNumber + " tweets");
            showTweets();
        }

        if (tweets.lenght >= 20) {
            console.log("Your last 20 tweets are:");
            showTweets();
        }


    });

}

function addLog(logText){
    fs.appendFile("log.txt","\n " + logText, function (err) {
        if (err) {
            return console.log(err)
        }
    })
}