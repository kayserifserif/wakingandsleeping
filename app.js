if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Twitter = require("Twitter");
const got = require("got");
 
var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

searchstr = "Good morning,Good night,Buenas dias,Buenas noches,صباح الخير,تصبح على خير"
var stream = client.stream("statuses/filter", {track: searchstr});
stream.on("data", function(event) {
  if (event.user.location || event.coordinates || event.place) {
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
		} else if (place) {
			bbox = place.bounding_box.coordinates;
			latlng["lng"] = (bbox[0] + bbox[2]) * 0.5;
			latlng["lat"] = (bbox[1] + bbox[3]) * 0.5;
			console.log("place", latlng);
			console.log(event.text);
			console.log();
		} else {
			let userloc = event.user.location;
			if (userloc.includes(".com")) {
				console.log("No results found for:", userloc);
			} else {
				// get coords with mapquestapi
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
						} else {
							console.log("No results found for:", userloc);
						}
					} catch (error) {
						console.log("No results found for:", userloc);
						throw error;
					}
				})();
			}
		}
  }
}); 
stream.on("error", function(error) {
  throw error;
});


// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
