const token = "pk.eyJ1IjoiYm9va3dvcm1naXJsOTEwIiwiYSI6ImNrYXR2Z2o3azBrbWIyeHB0ZnJxa2Zqc3kifQ.8FZb1SBrTX55wr11JWNxKw";
const morning = "#d54200";
const night = "#539AF9";

let timeOpened = performance.now();
let instancesMorning = 0;
let instancesNight = 0;
let counters = document.getElementsByClassName("counter");
let duration = document.getElementById("duration");

let theme = 1;

(function runMap() {

  var mymap = L.map('mymap', {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView([24.870956, 15.1004003], 13);

  let style_id = (theme == 1) ? "light-v10" : "dark-v10";
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

    var eventcolor = (tweet.eventtype) ? morning : night; // colors
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
})();

function incrementInstances(eventtype) {
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

(function updateDuration() {
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
        if (minutes > 0) {
          durationStr += " and ";
        }
      } else {
        durationStr += hours + " hours";
        if (minutes > 0) {
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
})();