// setup and modules

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = 3000;

// twitter
const Twit = require("twit");
// http
const got = require("got");
// express
const express = require('express')
var app = express();
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// socket
const server = require("http").Server(app);
const io = require("socket.io")(server);

// server

var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

server.listen(port);

// twitter streaming

const morning = ["Good morning", "Buenas dias", "صباح الخير", "সুপ্রভাত", "शुभ प्रभात", "Доброе утро", "Bom Dia", "おはようございます", "Guten Morgen", "Sugeng enjang", "좋은 아침", "Bon matin", "Günaydın", "Chào buổi sáng", "శుభోదయం", "शुभ प्रभात", "காலை வணக்கம்", "Buongiorno", "صبح بخیر", "સુપ્રભાત", "Dzień dobry", "Доброго ранку", "സുപ്രഭാതം", "ಶುಭೋದಯ"];
let morningre = new RegExp(morning.join("|"), "i")
const night = ["Good night", "Buenas noches", "تصبح على خير", "শুভ রাত্রি", "शुभ रात्रि", "Доброй ночи", "Boa noite", "おやすみ", "Gute Nacht", "Sugeng dalu", "안녕히 주무세요", "Bonne nuit", "İyi geceler", "Chúc ngủ ngon", "శుభ రాత్రి", "शुभ रात्री", "இனிய இரவு", "Buona notte", "شب بخیر", "શુભ રાત્રી", "Dobranoc", "Надобраніч", "ശുഭ രാത്രി", "ಶುಭ ರಾತ್ರಿ", "Noapte buna"];
let nightre = new RegExp(night.join("|"), "i")
const morningnight = morning.concat(night);
var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 10*1000
});

// socket.io communication

var stream = T.stream("statuses/filter", { track: morningnight });
var allClients = []; // https://stackoverflow.com/a/17311682

io.on("connect", (socket) => {

  console.log('a user connected');
  allClients.push(socket.id);

  stream.on("tweet", function(tweet) {

    // no need to act if no clients are there
    if (allClients.length == 0) return;
    // exclude retweets
    if (tweet.retweeted || tweet.text.substring(0, 4) === "RT @") return;
    // only look at geotagged tweets
    if (!tweet.place) return;
    // api finds phrases in more than just the tweet text; exclude those
    if (!morningre.test(tweet.text) && !nightre.test(tweet.text)) return;

    // console.log(tweet);
    // console.log();

    let text = (tweet.hasOwnProperty("extended_tweet")) ? tweet.extended_tweet.full_text : tweet.text;
    let eventType = (morningre.test(tweet.text)) ? 0 : 1; // 0 for morning, 1 for night
    let latlng = {};
    let place = "";
    if (tweet.place) {
      let bbox = tweet.place.bounding_box.coordinates[0];
      latlng["lng"] = (bbox[0][0] + bbox[2][0]) * 0.5;
      latlng["lat"] = (bbox[0][1] + bbox[2][1]) * 0.5;
      place = tweet.place.full_name;
      console.log(tweet.text);
      console.log("place", latlng);
      console.log();
    } else if (tweet.coordinates) {
      latlng["lng"] = tweet.coordinates.coordinates[0];
      latlng["lat"] = tweet.coordinates.coordinates[1];
      console.log(tweet.text);
      console.log("coords", latlng);
      console.log();
    }

    let tweetObj = {
      "text": text,
      "eventType": eventType,
      "latlng": latlng,
      "place": place,
      "url": "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str
    };

    socket.emit("tweet", tweetObj)

    // } else {

    //   let userloc = tweet.user.location;

    //   // try to detect non-place locations
    //   if (userloc.includes(".com")) {
    //     console.log("No results found for:", userloc);
    //     return;
    //   }

    //   // try to get coords with mapquest api
    //   (async () => {
    //     try {
    //       let mapquestapi = "http://www.mapquestapi.com/geocoding/v1/address"
    //       const response = await got(mapquestapi, {
    //         searchParams: {
    //           key: process.env.MAPQUEST_KEY,
    //           location: userloc
    //         },
    //         responseType: "json"
    //       });
    //       let firstresult = response.body.results[0].locations[0];
    //       let gq = firstresult.geocodeQuality;
    //       if (gq === "CITY" || gq === "STATE" || gq === "COUNTRY") {
    //         latlng["lng"] = firstresult.latLng["lng"];
    //         latlng["lat"] = firstresult.latLng["lat"];
    //         console.log("location", userloc, latlng);
    //         console.log(tweet.text);
    //         console.log();
    //         io.emit("tweet", {"latlng": latlng, "text": tweet.text, "eventType": eventType });
    //       } else {
    //         console.log("No results found for:", userloc);
    //       }
    //     } catch (error) {
    //       console.log("No results found for:", userloc);
    //       throw error;
    //     }
    //   })();

    // }

  });

  stream.on("error", function(error) {
    if (allClients.length == 0) return;
    throw error;
  });

  socket.on("disconnect", (reason) => {
    console.log("a user disconnected");
    var i = allClients.indexOf(socket.id);
    allClients.splice(i, 1);
  });

});