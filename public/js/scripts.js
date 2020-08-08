const token = "pk.eyJ1IjoiYm9va3dvcm1naXJsOTEwIiwiYSI6ImNrYXR2Z2o3azBrbWIyeHB0ZnJxa2Zqc3kifQ.8FZb1SBrTX55wr11JWNxKw";

let timeOpened = performance.now();
let instancesMorning = 0;
let instancesNight = 0;
let counters = document.getElementsByClassName("counter");
let duration = document.getElementById("duration");

let lat = 0;
let lon = 0;
let isDay = false;
function setDayOrNight() {
  let now = new Date();
  let times = SunCalc.getTimes(now, lat, lon);
  let sunrise = times.sunrise;
  let sunset = times.sunset;
  let themeLink = document.getElementById("themeLink");
  if (now > sunrise && now < sunset) {
    isDay = true;
    themeLink.href = "/css/day.css";
  } else {
    isDay = false;
    themeLink.href = "/css/night.css";
    // isDay = true;
    // themeLink.href = "/css/day.css";
  }
  operateMap();
}
// ask for geolocation
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      setDayOrNight();
    },
    (error) => {
      console.log(error);
      setDayOrNight();
    },
    {
      enableHighAccuracy: false,
      timeout: 5000, // 5s
      maximumAge: 300000 // 5min
    });
}

function operateMap() {

  var mymap = L.map('mymap', {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView([24.870956, 15.1004003], 13);

  let style_id = (isDay) ? "light-v10" : "dark-v10";
  L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
      <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
      Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 3,
    username: 'mapbox',
    style_id: style_id,
    tilesize: 512,
    // zoomOffset: -1,
    accessToken: token
  }).addTo(mymap);

  let alert = document.getElementById("alert");
  let isPinsEphemeral;
  let toggleRadios = document.getElementsByClassName("toggle-radio");
  for (let toggleRadio of toggleRadios) {
    if (toggleRadio.checked) {
      isPinsEphemeral = (toggleRadio.value === "ephemeral");
    }
    toggleRadio.addEventListener("click", (event) => {
      isPinsEphemeral = (toggleRadio.value === "ephemeral");
      if (isPinsEphemeral) {
        alert.textContent = "Tweets will appear and fade."
        let pins = document.getElementsByClassName("leaflet-interactive");
        for (let pin of pins) {
          pin.remove();
        }
        let popups = document.getElementsByClassName("leaflet-popup");
        for (let popup of popups) {
          popup.remove();
        }
      } else {
        alert.textContent = "Tweets will appear and stay."
      }
      alert.classList.add("visible");
      setTimeout(() => { alert.classList.remove("visible"); }, 2000);
    });
  }

  var socket = io();
  socket.on('tweet', function (tweet) {

    incrementInstances(tweet.eventtype);
    // console.log(tweet.text);
    // console.log(tweet.latlng);
    // console.log(tweet.eventtype);

    var eventcolor = (tweet.eventtype) ? "#D9A232" : "#4A89DC"; // yellow and blue
    let popupOptions = {
      maxWidth: 200,
      maxHeight: 36,
      closeButton: false,
      autoClose: true,
      closeOnEscapeKey: false,
      closeOnClick: true,
      className: "popup"
    };
    if (isPinsEphemeral) {
      popupOptions.autoClose = false;
    }
    var circle = L.circle([tweet.latlng["lat"], tweet.latlng["lng"]], {
      radius: 50000,
      color: eventcolor,
      fillOpacity: 1.0
    })
      .addTo(mymap)
      .bindPopup(tweet.text, popupOptions)
      .openPopup();
    (async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      if (isPinsEphemeral) {
        circle.togglePopup();
        circle.remove();
      }
    })();
  });
}

function incrementInstances(eventtype) {
  // instances++;
  if (eventtype == 1) {
    instancesMorning++;
  } else {
    instancesNight++;
  }
  let morningStr = instancesMorning;
  if (instancesMorning == 1) {
    morningStr += " time";
  } else {
    morningStr += " times";
  }
  let nightStr = instancesNight;
  if (instancesNight == 1) {
    nightStr += " time";
  } else {
    nightStr += " times";
  }
  counters[0].textContent = morningStr;
  counters[1].textContent = nightStr;
}

function updateDuration() {
  let now = performance.now();
  let nowInMinutes = now / 1000 / 60;
  let hours = Math.floor(nowInMinutes / 60);
  let minutes = Math.round(nowInMinutes % 60);

  let durationStr = "";
  if (hours == 0 && minutes == 0) {
    durationStr = "Within this minute";
  } else {
    durationStr = "In ";
    if (hours == 1 || (hours == 0 && minutes == 1)) {
      durationStr += "this ";
    } else {
      durationStr += "these ";
    }
    if (hours > 0) {
      if (hours == 1) {
        durationStr = hours + " hour";
        if (minutes != 0) {
          durationStr += " and ";
        }
      } else {
        durationStr += hours + " hours";
        if (minutes != 0) {
          durationStr += " and ";
        }
      }
    }
    if (minutes > 0) {
      if (minutes == 1) {
        durationStr += minutes + " minute";
      } else {
        durationStr += minutes + " minutes";
      }
    }
  }

  duration.textContent = durationStr;

  setTimeout(updateDuration, 1000);
}

updateDuration();