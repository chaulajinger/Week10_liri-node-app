var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');
var space = "\n" + "\n" + "\=============================================================";

function writeToLog(data) {
    fs.appendFile("log.txt", '\r\n\r\n');

    fs.appendFile("log.txt", JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("log.txt was updated!");
    });
}

function movieSearch(movieName) {

    if (!movieName) {
        movieName = "Star Wars";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            // console.log(jsonData);
            output = space + "=+==+==+==+===+===+===+= LIRI RESULTS =+==+==+==+===+===+===+=" +
                space + 'Title: ' + jsonData.Title +
                space + 'Year: ' + jsonData.Year +
                space + 'Rated: ' + jsonData.Rated +
                space + 'IMDB Rating: ' + jsonData.imdbRating +
                space + 'Country: ' + jsonData.Country +
                space + 'Language: ' + jsonData.Language +
                space + 'Plot: ' + jsonData.Plot +
                space + 'Actors: ' + jsonData.Actors +
                space + 'IMDb Rating: ' + jsonData.imdbRating + "\n\n\n";

            console.log(output);

            fs.appendFile("log.txt", output, function (err) {
                if (err) throw err;
                console.log('Saved to log.txt!');
            });
        }
    });
}

function spotifySearch(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "We will rock you";
    }

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            output = space + "=================Get LIRI Results ==================" +
                space + "Song Name: " + "'" + songName.toUpperCase() + "'" +
                space + "Album Name: " + data.tracks.items[0].album.name +
                space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +
                space + "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
            console.log(output);

            fs.appendFile("log.txt", output, function (err) {
                if (err) throw err;
                console.log('Saved to log.txt!');  // console.log(spotify);
            });
        };
    });
}

function recentTweets() {
    var client = new twitter(keys.twitter);
    var params = { screen_name: 'Cjin91709460', count: 20 };

    client.get('statuses/user_timeline', params, function (err, tweets, res) {

        if (!err) {
            let data = [];
            for (let i = 0; i < tweets.length; i++) {
                data.push({
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
            }
            console.log(data);    // console.log(tweets);
            writeToLog(data);
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        writeToLog(data);
        var dataArr = data.split(',')

        if (dataArr.length == 2) {
            choice(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            (dataArr[0]);
        }

    });
}

function choice(caseData, functionData) {
    switch (caseData) {
        case 'spotify-this-song':
            spotifySearch(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'my-tweets':
            recentTweets();
            break;
        case 'movie-this':
            movieSearch(functionData);
            break;
        default:
            console.log('Please try again! Use liri commands');
    }
}

function appStart(argOne, argTwo) {
    choice(argOne, argTwo);
};

appStart(process.argv[2], process.argv[3]);