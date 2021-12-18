require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
// const mtEerie = require("./Lyrics_MountEerie.json");
// const microphones = require("./Lyrics_TheMicrophones.json");
const botUsername = process.env.BOT_USERNAME;
const songsJson = require("./songs.json");
const regex = /[0-9]*EmbedShare\sURLCopyEmbedCopy/;
const song = getSong();
const title = song.title;

const userClient = new TwitterApi({
  appKey: process.env.CONSUMER_APP_KEY,
  appSecret: process.env.CONSUMER_APP_SECRET,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
  accessToken: process.env.ACCESS_OAUTH_TOKEN,
  accessSecret: process.env.ACCESS_OAUTH_SECRET,
});

async function postTweet(tweetContent) {
  let tweet;
  try {
    tweet = await userClient.v2.tweet(tweetContent);
  } catch (error) {
    console.error(error.data.errors || error);
  }
  return tweet;
}

async function quoteTweet(tweetUrl, songTitle) {
  let tweet;
  try {
    tweet = await userClient.v1.tweet(`Song is: ${songTitle}`, {
      attachment_url: tweetUrl,
    });
  } catch (error) {
    console.error(error.data.errors || error);
  }
  return tweet;
}

//@RETURNS RANDOM INTEGER FROM MIN TO MAX (INCLUDING MAX)
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//@RETURNS A RANDOM SONG FROM THE JSON
function getSong() {
  const index = getRandomNumber(0, songsJson.length - 1);
  return songsJson[index];
}

//@RETURNS ARRAY OF TWO LINES FROM THE LYRICS
function getRandomLyricFromSong(song) {
  let lyrics = song.lyrics.replace(regex, "");
  let lyricsArray = lyrics.split("\n");
  if (lyricsArray.length === 1) {
    return lyricsArray[0];
  }

  let startIndex = getRandomNumber(0, lyricsArray.length - 2);
  let endIndex = startIndex + 2;
  return lyricsArray.slice(startIndex, endIndex);
}

function generateTweetContent(lyricArray) {
  return lyricArray.join('/n');
}

function generateTweetUrl(tweetObj) {
  return (
    "https://www.twitter.com/" + botUsername + "/status/" + tweetObj.data.id
  );
}

let tweet = postTweet(generateTweetContent(getRandomLyricFromSong(song)));
tweet.then(function (res) {
  console.log(res);
  // quoteTweet(generateTweetUrl(res), title);
});
