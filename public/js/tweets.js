const token = "pk.eyJ1IjoiYm9va3dvcm1naXJsOTEwIiwiYSI6ImNrYXR2Z2o3azBrbWIyeHB0ZnJxa2Zqc3kifQ.8FZb1SBrTX55wr11JWNxKw";
const morning = "#d54200";
const night = "#539AF9";

const counters = document.getElementsByClassName("counter");
const duration = document.getElementById("duration");
const logToggle = document.getElementById("logToggle");
const log = document.getElementById("log");

let timeOpened = performance.now();
let instancesByType = [0, 0]; // morning, night

let theme = 0;

// TWEETS

(function runMap() {

  var mymap = L.map('mymap', {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView([24.870956, 15.1004003], 13);

  let style_id = (theme == 0) ? "light-v10" : "dark-v10";
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

  var socket = io();
  socket.on('tweet', function (tweet) {

    incrementInstances(tweet.eventType);
    // console.log(tweet);
    // console.log(tweet.text);
    // console.log(tweet.latlng);
    // console.log(tweet.eventType);

    var eventcolor = (tweet.eventType == 0) ? morning : night; // colors
    let popupOptions = {
      maxWidth: 200,
      // maxHeight: 36,
      closeButton: false,
      autoClose: true,
      closeOnEscapeKey: false,
      closeOnClick: true,
      className: "popup",
    };
    var circle = L.circle([tweet.latlng["lat"], tweet.latlng["lng"]], {
      radius: 50000,
      color: eventcolor,
      fillOpacity: 1.0
    })
      .addTo(mymap)
      .bindPopup(tweet.text, popupOptions)
      .openPopup();

    let logEntry = document.createElement("a");
    logEntry.href = tweet.url;
    logEntry.classList.add("logEntry");
    logEntry.classList.add((tweet.eventType == 0) ? "morning" : "night");
    let entryLoc = document.createElement("span");
    entryLoc.classList.add("entryLoc");
    if (tweet.hasOwnProperty("place")) {
      entryLoc.classList.add("place");
      entryLoc.textContent = tweet.place;
    } else {
      entryLoc.classList.add("coords");
      entryLoc.textContent = tweet.latlng["lat"].toFixed(2) + "," + tweet.latlng["lng"].toFixed(2);
    }
    logEntry.append(entryLoc);
    let entryText = tweet.text;
    logEntry.append(entryText);
    log.append(logEntry);
    log.scrollTop = log.scrollHeight;
  });
})();

function incrementInstances(eventType) {
  instancesByType[eventType]++;
  let instances = instancesByType[eventType];
  let pluralStr = getAgreedPluralStr(instances, "time", "times");
  counters[eventType].textContent = instances + " " + pluralStr;
}

function getAgreedPluralStr(num, singularStr, pluralStr) {
  if (num == 1) {
    return singularStr;
  }
  return pluralStr;
}