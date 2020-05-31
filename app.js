// setup and modules

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = 3000;

// twitter
const Twitter = require("Twitter");
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

const morning = "Good morning,Buenas dias,صباح الخير"
const night = "Good night,Buenas noches,تصبح على خير"
var twitter = new Twitter({
 consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var stream = twitter.stream("statuses/filter", { track: morning + "," + night });

// socket.io communication

io.on('connection', (socket) => {

  console.log('a user connected');

  stream.on("data", function(event) {
    
    // only look at tweets with an estimable place
    if (!event.user.location && !event.coordinates && !event.place) {
      return;
    }

    let coords = event.coordinates; // tweet coordinates
    let place = event.place; // tweet place, returns bounding box of coords
    let text = event.text;
    let latlng = {};

    if (coords) {
      latlng["lng"] = coords[0];
      latlng["lat"] = coords[1];
      console.log("coords", latlng);
      console.log(event.text);
      console.log();
      io.emit("tweet", {"latlng": latlng, "text": event.text});
    } else if (place) {
      bbox = place.bounding_box.coordinates[0];
      latlng["lng"] = (bbox[0][0] + bbox[2][0]) * 0.5;
      latlng["lat"] = (bbox[0][1] + bbox[2][1]) * 0.5;
      console.log("place", latlng);
      console.log(event.text);
      console.log();
      io.emit("tweet", {"latlng": latlng, "text": event.text});
    } else {

      let userloc = event.user.location;

      // try to detect non-place locations
      if (userloc.includes(".com")) {
        console.log("No results found for:", userloc);
        return;
      }

      // get coords with mapquest api
      (async () => {
        try {
          let mapquestapi = "http://www.mapquestapi.com/geocoding/v1/address"
          const response = await got(mapquestapi, {
            searchParams: {
              key: process.env.MAPQUEST_KEY,
              location: userloc
            },
            responseType: "json"
          });
          let firstresult = response.body.results[0].locations[0];
          let gq = firstresult.geocodeQuality;
          if (gq === "CITY" || gq === "STATE" || gq === "COUNTRY") {
            // latlng = firstresult.latLng;
            latlng["lng"] = firstresult.latLng["lng"];
            latlng["lat"] = firstresult.latLng["lat"];
            console.log("location", userloc, latlng);
            console.log(event.text);
            console.log();
            io.emit("tweet", {"latlng": latlng, "text": event.text});
          } else {
            console.log("No results found for:", userloc);
          }
        } catch (error) {
          console.log("No results found for:", userloc);
          throw error;
        }
      })();

    }
    
  });

  stream.on("error", function(error) {
    throw error;
  });

});